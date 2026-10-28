import type { Metadata, Viewport } from "next";
import { Martian_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";

const mono = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-grotesk", display: "swap" });
const pixel = localFont({
  src: "../fonts/NeueBit-Regular.otf",
  weight: "400",
  style: "normal",
  variable: "--font-pixel",
  display: "swap",
});

const title = `${siteConfig.name} | ${siteConfig.brand}`;

export const metadata: Metadata = {
  title,
  description: siteConfig.description,
  ...(siteConfig.siteUrl && {
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: { canonical: "/" },
  }),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
    ...(siteConfig.siteUrl && { url: siteConfig.siteUrl }),
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.brand}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${pixel.variable} ${grotesk.variable}`}>
      <body>
        <Providers>
          <a
            href="#main"
            className="sr-only z-50 bg-white px-4 py-2 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}