"use client";

import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import { calculateQuote, PRODUCT_SUBTYPES } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { StepActions } from "@/components/ui/step-actions";

const L = {
  product:  { box: "Box de Banheiro", sacada: "Sacada", "guarda-corpo": "Guarda-corpo", espelho: "Espelho" },
  glass:    { temperado: "Temperado", laminado: "Laminado", jateado: "Jateado", espelhado: "Espelhado" },
  profile:  { "sem-perfil": "Sem perfil", aluminio: "Alumínio", inox: "Inox", "preto-fosco": "Preto fosco" },
  install:  { parafuso: "Parafuso", embutido: "Embutido", frameless: "Frameless" },
} as const;

export function StepSummary() {
  const s = useQuoteStore();
  const { product, subtype, width, height, glassType, thickness, profile, installation, quantity, nextStep, prevStep } = s;

  if (!product) return null;

  const result = calculateQuote({ product, subtype: subtype ?? undefined, width, height, glassType, thickness, profile, installation, quantity });
  const subtypeLabel = subtype ? PRODUCT_SUBTYPES[product].find((o) => o.id === subtype)?.title : null;

  const specs = [
    { label: "Produto",    value: `${L.product[product]}${subtypeLabel ? ` · ${subtypeLabel}` : ""}` },
    { label: "Medidas",    value: `${width} × ${height} cm${quantity > 1 ? ` · ${quantity} peças` : ""}` },
    { label: "Vidro",      value: `${L.glass[glassType]} · ${thickness} mm` },
    { label: "Acabamento", value: `${L.profile[profile]} · ${L.install[installation]}` },
  ];

  return (
    <div className="flex flex-col flex-1">

      {/* Bloco do preço */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="mb-12"
      >
        <p className="text-[10px] text-white/20 uppercase tracking-[0.16em] mb-5">
          Estimativa
        </p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="text-[3.6rem] font-medium text-white tracking-tight leading-none tabular-nums"
        >
          {formatCurrency(result.total)}
        </motion.p>
        {quantity > 1 && (
          <p className="text-[13px] text-white/25 mt-3 tabular-nums">
            {formatCurrency(result.subtotal)} × {quantity} peças
          </p>
        )}
      </motion.div>

      {/* Especificações */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.14 }}
        className="border-t border-white/[0.07]"
      >
        {specs.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between py-4 border-b border-white/[0.06]"
          >
            <span className="text-[11px] text-white/20 uppercase tracking-[0.1em] flex-shrink-0 mr-4">
              {row.label}
            </span>
            <span className="text-[13px] text-white/55 text-right">
              {row.value}
            </span>
          </div>
        ))}
      </motion.div>

      <p className="text-[11px] text-white/15 mt-5 leading-relaxed">
        Valores estimados — orçamento final após vistoria gratuita.
      </p>

      <StepActions onNext={nextStep} onBack={prevStep} nextLabel="Solicitar orçamento" />
    </div>
  );
}
