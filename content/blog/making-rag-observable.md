---
title: "Making RAG observable: showing which passages a voice AI retrieved"
slug: making-rag-observable
date: "2026-11-25"
description: "RAG from first principles (embeddings, chunking, top-k, thresholds), then the design of a retrieval-trace feature for a production voice agent: lazy fetch and cache, SSRF-safe fetching, feature-flag rollout, and bounded storage."
tags: ["RAG", "LLMs", "Voice AI", "System design", "Security"]
author: "Qazi Noorul Mateen"
draft: true
---

When a voice AI gives a caller an answer, the person reviewing that call later wants to know one thing: **why did it say that?**

I lead AI development on a healthcare voice receptionist, an agent that answers clinic phone lines, explains services, and helps people book. The agent runs on a hosted voice-agent platform that handles speech recognition, the language model, and retrieval-augmented generation (RAG). Answers were grounded in each clinic's knowledge library, but the people reviewing calls couldn't see which passages the agent had used. If an answer was wrong, there was no quick way to tell whether the library itself was wrong, the retrieval picked the wrong passage, or the model went beyond what it was given.

So I built a **retrieval trace**: under every agent reply in a call transcript, a small expandable panel lists the passages the agent retrieved for that reply, in rank order. This post covers the RAG basics you need to follow along, then the design and the trade-offs.

---

## Part 1: RAG in five minutes

### The idea

A language model is fluent, but it doesn't know *your* clinic's hours, prices, or booking rules. RAG fixes that in three steps:

1. **Retrieval:** find the few pieces of your own text that are most relevant to the question.
2. **Augmentation:** paste those pieces into the model's prompt.
3. **Generation:** the model writes an answer **grounded** in that text instead of its general memory.

Think of a new receptionist with a binder. She doesn't read the whole binder for every call. She flips to the three or four pages that look relevant and answers from those.

### The vocabulary

- **Chunking.** Documents are cut into small passages (a paragraph, a Q&A pair, a section under a heading). Whole documents are too long and too unfocused to match well or fit in a prompt. If chunks are too small, they lose context. If they're too big, the match gets diluted and they waste prompt space.
- **Embeddings.** An embedding model turns a piece of text into a vector, a list of numbers that represents its *meaning*. Texts with similar meaning point in similar directions. Real embeddings have hundreds to thousands of dimensions.
- **Vector (semantic) search.** Embed the question, then find the chunks whose vectors are closest to it. It matches on meaning, not keywords: "can I just walk in?" can match a passage titled "Same-day visits".
- **Cosine similarity.** The usual closeness score. It measures the angle between two vectors:
  `cos(q, d) = (q · d) / (|q| × |d|)`. A score of 1 means the same direction (same meaning). Lower scores mean less related.
- **top-k.** Keep only the best *k* matches. This limits prompt size, latency, and cost.
- **Similarity threshold.** Drop any match below a minimum score, even if it's in the top-k. This way, when nothing in the library is relevant, the model isn't handed irrelevant text. The two settings work together: you get *at most* k passages, sometimes fewer, sometimes none.

### A tiny worked example

Pretend the embedding model only measures three things: **[booking, pricing, location/hours]**.

| Chunk | Vector |
|---|---|
| A: "How to book, same-day visits" | [0.9, 0.1, 0.1] |
| B: "Self-pay prices" | [0.2, 0.9, 0.1] |
| C: "Locations and hours" | [0.3, 0.1, 0.9] |

A caller asks *"Can I come in today without an appointment?"* and the query embeds to **q = [0.8, 0.1, 0.4]**, so |q| = √0.81 = 0.900.

| Chunk | q · chunk | \|chunk\| | cosine |
|---|---|---|---|
| A | 0.72 + 0.01 + 0.04 = 0.77 | 0.911 | **0.939** |
| B | 0.16 + 0.09 + 0.04 = 0.29 | 0.927 | **0.347** |
| C | 0.24 + 0.01 + 0.36 = 0.61 | 0.954 | **0.711** |

With **k = 2** and a **threshold of 0.5**, A ranks first and C second. B is dropped by the threshold. A and C go into the prompt, and the model answers: *"Yes, same-day visits are available. Here's how to book, and here are today's hours."*

At a few dozen chunks, comparing the query against every vector is instant. At millions, you'd use an approximate nearest-neighbour index such as HNSW or IVF, which gives up a little recall for much lower latency.

---

## Part 2: Designing the retrieval trace

### The constraint: retrieval is a black box

