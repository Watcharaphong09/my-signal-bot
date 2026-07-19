import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Signal Dashboard",
    template: "%s | Signal Dashboard",
  },
  description: "Ultra-premium trading signal management dashboard for Discord bot administration",
  keywords: ["trading", "signals", "forex", "dashboard", "discord bot"],
  authors: [{ name: "Signal Bot" }],
  themeColor: "#080B0F",
  colorScheme: "dark",
  openGraph: {
    title: "Signal Dashboard",
    description: "Ultra-premium trading signal management dashboard",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
