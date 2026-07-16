import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentic Systems Lab | Engineering Portfolio",
  description: "Production-minded agent orchestration, retrieval, evaluation, safety, and observability patterns.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