The platform runs retrieval for us. We don't choose the embedding model, chunk size, or index, and we can't see the similarity scores. So the first design question wasn't "how do we compute this?" It was **"what ground truth already exists?"**

It turned out the platform keeps a per-call retrieval record. For each agent response, it lists the passages retrieved and the retrieval settings used, keyed by a response ID that also appears on that turn in the transcript. Our backend already received a link to this record when the platform notified us that a call had finished.

That changed the problem. I didn't need to rebuild retrieval. I needed to **read the platform's own record safely, join it to the transcript, and show it.**

I specifically avoided re-running retrieval on our side. Our own embeddings and ranking would give *our* idea of what's relevant, not what the agent actually used. For an observability feature, showing the agent's real behaviour matters more than anything else.

### The flow

```
 Caller ──speech──▶ Voice platform ──(embed → top-k ≥ threshold → LLM)──▶ grounded answer
                         │
                         │ call-finished notification (includes link to retrieval record)
                         ▼
                    Our backend ──stores call record + link──▶ Document DB
                         ▲
   Reviewer opens a call │
   in the dashboard ─────┘
                         │
          ┌──────────────┴──────────────┐
          │ Feature enabled for tenant? │── no ──▶ return {enabled:false}; UI unchanged
          └──────────────┬──────────────┘
                         │ yes
          ┌──────────────┴──────────────┐
          │ Cached trace, current       │── yes ─▶ return cached trace
          │ schema version?             │
          └──────────────┬──────────────┘
                         │ no (first view)
                         ▼
          Validate URL (allow-list) → one HTTPS GET (timeout, size cap, no redirects)
                         │
                         ▼
          Parse passages → join to transcript turns by response ID (hash map)
                         │
                         ▼
          Write compact trace onto the call record (failure is non-fatal) → return
```

In the dashboard, each agent reply gets an expander that walks through **what the caller said → the search settings → the top passages (rank, document, section, snippet) → the answer**. A summary line at the top of the call shows how many answers used the knowledge library and how many distinct documents they drew on.

### Decision 1: lazy fetch plus cache-aside

I could have built the trace eagerly, when the call-finished notification arrives. I chose to build it **lazily, on first view**:

- **Most calls are never opened.** Eager fetching spends work, and adds a dependency on an external service, for traces nobody reads.
- **The notification path should stay fast and boring.** It already does important work, and I didn't want a new external fetch in it.
- **Cache invalidation is almost free here.** A finished call's retrieval record never changes, so a cached trace can't go stale. The only time I invalidate is when I change the trace's *shape*. Each cached trace carries a schema version, and bumping that version makes old entries rebuild on their next view. No TTLs needed.
- **Races are harmless.** If two reviewers open the same call at once, both fetch and both write the same result. The write is idempotent, so last-write-wins is fine and no lock is needed.
- **Cache write failures are non-fatal.** The reviewer still sees the trace, and the next view tries the write again.

The trace lives on the call's own record, so loading a call takes a single read. The catch is that the record gets bigger, so I **strip the trace field from every list view and real-time update** and only include it on the single-call detail view. Call lists stay as light as they were before.

### Decision 2: treat every vendor URL as hostile (SSRF)

The backend fetches a URL that arrived in an external payload. That's the classic setup for **server-side request forgery (SSRF)**: if anyone can get a URL of their choosing into that field, your server might fetch a cloud metadata endpoint or an internal service on their behalf.

Even with authenticated inbound notifications, I wanted the fetch to be safe on its own. That's defence in depth. The guard:

- **HTTPS only**, on the standard port.
- **An exact host allow-list.** No wildcards, no "starts with" matching. Allow-lists beat deny-lists because you can't list every trick for reaching an internal host (decimal IPs, IPv6 forms, DNS tricks).
- **No embedded credentials** (`user:pass@host`).
- **No redirects.** A redirect from an allowed host could bounce the request somewhere internal.
- **A short timeout and a response size cap**, so a slow or huge response can't tie up the server.
- **Only accept a success status.** Anything else counts as "trace unavailable".
- **The raw URL never reaches the browser.** The client only ever sees the parsed trace.

On the display side, any source link shown to users must also be HTTPS with no credentials, which rules out `javascript:` links.

### Decision 3: be honest about what you don't know

The retrieval record has passages and rank order but **no similarity scores**. Showing a made-up "92% relevant" would have looked nicer, but it would be fiction. The UI shows the **rank** and says plainly that scores aren't stored for calls. The same goes for any count the platform doesn't expose: I'd rather hide a number than show an estimate as if it were a fact.

