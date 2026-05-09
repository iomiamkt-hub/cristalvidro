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
    setTimeout(() => setPhase("subtype"), 120);
  }

  function handleBack() {
    setDir(-1);
    setPhase("product");
  }

  return (
    <div className="flex flex-col flex-1">
      <AnimatePresence mode="wait" custom={dir}>
        {phase === "product" ? (
          <motion.div
            key="product"
            initial={{ opacity: 0, x: dir * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -16 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="flex flex-col flex-1"
          >
            <StepHeading>O que você precisa?</StepHeading>

            <div className="grid grid-cols-2 gap-2">
              {PRODUCTS.map((p) => {
                const Icon = PRODUCT_ICONS[p.id];
                const selected = product === p.id;
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => handleProductSelect(p.id)}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "relative flex flex-col items-start p-5 rounded-2xl border",
                      "transition-all duration-200 text-left min-h-[140px]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                      selected
                        ? "border-white/30 bg-white/[0.06]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                    )}
                  >
                    <div className={cn(
                      "mb-auto transition-colors duration-200",
                      selected ? "text-white" : "text-zinc-600"
                    )}>
                      <Icon size={40} />
                    </div>
                    <p className={cn(
                      "text-sm font-semibold mt-4 transition-colors duration-200 leading-snug",
                      selected ? "text-white" : "text-zinc-400"
                    )}>
                      {p.title}
                    </p>

                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        className="absolute top-3 right-3 w-4 h-4 rounded-full bg-white flex items-center justify-center"
                      >
                        <svg className="w-2.5 h-2.5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="subtype"
            initial={{ opacity: 0, x: dir * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -16 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="flex flex-col flex-1"
          >
            <StepHeading>
              Qual tipo de{" "}
              <span className="text-zinc-500">
                {selectedDef?.title.toLowerCase()}?
              </span>
            </StepHeading>

            <div>
              {subtypes.map((opt, i) => (
                <motion.button
                  key={opt.id}
                  onClick={() => setSubtype(opt.id as ProductSubtype)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    "w-full flex items-center justify-between py-4",
                    "border-b border-white/[0.06] last:border-0",
                    "text-left focus-visible:outline-none group"
                  )}
                >
                  <div>
                    <p className={cn(
                      "text-[15px] font-medium transition-colors duration-150",
                      subtype === opt.id ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                    )}>
                      {opt.title}
                    </p>
                    {opt.priceAdj > 0 && (
                      <p className="text-xs text-zinc-700 mt-0.5">+R$ {opt.priceAdj}</p>
                    )}
                  </div>
                  <div className={cn(
                    "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 ml-4 flex items-center justify-center transition-all duration-200",
                    subtype === opt.id ? "border-white" : "border-zinc-700 group-hover:border-zinc-500"
                  )}>
                    <motion.div
                      initial={false}
                      animate={subtype === opt.id ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  </div>
                </motion.button>
              ))}
            </div>

            <StepActions
              onNext={nextStep}
              onBack={handleBack}
              disabled={!subtype}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
