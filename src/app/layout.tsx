import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoaderWrapper } from "@/components/ui/LoaderWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "IYYNESWARAN P — Full Stack Developer & AI/ML Builder",
  description:
    "Full stack developer building scalable systems across AI/ML, backend, and real-time applications. Led multiple high-pressure hackathon projects, delivering production-ready solutions and winning national-level competitions.",
  keywords: [
    "Full Stack Developer",
    "AI/ML",
    "React",
    "Node.js",
    "Python",
    "FastAPI",
    "WebSockets",
    "Portfolio",
    "IYYNESWARAN",
  ],
  authors: [{ name: "IYYNESWARAN P" }],
  creator: "IYYNESWARAN P",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://iyyneswaranp.vercel.app",
    title: "IYYNESWARAN P — Full Stack Developer & AI/ML Builder",
    description:
      "Full stack developer building scalable systems across AI/ML, backend, and real-time applications.",
    siteName: "IYYNESWARAN P Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "IYYNESWARAN P — Full Stack Developer & AI/ML Builder",
    description:
      "Full stack developer building scalable systems across AI/ML, backend, and real-time applications.",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${inter.variable} ${playfair.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <LoaderWrapper>
          <CustomCursor />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </LoaderWrapper>
      </body>
    </html>
  );
}
