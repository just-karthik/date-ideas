import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Date Ideas Chennai | Discover Unique Experiences",
  description: "A curated map for couples to discover unique date ideas in Chennai beyond cafes and candle-light dinners.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased overflow-hidden h-screen w-screen bg-background text-foreground font-sans`}>
        {children}
      </body>
    </html>
  );
}
