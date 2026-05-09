"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import type { ProductType, ProductSubtype } from "@/lib/pricing";
import { PRODUCT_SUBTYPES } from "@/lib/pricing";
import { ProductCard } from "./product-card";
import { SubtypeCard } from "./subtype-card";
import { PRODUCTS } from "./product-data";
import { cn } from "@/lib/utils";

const PHASE_VARIANTS = {
  initial: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -20, transition: { duration: 0.2, ease: "easeIn" as const } }),
};

export function StepProduct() {
  const { product, subtype, setProduct, setSubtype, nextStep } = useQuoteStore();

  const [phase, setPhase] = useState<"product" | "subtype">(product ? "subtype" : "product");
  const [dir, setDir] = useState(1);

  const selectedProductDef = PRODUCTS.find((p) => p.id === product) ?? null;
  const subtypes = product ? PRODUCT_SUBTYPES[product] : [];

  function handleProductSelect(id: ProductType) {
    setProduct(id);
    const defaultSub = PRODUCT_SUBTYPES[id].find((o) => o.recommended) ?? PRODUCT_SUBTYPES[id][0];
    setSubtype(defaultSub.id as ProductSubtype);
    setDir(1);
    setTimeout(() => setPhase("subtype"), 140);
  }

  function handleBack() {
    setDir(-1);
    setPhase("product");
  }

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait" custom={dir}>
        {/* ── FASE 1: seleção do produto ── */}
        {phase === "product" && (
          <motion.div
            key="product"
            custom={dir}
            variants={PHASE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-5"
          >
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                O que você precisa?
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                Selecione o produto para iniciar seu orçamento
              </p>
            </div>

            {/* Grid de produtos */}
            <div className="grid grid-cols-2 gap-2.5">
              {PRODUCTS.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  selected={product === p.id}
                  onClick={() => handleProductSelect(p.id)}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── FASE 2: seleção do subtipo ── */}
        {phase === "subtype" && selectedProductDef && (
          <motion.div
            key="subtype"
            custom={dir}
            variants={PHASE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4"
          >
            {/* Header com botão voltar */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleBack}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03]",
                  "flex items-center justify-center text-zinc-400",
                  "hover:border-white/25 hover:bg-white/[0.07] hover:text-white",
                  "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                )}
                aria-label="Voltar para produtos"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight truncate">
                    {selectedProductDef.title}
                  </h2>
                  {/* breadcrumb separador */}
                  <svg className="w-3 h-3 text-zinc-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-sm text-zinc-500 truncate">modelo</span>
                </div>
                <p className="text-zinc-600 text-xs mt-0.5">Qual o tipo de {selectedProductDef.title.toLowerCase()}?</p>
              </div>
            </div>

            {/* Lista de subtipos */}
            <div className="space-y-2">
              {subtypes.map((opt, i) => (
                <SubtypeCard
                  key={opt.id}
                  option={opt}
                  selected={subtype === opt.id}
                  onClick={() => setSubtype(opt.id as ProductSubtype)}
                  index={i}
                />
              ))}
            </div>

            {/* Botão continuar */}
            <ContinueButton disabled={!subtype} onClick={nextStep} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContinueButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.35 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(
        "group relative w-full flex items-center justify-center gap-2",
        "py-3.5 px-5 rounded-2xl font-semibold text-sm",
        "transition-all duration-200 overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        disabled
          ? "bg-white/5 text-zinc-600 border border-white/8 cursor-not-allowed"
          : "bg-white text-zinc-900 shadow-lg shadow-white/10 cursor-pointer"
      )}
    >
      {/* Shimmer no hover */}
      {!disabled && (
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)" }}
        />
      )}

      <span>Continuar</span>

      {/* Seta animada */}
      <motion.svg
        className="w-4 h-4 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        animate={disabled ? {} : undefined}
        whileHover={disabled ? {} : { x: 2 }}
        transition={{ duration: 0.15 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </motion.svg>
    </motion.button>
  );
}
