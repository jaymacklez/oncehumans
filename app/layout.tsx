import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppHeader from "@/components/AppHeader";
import GlobalChatsButton from "@/components/GlobalChatsButton";
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
  title: "Once Humans",
  description: "A living museum and social space for human-made things and human stories.",
  applicationName: "Once Humans",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/once-humans-icon.svg",
    apple: "/once-humans-icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Once Humans",
    statusBarStyle: "default",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppHeader />
        {children}
        <GlobalChatsButton />
      </body>
    </html>
  );
}
