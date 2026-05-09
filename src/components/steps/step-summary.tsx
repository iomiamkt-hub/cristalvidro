"use client";

import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import { calculateQuote } from "@/lib/pricing";
import { formatCurrency, formatArea } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PRODUCT_LABELS: Record<string, string> = {
  box: "Box de Banheiro",
  sacada: "Sacada",
  "guarda-corpo": "Guarda-corpo",
  espelho: "Espelho",
};

const GLASS_LABELS: Record<string, string> = {
  temperado: "Temperado",
  laminado: "Laminado",
  jateado: "Jateado",
  espelhado: "Espelhado",
};

const PROFILE_LABELS: Record<string, string> = {
  "sem-perfil": "Sem perfil",
  aluminio: "Alumínio anodizado",
  inox: "Inox escovado",
  "preto-fosco": "Preto fosco",
};

const INSTALL_LABELS: Record<string, string> = {
  parafuso: "Parafuso aparente",
  embutido: "Parafuso embutido",
  frameless: "Frameless",
};

export function StepSummary() {
  const store = useQuoteStore();
  const { product, width, height, glassType, thickness, profile, installation, quantity, nextStep, prevStep } = store;

  if (!product) return null;

  const result = calculateQuote({
    product,
    width,
    height,
    glassType,
    thickness,
    profile,
    installation,
    quantity,
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-white tracking-tight">Seu orçamento</h2>
        <p className="text-zinc-500 text-sm mt-1">Estimativa gerada automaticamente</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/8 to-white/3 p-6"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/3 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total estimado</p>
          <p className="text-4xl font-bold text-white tracking-tight">
            {formatCurrency(result.total)}
          </p>
          {quantity > 1 && (
            <p className="text-zinc-500 text-sm mt-1">
              {formatCurrency(result.subtotal)} × {quantity} peças
            </p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="space-y-4"
      >
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="px-4 py-2.5 bg-white/5 border-b border-white/10">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Configuração</p>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { label: "Produto", value: PRODUCT_LABELS[product] },
              { label: "Dimensões", value: `${width} × ${height} cm — ${formatArea(result.area)}` },
              { label: "Quantidade", value: `${quantity} peça${quantity > 1 ? "s" : ""}` },
              { label: "Tipo de vidro", value: GLASS_LABELS[glassType] },
              { label: "Espessura", value: `${thickness} mm` },
              { label: "Perfil", value: PROFILE_LABELS[profile] },
              { label: "Instalação", value: INSTALL_LABELS[installation] },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center px-4 py-3">
                <span className="text-zinc-500 text-sm">{row.label}</span>
                <span className="text-zinc-200 text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="px-4 py-2.5 bg-white/5 border-b border-white/10">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Composição do preço (por peça)</p>
          </div>
          <div className="divide-y divide-white/5">
            {result.breakdown.map((item) => (
              <div key={item.label} className="flex justify-between items-center px-4 py-3">
                <span className="text-zinc-500 text-sm">{item.label}</span>
                <span className="text-zinc-200 text-sm">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-600 text-center leading-relaxed">
          * Valores estimados. O orçamento final pode variar após vistoria técnica.
        </p>
      </motion.div>

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={prevStep} className="flex-1">
          Editar
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Solicitar orçamento oficial →
        </Button>
      </div>
    </div>
  );
}
