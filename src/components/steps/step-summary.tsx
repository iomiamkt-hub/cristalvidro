"use client";

import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import { calculateQuote, PRODUCT_SUBTYPES } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { StepActions } from "@/components/ui/step-actions";

const GLASS_L: Record<string, string> = {
  temperado: "Temperado", laminado: "Laminado", jateado: "Jateado", espelhado: "Espelhado",
};
const PROFILE_L: Record<string, string> = {
  "sem-perfil": "Sem perfil", aluminio: "Alumínio", inox: "Inox", "preto-fosco": "Preto fosco",
};

export function StepSummary() {
  const s = useQuoteStore();
  const { product, subtype, width, height, glassType, thickness, profile, installation, quantity, nextStep } = s;

  if (!product) return null;

  const result = calculateQuote({ product, subtype: subtype ?? undefined, width, height, glassType, thickness, profile, installation, quantity });
  const subtypeLabel = subtype ? PRODUCT_SUBTYPES[product].find((o) => o.id === subtype)?.title : null;

  const lines = [
    subtypeLabel ?? { box: "Box de Banheiro", sacada: "Sacada", "guarda-corpo": "Guarda-corpo", espelho: "Espelho" }[product],
    `${width} × ${height} cm${quantity > 1 ? ` · ${quantity} peças` : ""}`,
    `${GLASS_L[glassType]} ${thickness} mm · ${PROFILE_L[profile]}`,
  ];

  return (
    <div className="flex flex-col flex-1">

      {/* Price */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <p className="text-[10px] text-white/18 uppercase tracking-[0.18em] mb-6">
          Estimativa
        </p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-[4rem] font-medium text-white tracking-tight leading-none tabular-nums"
        >
          {formatCurrency(result.total)}
        </motion.p>
        {quantity > 1 && (
          <p className="text-[12px] text-white/22 mt-3 tabular-nums">
            {formatCurrency(result.subtotal)} por peça
          </p>
        )}
      </motion.div>

      {/* Spec lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="border-t border-white/[0.06] mb-auto"
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className="text-[13px] text-white/35 py-4 border-b border-white/[0.04] leading-snug"
          >
            {line}
          </p>
        ))}
      </motion.div>

      <StepActions onNext={nextStep} nextLabel="Solicitar orçamento" />
    </div>
  );
}
