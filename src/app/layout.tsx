import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displaySerif = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qnmateen.github.io"),
  title: "Qazi Noorul Mateen · Healthcare AI, grounded in science",
  description:
    "From the Harvard lab bench to production AI: published diagnostics research, genomics pipelines, healthcare AI agents, and a mental-health startup.",
  openGraph: {
    type: "website",
    url: "https://qnmateen.github.io",
    siteName: "Qazi Noorul Mateen",
    title: "Qazi Noorul Mateen · Healthcare AI, grounded in science",
    description:
      "From the Harvard lab bench to production AI: published in Science Advances, genomics pipelines, and healthcare AI agents.",
    images: [{ url: "/media/portrait-lab.jpg", alt: "Qazi Noorul Mateen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qazi Noorul Mateen · Healthcare AI, grounded in science",
    description:
      "From the Harvard lab bench to production AI: published in Science Advances, genomics pipelines, and healthcare AI agents.",
    images: ["/media/portrait-lab.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
