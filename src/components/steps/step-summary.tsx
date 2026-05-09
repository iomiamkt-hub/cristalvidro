"use client";

import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import { calculateQuote, PRODUCT_SUBTYPES } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { StepActions } from "@/components/ui/step-actions";

const LABELS = {
  product:  { box: "Box", sacada: "Sacada", "guarda-corpo": "Guarda-corpo", espelho: "Espelho" },
  glass:    { temperado: "Temperado", laminado: "Laminado", jateado: "Jateado", espelhado: "Espelhado" },
  profile:  { "sem-perfil": "Sem perfil", aluminio: "Alumínio", inox: "Inox", "preto-fosco": "Preto fosco" },
  install:  { parafuso: "Parafuso", embutido: "Embutido", frameless: "Frameless" },
} as const;

export function StepSummary() {
  const { product, subtype, width, height, glassType, thickness, profile, installation, quantity, nextStep, prevStep } =
    useQuoteStore();

  if (!product) return null;

  const result = calculateQuote({ product, subtype: subtype ?? undefined, width, height, glassType, thickness, profile, installation, quantity });
  const subtypeLabel = subtype ? PRODUCT_SUBTYPES[product].find((o) => o.id === subtype)?.title : null;

  const lines = [
    `${LABELS.product[product]}${subtypeLabel ? ` · ${subtypeLabel}` : ""}`,
    `${width} × ${height} cm${quantity > 1 ? ` · ${quantity} peças` : ""}`,
    `${LABELS.glass[glassType]} ${thickness} mm`,
    `${LABELS.profile[profile]} · ${LABELS.install[installation]}`,
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* Preço */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8"
      >
        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Estimativa</p>
        <p className="text-5xl font-bold text-white tracking-tight tabular-nums leading-none">
          {formatCurrency(result.total)}
        </p>
        {quantity > 1 && (
          <p className="text-zinc-600 text-sm mt-2 tabular-nums">
            {formatCurrency(result.subtotal)} × {quantity} peças
          </p>
        )}
      </motion.div>

      {/* Configuração resumida */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.35 }}
        className="space-y-0 border-t border-white/[0.06]"
      >
        {lines.map((line, i) => (
          <div key={i} className="py-3.5 border-b border-white/[0.06]">
            <p className="text-sm text-zinc-500">{line}</p>
          </div>
        ))}
      </motion.div>

      <p className="text-[11px] text-zinc-700 mt-5">
        Valores estimados. Orçamento final após vistoria gratuita.
      </p>

      <StepActions onNext={nextStep} onBack={prevStep} nextLabel="Solicitar orçamento" />
    </div>
  );
}