### Decision 4: ship it to one tenant behind a flag

The feature sits behind a **per-tenant feature flag** that **fails closed**. It only turns on when the flag is exactly the boolean `true`. A missing flag, the string `"true"`, or any odd value counts as off. When the flag is off, the endpoint returns a quiet "not enabled" and the dashboard looks exactly as it did before.

- **Release isn't deploy.** The code can ship dark and get turned on for one tenant after review.
- **The kill switch is a data change**, not a redeploy.
- I didn't need a full flag service (percentage rollouts, targeting rules) for one tenant and one flag. A boolean in the tenant's settings is enough until it isn't.

### Decision 5: bound everything, then check the bounds against the store

Parsing is defensive. There are caps on the number of turns, passages per turn, snippet length, and total bytes fetched. Malformed entries fall back to safe defaults instead of throwing errors.

One lesson I'd repeat: **once you've set your bounds, multiply them out and compare the result to your storage limits.** My first worst case (max turns × max passages × max snippet, title, and section lengths) came out slightly *above* the document database's per-document size limit (Firestore, for example, caps documents at 1 MiB). Real traces are a few kilobytes, so this would never happen in practice. And if it did, the cache write would just fail (non-fatal) and the trace would be rebuilt on each view. Still, the point is to know where your edge is, not to find it in production.

### Privacy

The trace stores **knowledge-library passages only**, which is clinic-facing content, never caller speech. The "what the caller said" step in the UI reuses transcript text the reviewer can already see, under the same access checks and privacy controls as the rest of the call view. Logs record identifiers and error messages, never content.

---

## Part 3: Alternatives I considered

| Option | When it wins | Why I didn't choose it |
|---|---|---|
| **Proxy the platform's own retrieval record** (chosen) | You want the truth about a black-box vendor, with no new infrastructure | |
| Re-run retrieval locally for a set of sample questions | You need visible similarity scores for a demo | Our ranking ≠ the agent's ranking, so it would have to be labelled a preview |
| Live "test a question" box (embed on demand) | Users want to probe the library interactively | A new production endpoint, plus a new model dependency, plus review overhead |
| Eager trace at call-finished time | Every call gets reviewed, and first-view latency matters | Wasted work on unopened calls, and the notification path gets slower |
| Own the whole RAG stack (own embeddings + vector index) | You need scores, custom chunking, evals, or vendor independence | Big scope. The platform already does retrieval well enough for now |
| Separate store for traces | Traces are large, or need different retention or access rules | Stripping the trace from list views solved the size concern |
| Hosted feature-flag service | Many flags, many tenants, gradual rollouts | Overkill for one flag on one tenant |

If I ever need scores or proper retrieval evaluation (recall@k, mean reciprocal rank, answer faithfulness), the next step is owning retrieval and logging the query, the scores, and the chosen chunks for every turn.

---

## What I'd tell someone building this

1. **Find the ground truth before you build anything.** The best observability data was already there. I only had to notice it.
2. **Show the system's real behaviour, not your reconstruction of it.** Re-running retrieval yourself creates a second, competing version of what happened.
3. **Any URL from outside is untrusted input.** Use an allow-list, block redirects, and set a timeout and size cap, even when you trust the sender.
4. **Immutable sources make caching easy.** Version your cache entries and you never need a TTL.
5. **Don't invent numbers.** "Rank 1 of 3" is less impressive than "92% match", but it's true.
6. **Bound your inputs, then multiply the bounds.** Your storage limits are part of your design.
7. **Fail closed and ship to one tenant first.** Being able to switch a feature off with a data change, not a redeploy, gives you confidence.

---

### Further reading

- [What is Retrieval-Augmented Generation? (IBM Technology, video)](https://www.youtube.com/watch?v=T-D1OfcDW1M)
- [Vector similarity explained: cosine vs dot product vs Euclidean (Pinecone)](https://www.pinecone.io/learn/vector-similarity/)
- [Chunking strategies for LLM applications (Pinecone)](https://www.pinecone.io/learn/chunking-strategies/)
- [Hierarchical Navigable Small Worlds (HNSW) (Pinecone)](https://www.pinecone.io/learn/series/faiss/hnsw/)
- [Cache-Aside pattern (Microsoft Azure Architecture Center)](https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside)
- [SSRF Prevention Cheat Sheet (OWASP)](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Feature Toggles (Pete Hodgson, martinfowler.com)](https://martinfowler.com/articles/feature-toggles.html)
