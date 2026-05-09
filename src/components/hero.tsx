"use client";

import { motion } from "framer-motion";

const TRUST_BADGES = [
  { icon: "⚡", label: "Orçamento em 2 min" },
  { icon: "🔒", label: "Vidro certificado ABNT" },
  { icon: "🛠️", label: "Instalação inclusa" },
  { icon: "✅", label: "Garantia de 1 ano" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-14 pb-8 sm:pt-20 sm:pb-12">
      {/* Orb de fundo */}
      <div className="glow-orb-top" />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Badge live */}
        <motion.div
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/12 bg-white/[0.04] text-xs font-medium text-zinc-400 mb-5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          Orçamentos online em tempo real
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.08)}
          className="text-[2.2rem] sm:text-5xl font-bold text-white tracking-tight leading-[1.1]"
        >
          Vidro sob medida,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-300 to-zinc-500">
            orçamento na hora
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.15)}
          className="mt-4 text-zinc-500 text-sm sm:text-base leading-relaxed max-w-sm mx-auto"
        >
          Box, sacada, guarda-corpo ou espelho — configure, veja o preço e solicite em menos de 2 minutos.
        </motion.p>

        {/* Trust badges */}
        <motion.div
          {...fadeUp(0.25)}
          className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2"
        >
          {TRUST_BADGES.map((b) => (
            <span key={b.label} className="flex items-center gap-1.5 text-xs text-zinc-600">
              <span className="text-sm">{b.icon}</span>
              {b.label}
            </span>
          ))}
        </motion.div>

        {/* Seta para scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-zinc-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
