import type { Metadata } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SupportChat from "@/components/shared/SupportChat";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexora | Academic Projects & Learning Resources for Students",
  description: "Find free projects, download source codes, request custom engineering/arts projects, and prepare with roadmaps, DSA notes, and interview prep guides.",
  keywords: ["academic projects", "engineering projects", "final year projects", "free code download", "python projects", "web dev projects", "IoT robotics", "school projects"],
  openGraph: {
    title: "Nexora | Academic Projects & Resources",
    description: "Get free project source codes, reports, synopses, and direct academic chat support.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora | Academic Projects & Resources",
    description: "Find free code downloads and academic guides.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${firaCode.variable} h-full antialiased dark`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <SupportChat />
        </Providers>
      </body>
    </html>
  );
}
