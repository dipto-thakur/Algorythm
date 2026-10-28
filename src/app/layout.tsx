import type { Metadata, Viewport } from "next";
import { Martian_Mono, Space_Grotesk } from "next/font/google";   // Pixelify_Sans removed
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import "./globals.css";
import { Providers } from "@/components/Providers";

const mono = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-grotesk", display: "swap" });
const pixel = localFont({
  src: "../fonts/NeueBit-Regular.otf",
  weight: "400",
  style: "normal",
  variable: "--font-pixel", // same variable name, so nothing else changes
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
  openGraph: { title, description: siteConfig.description, siteName: siteConfig.name, type: "website" },
  twitter: { card: "summary_large_image", title, description: siteConfig.description },
};

export const viewport: Viewport = { themeColor: "#080808", width: "device-width", initialScale: 1 };

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
        {children}
        </Providers>
      </body>
    </html>
  );
}
