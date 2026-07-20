import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Trading Dashboard",
  description: "World-class trading signal management and analytics platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#080B0F] text-[#F0F6FC]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
