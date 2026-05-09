import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cristal Vidro — Orçamento Online",
  description: "Solicite seu orçamento de box, sacada, guarda-corpo e espelhos em minutos.",
  openGraph: {
    title: "Cristal Vidro — Orçamento Online",
    description: "Sistema de orçamento automático para produtos em vidro sob medida.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
