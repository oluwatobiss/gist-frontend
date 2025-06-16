import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gist",
  description: "The subject-based social app",
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
        <nav className="text-center">
          <a
            href="/"
            className="inline-block px-4 py-5 text-xl font-bold uppercase text-white hover:text-black hover:bg-orange-300 focus:bg-orange-300"
          >
            Gist
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
