"use client";

import { motion } from "framer-motion";
import { QuoteWizard } from "@/components/quote-wizard";

export function QuoteSection() {
  return (
    <section className="px-4 pb-20" id="orcamento">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-lg mx-auto"
      >
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 shadow-2xl shadow-black/50">
          <QuoteWizard />
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          {[
            { value: "500+", label: "projetos entregues" },
            { value: "4.9★", label: "avaliação média" },
            { value: "2h", label: "tempo de resposta" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-zinc-600 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
