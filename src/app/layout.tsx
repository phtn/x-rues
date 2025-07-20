import { ProviderCtxProvider } from "@/ctx";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Oxanium,
  Space_Grotesk,
  Special_Elite,
} from "next/font/google";
import { type ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// Oxanium, Space_Grotesk, Special_Elite

const ox = Oxanium({
  variable: "--font-ox",
  subsets: ["latin"],
});
const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});
const se = Special_Elite({
  variable: "--font-se",
  weight: ["400"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "rues",
  description: "end-to-end encryted chat",
  icons: ["./rues_v4.svg"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${se.variable} ${space.variable} ${ox.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <ProviderCtxProvider>{children}</ProviderCtxProvider>
      </body>
    </html>
  );
}
