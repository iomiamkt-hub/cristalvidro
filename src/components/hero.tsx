"use client";

import { motion } from "framer-motion";

const FEATURES = [
  { icon: "⚡", label: "Orçamento em 2 min" },
  { icon: "🔒", label: "Vidro temperado certificado" },
  { icon: "🛠️", label: "Instalação inclusa" },
  { icon: "✅", label: "Garantia de 1 ano" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-10 sm:pt-24 sm:pb-14">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-xs font-medium text-zinc-400 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Orçamentos online em tempo real
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight"
        >
          Vidro sob medida,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
            orçamento na hora
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-zinc-500 text-base sm:text-lg leading-relaxed max-w-md mx-auto"
        >
          Box, sacada, guarda-corpo ou espelho. Configure, veja o preço e solicite em menos de 2 minutos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {FEATURES.map((f) => (
            <span key={f.label} className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
