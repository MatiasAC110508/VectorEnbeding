import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local API CRM Dashboard",
  description: "Local Next.js API with modular CRUD for users and clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-app text-slate-950">{children}</body>
    </html>
  );
}
