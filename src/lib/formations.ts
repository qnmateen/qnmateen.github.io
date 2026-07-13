/**
 * Target positions + colors for each morph phase. Every formation returns
 * exactly N particles so the system can lerp particle-by-particle between them.
 * Palette narrative: warm/organic (cells) → cool/digital (code).
 */

type Formation = { positions: Float32Array; colors: Float32Array };

function hex(c: string): [number, number, number] {
  const n = parseInt(c.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// pick from a palette with slight per-particle variation
function paint(colors: Float32Array, i: number, palette: string[][], t = Math.random()) {
  const [r, g, b] = palette[Math.floor(t * palette.length) % palette.length].map(Number) as number[];
  const j = i * 3;
  const v = 0.85 + Math.random() * 0.3; // brightness jitter
  colors[j] = r * v;
  colors[j + 1] = g * v;
  colors[j + 2] = b * v;
}

// ---- CELLS: organic blobs, warm stained-tissue palette --------------------
function cells(N: number): Formation {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const pal = ['#f472b6', '#fb7185', '#f87171', '#4ade80', '#a3e635'].map(hex) as unknown as string[][];
  const centers = Array.from({ length: 8 }, () => [rand(-5, 5), rand(-3.2, 3.2), rand(-3, 3)]);
  for (let i = 0; i < N; i++) {
    const c = centers[i % centers.length];
    // random point in a sphere (organic clump)
    const u = Math.random(), v = Math.random();
    const theta = u * Math.PI * 2, phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(Math.random()) * rand(0.7, 1.15);
    positions[i * 3] = c[0] + r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = c[1] + r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = c[2] + r * Math.cos(phi);
    paint(colors, i, pal);
  }
  return { positions, colors };
}

// ---- HELIX: double helix, teal/cyan ---------------------------------------
function helix(N: number): Formation {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const pal = ['#5eead4', '#2dd4bf', '#7dd3fc'].map(hex) as unknown as string[][];
  const turns = 5, radius = 1.6, height = 8.5;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const angle = t * turns * Math.PI * 2;
    const strand = i % 2 === 0 ? 0 : Math.PI;
    positions[i * 3] = Math.cos(angle + strand) * radius + rand(-0.05, 0.05);
    positions[i * 3 + 1] = (t - 0.5) * height;
    positions[i * 3 + 2] = Math.sin(angle + strand) * radius + rand(-0.05, 0.05);
    paint(colors, i, pal);
  }
  return { positions, colors };
}

// ---- NETWORK: layered neural net, indigo/violet ---------------------------
function network(N: number): Formation {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const pal = ['#a78bfa', '#818cf8', '#c084fc'].map(hex) as unknown as string[][];
  const layers = [4, 6, 7, 6, 3];
  const nodes: [number, number, number][] = [];
  layers.forEach((count, li) => {
    const x = (li - (layers.length - 1) / 2) * 2.6;
    for (let n = 0; n < count; n++) {
      const y = (n - (count - 1) / 2) * 1.3;
      nodes.push([x, y, rand(-0.4, 0.4)]);
    }
  });
  for (let i = 0; i < N; i++) {
    const node = nodes[i % nodes.length];
    positions[i * 3] = node[0] + rand(-0.22, 0.22);
    positions[i * 3 + 1] = node[1] + rand(-0.22, 0.22);
    positions[i * 3 + 2] = node[2] + rand(-0.22, 0.22);
    paint(colors, i, pal);
  }
  return { positions, colors };
}

// ---- CLOUD: t-SNE-like embedding clusters, cyan ---------------------------
function cloud(N: number): Formation {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const pal = ['#22d3ee', '#38bdf8', '#67e8f9'].map(hex) as unknown as string[][];
  const clusters = Array.from({ length: 6 }, () => [rand(-4.5, 4.5), rand(-3, 3), rand(-2.5, 2.5)]);
  for (let i = 0; i < N; i++) {
    const c = clusters[i % clusters.length];
    // gaussian-ish spread
    const g = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.9;
    positions[i * 3] = c[0] + g();
    positions[i * 3 + 1] = c[1] + g();
    positions[i * 3 + 2] = c[2] + g();
    paint(colors, i, pal);
  }
  return { positions, colors };
}

// ---- CODE: structured lattice / matrix screen, green-cyan -----------------
function code(N: number): Formation {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const pal = ['#4ade80', '#34d399', '#22d3ee'].map(hex) as unknown as string[][];
  const cols = 48;
  const rows = Math.ceil(N / cols);
  const w = 11, h = 7;
  for (let i = 0; i < N; i++) {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    positions[i * 3] = (cx / (cols - 1) - 0.5) * w + rand(-0.03, 0.03);
    positions[i * 3 + 1] = -(cy / (rows - 1) - 0.5) * h + rand(-0.03, 0.03);
    positions[i * 3 + 2] = rand(-0.2, 0.2);
    // brighter "cursor" cells scattered for a code feel
    paint(colors, i, pal, Math.random() > 0.9 ? 0.99 : Math.random());
  }
  return { positions, colors };
}

// ---- DEVICE: microfluidic lab-on-chip silhouette, teal ---------------------
function device(N: number): Formation {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const pal = ['#5eead4', '#2dd4bf', '#7dd3fc'].map(hex) as unknown as string[][];

  const W = 7, H = 4.6, r = 0.9;
  const hw = W / 2, hh = H / 2;
  const eh = W - 2 * r; // horizontal edge length
  const ev = H - 2 * r; // vertical edge length
  const arc = (Math.PI / 2) * r;
  const segLens = [eh, arc, ev, arc, eh, arc, ev, arc];
  const total = segLens.reduce((a, b) => a + b, 0);
  const cum: number[] = [];
  let acc = 0;
  for (const l of segLens) { acc += l; cum.push(acc); }

  // a point at fraction u around the rounded-rectangle perimeter
  function outline(u: number): [number, number] {
    const d = u * total;
    let s = 0;
    while (s < 7 && d > cum[s]) s++;
    const segStart = s === 0 ? 0 : cum[s - 1];
    const lt = (d - segStart) / segLens[s];
    switch (s) {
      case 0: return [-hw + r + lt * eh, hh];
      case 1: { const a = Math.PI / 2 - lt * (Math.PI / 2); return [hw - r + Math.cos(a) * r, hh - r + Math.sin(a) * r]; }
      case 2: return [hw, hh - r - lt * ev];
      case 3: { const a = -lt * (Math.PI / 2); return [hw - r + Math.cos(a) * r, -(hh - r) + Math.sin(a) * r]; }
      case 4: return [hw - r - lt * eh, -hh];
      case 5: { const a = -Math.PI / 2 - lt * (Math.PI / 2); return [-(hw - r) + Math.cos(a) * r, -(hh - r) + Math.sin(a) * r]; }
      case 6: return [-hw, -(hh - r) + lt * ev];
      default: { const a = Math.PI - lt * (Math.PI / 2); return [-(hw - r) + Math.cos(a) * r, hh - r + Math.sin(a) * r]; }
    }
  }

  // serpentine assay channel across the chip
  function serpentine(u: number): [number, number] {
    const x = -hw + 0.6 + u * (W - 1.2);
    const y = Math.sin(u * Math.PI * 5) * (hh - 1.15);
    return [x, y];
  }

  const wells: [number, number][] = [[-1.9, hh - 0.95], [0, hh - 0.95], [1.9, hh - 0.95]];

  for (let i = 0; i < N; i++) {
    const j = i * 3;
    let x: number, y: number;
    const rr = Math.random();
    if (rr < 0.42) {
      const p = outline(Math.random());
      x = p[0] + rand(-0.05, 0.05); y = p[1] + rand(-0.05, 0.05);
    } else if (rr < 0.78) {
      const p = serpentine(Math.random());
      x = p[0] + rand(-0.06, 0.06); y = p[1] + rand(-0.06, 0.06);
    } else if (rr < 0.92) {
      const w = wells[(Math.random() * wells.length) | 0];
      const a = Math.random() * Math.PI * 2;
      const rad = Math.sqrt(Math.random()) * 0.32;
      x = w[0] + Math.cos(a) * rad; y = w[1] + Math.sin(a) * rad;
    } else {
      x = rand(-hw + 0.4, hw - 0.4); y = rand(-hh + 0.4, hh - 0.4);
    }
    positions[j] = x;
    positions[j + 1] = y;
    positions[j + 2] = rand(-0.15, 0.15);
    paint(colors, i, pal);
  }
  return { positions, colors };
}

// ---- CONSTELLATION: an ascending trail of stars, amber (the path) ----------
function constellation(N: number): Formation {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const pal = ['#fbbf24', '#fcd34d', '#f59e0b'].map(hex) as unknown as string[][];
  for (let i = 0; i < N; i++) {
    const j = i * 3;
    if (i % 6 === 0) {
      // sparse wide background stars
      positions[j] = rand(-6.5, 6.5);
      positions[j + 1] = rand(-3.6, 3.6);
      positions[j + 2] = rand(-3, 3);
    } else {
      // rising trail, left to right, with a gentle wave
      const t = Math.random();
      const x = -5.5 + t * 11;
      const yBase = -2.6 + t * 5.2;
      positions[j] = x + rand(-0.25, 0.25);
      positions[j + 1] = yBase + Math.sin(t * Math.PI * 3) * 0.6 + rand(-0.3, 0.3);
      positions[j + 2] = rand(-1, 1);
    }
    paint(colors, i, pal);
  }
  return { positions, colors };
}

// ---- GLOBE: a rotating sphere shell, soft white (horizon / finale) ----------
function globe(N: number): Formation {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const pal = ['#e2e8f0', '#cbd5e1', '#a5b4fc'].map(hex) as unknown as string[][];
  const r = 3.1;
  for (let i = 0; i < N; i++) {
    const j = i * 3;
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const jitter = 1 + rand(-0.02, 0.02);
    positions[j] = r * Math.sin(phi) * Math.cos(theta) * jitter;
    positions[j + 1] = r * Math.cos(phi) * jitter;
    positions[j + 2] = r * Math.sin(phi) * Math.sin(theta) * jitter;
    paint(colors, i, pal);
  }
  return { positions, colors };
}

export function buildFormations(N: number): Record<string, Formation> {
  return {
    cells: cells(N),
    device: device(N),
    helix: helix(N), // kept for the sequencing section (Section 2 pass)
    network: network(N),
    cloud: cloud(N),
    code: code(N),
    constellation: constellation(N),
    globe: globe(N),
  };
}
