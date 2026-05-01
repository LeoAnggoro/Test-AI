import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { GenkiProvider } from "@/context/GenkiContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym Buddy - AI Personal Training",
  description: "High-end AI-powered personal training ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} antialiased dark h-full`}
      suppressHydrationWarning
    >
      <body className="h-full bg-charcoal text-foreground overflow-x-hidden selection:bg-volt selection:text-charcoal flex flex-col">
        <GenkiProvider>{children}</GenkiProvider>
      </body>
    </html>
  );
}
