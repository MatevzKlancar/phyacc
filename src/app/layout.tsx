import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "./providers/SupabaseProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phy/Acc - Physical Acceleration",
  description:
    "Explore the intersection of physical systems and AI with Phy/Acc.",
  icons: {
    icon: [
      { url: "/faviconPhyAcc.png", type: "image/png", sizes: "any" },
      { url: "/faviconPhyAcc.png", type: "image/png", sizes: "32x32" },
      { url: "/faviconPhyAcc.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: [{ url: "/faviconPhyAcc.png", type: "image/png" }],
    apple: [{ url: "/faviconPhyAcc.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
