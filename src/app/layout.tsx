import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cristal Vidro — Orçamento",
  description: "Orçamento online para box, sacada, guarda-corpo e espelhos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
