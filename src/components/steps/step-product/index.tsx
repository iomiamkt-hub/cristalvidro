"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import type { ProductType, ProductSubtype } from "@/lib/pricing";
import { PRODUCT_SUBTYPES } from "@/lib/pricing";
import { PRODUCTS } from "./product-data";
import { PRODUCT_ICONS } from "./product-icons";
import { StepHeading } from "@/components/ui/step-heading";
import { StepActions } from "@/components/ui/step-actions";
import { cn } from "@/lib/utils";

export function StepProduct() {
  const { product, subtype, setProduct, setSubtype, nextStep } = useQuoteStore();
  const [phase, setPhase] = useState<"product" | "subtype">(product ? "subtype" : "product");
  const [dir, setDir] = useState(1);

  const selectedDef = PRODUCTS.find((p) => p.id === product) ?? null;
  const subtypes = product ? PRODUCT_SUBTYPES[product] : [];

  function handleProductSelect(id: ProductType) {
    setProduct(id);
    const def = PRODUCT_SUBTYPES[id].find((o) => o.recommended) ?? PRODUCT_SUBTYPES[id][0];
    setSubtype(def.id as ProductSubtype);
    setDir(1);
    setTimeout(() => setPhase("subtype"), 110);
  }

  function handleBack() {
    setDir(-1);
    setPhase("product");
  }

  return (
    <div className="flex flex-col flex-1">
      <AnimatePresence mode="wait">

        {/* ── Fase 1: produto ── */}
        {phase === "product" && (
          <motion.div
            key="product"
            initial={{ opacity: 0, y: dir > 0 ? 14 : -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir > 0 ? -10 : 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col flex-1"
          >
            <StepHeading>O que você precisa?</StepHeading>

            <div className="grid grid-cols-2 gap-3">
              {PRODUCTS.map((p) => {
                const Icon = PRODUCT_ICONS[p.id];
                const sel = product === p.id;
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => handleProductSelect(p.id)}
                    whileTap={{ scale: 0.96 }}
                    className={cn(
                      "relative flex flex-col p-6 rounded-2xl border text-left",
                      "transition-all duration-250 min-h-[180px]",
                      "focus-visible:outline-none",
                      sel
                        ? "border-white/25 bg-white/[0.05]"
                        : "border-white/[0.09] bg-white/[0.02] hover:border-white/[0.16]"
                    )}
                  >
                    {/* Ícone dominante */}
                    <div className={cn(
                      "flex-1 flex items-center transition-colors duration-250",
                      sel ? "text-white" : "text-white/25 group-hover:text-white/40"
                    )}>
                      <Icon size={52} />
                    </div>

                    {/* Título como legenda */}
                    <p className={cn(
                      "text-[13px] font-medium tracking-tight mt-5 transition-colors duration-250 leading-tight",
                      sel ? "text-white" : "text-white/35"
                    )}>
                      {p.title}
                    </p>

                    {/* Check discreto */}
                    {sel && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 22 }}
                        className="absolute top-4 right-4 w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center"
                      >
                        <svg className="w-[9px] h-[9px] text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Fase 2: subtipo ── */}
        {phase === "subtype" && selectedDef && (
          <motion.div
            key="subtype"
            initial={{ opacity: 0, y: dir > 0 ? 14 : -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir > 0 ? -10 : 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col flex-1"
          >
            <StepHeading>
              {selectedDef.title}
            </StepHeading>

            <div>
              {subtypes.map((opt, i) => (
                <motion.button
                  key={opt.id}
                  onClick={() => setSubtype(opt.id as ProductSubtype)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileTap={{ scale: 0.995 }}
                  className={cn(
                    "w-full flex items-center justify-between py-[18px]",
                    "border-b border-white/[0.06] last:border-0",
                    "text-left focus-visible:outline-none group cursor-pointer"
                  )}
                >
                  <p className={cn(
                    "text-[15px] font-medium tracking-tight transition-colors duration-150",
                    subtype === opt.id ? "text-white" : "text-white/35 group-hover:text-white/65"
                  )}>
                    {opt.title}
                  </p>

                  <div className={cn(
                    "w-[18px] h-[18px] rounded-full border flex-shrink-0 ml-4",
                    "flex items-center justify-center transition-all duration-200",
                    subtype === opt.id
                      ? "border-white"
                      : "border-white/[0.18] group-hover:border-white/35"
                  )}>
                    <motion.div
                      initial={false}
                      animate={subtype === opt.id ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 26 }}
                      className="w-[8px] h-[8px] rounded-full bg-white"
                    />
                  </div>
                </motion.button>
              ))}
            </div>

            <StepActions onNext={nextStep} onBack={handleBack} disabled={!subtype} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
