"use client";

import { motion } from "framer-motion";
import { QuoteWizard } from "@/components/quote-wizard";
import { PriceTicker } from "@/components/ui/price-ticker";

const STATS = [
  { value: "500+", label: "projetos entregues" },
  { value: "4.9★", label: "avaliação Google" },
  { value: "< 2h", label: "tempo de resposta" },
];

export function QuoteSection() {
  return (
    <section className="relative px-4 pb-32 sm:pb-24" id="orcamento">
      <div className="glow-orb-bottom-left" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-lg mx-auto"
      >
        {/* Card principal */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Borda com glow animado */}
          <div className="absolute inset-0 rounded-3xl border border-white/[0.13] card-border-glow pointer-events-none z-10" />

          {/* Fundo com glassmorphism */}
          <div className="relative bg-white/[0.028] backdrop-blur-safe p-6 sm:p-8 rounded-3xl shadow-2xl shadow-black/60">
            {/* Gradiente interno de topo */}
            <div
              className="absolute inset-x-0 top-0 h-px rounded-t-3xl pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
            />

            <QuoteWizard />
          </div>
        </div>

        {/* Stats abaixo do card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-5 flex items-center justify-center divide-x divide-white/10"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center px-5 first:pl-0 last:pr-0">
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Barra de preço flutuante */}
      <PriceTicker />
    </section>
  );
}
