import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy New Year 2026 - Letters",
  description: "Write thoughtful letters to your loved ones this New Year",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-midnight via-midnight-light to-midnight-dark text-snow">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
