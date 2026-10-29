import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

const siteName = "Ridge & Reef";
const siteDescription =
  "Small-group tours and tailor-made journeys to mountains, beaches, cities and cultural gems around the world.";

export const metadata: Metadata = {
  title: { default: siteName, template: `%s · ${siteName}` },
  description: siteDescription,
  openGraph: { title: siteName, description: siteDescription, siteName, type: "website" },
  twitter: { card: "summary", title: siteName, description: siteDescription },
};

// Runs before paint so the saved or system theme is applied without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${outfit.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <WishlistProvider>
          <SiteChrome footer={<Footer />}>{children}</SiteChrome>
        </WishlistProvider>
      </body>
    </html>
  );
}
