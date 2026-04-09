import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Violet’s French Learning Path",
  description: "A Stardew-inspired French vocabulary trainer with spaced repetition."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
