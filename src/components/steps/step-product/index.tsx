"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import type { ProductType, ProductSubtype } from "@/lib/pricing";
import { PRODUCT_SUBTYPES } from "@/lib/pricing";
import { PRODUCTS } from "./product-data";
import { cn } from "@/lib/utils";

const fadeY = {
  initial: (d: number) => ({ opacity: 0, y: d * 16 }),
  animate: { opacity: 1, y: 0 },
  exit: (d: number) => ({ opacity: 0, y: d * -12 }),
  transition: { duration: 0.2, ease: "easeOut" as const },
};

export function StepProduct() {
  const { product, subtype, setProduct, setSubtype, nextStep } = useQuoteStore();
  const [phase, setPhase] = useState<"product" | "subtype">(product ? "subtype" : "product");
  const [dir, setDir] = useState(1);

  const subtypes = product ? PRODUCT_SUBTYPES[product] : [];

  async function handleProductSelect(id: ProductType) {
    setProduct(id);
    const def = PRODUCT_SUBTYPES[id].find((o) => o.recommended) ?? PRODUCT_SUBTYPES[id][0];
    setSubtype(def.id as ProductSubtype);
    setDir(1);
    await new Promise((r) => setTimeout(r, 120));
    setPhase("subtype");
  }

  async function handleSubtypeSelect(id: string) {
    setSubtype(id as ProductSubtype);
    await new Promise((r) => setTimeout(r, 260));
    nextStep();
  }

  function handleBack() {
    setDir(-1);
    setPhase("product");
  }

  return (
    <div className="flex flex-col flex-1">
      <AnimatePresence mode="wait" custom={dir}>

        {phase === "product" && (
          <motion.div
            key="product"
            custom={dir}
            variants={fadeY}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={fadeY.transition}
            className="flex flex-col flex-1"
          >
            <h1 className="text-[2.6rem] font-medium text-white leading-[1.08] tracking-tight mb-14">
              O que você<br />precisa?
            </h1>

            <div>
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProductSelect(p.id)}
                  className={cn(
                    "w-full text-left py-6 border-b border-white/[0.05]",
                    "flex items-center justify-between group",
                    "transition-all duration-200"
                  )}
                >
                  <span className={cn(
                    "text-[1.5rem] font-medium tracking-tight transition-colors duration-200",
                    product === p.id ? "text-white" : "text-white/22 group-hover:text-white/55"
                  )}>
                    {p.title}
                  </span>
                  {product === p.id && (
                    <motion.div
                      layoutId="prod-dot"
                      className="w-[7px] h-[7px] rounded-full bg-white flex-shrink-0"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "subtype" && product && (
          <motion.div
            key="subtype"
            custom={dir}
            variants={fadeY}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={fadeY.transition}
            className="flex flex-col flex-1"
          >
            <h1 className="text-[2.6rem] font-medium text-white leading-[1.08] tracking-tight mb-14">
              {PRODUCTS.find((p) => p.id === product)?.title}
            </h1>

            <div className="flex-1">
              {subtypes.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSubtypeSelect(opt.id)}
                  className={cn(
                    "w-full text-left py-6 border-b border-white/[0.05]",
                    "flex items-center justify-between group",
                    "transition-all duration-200"
                  )}
                >
                  <span className={cn(
                    "text-[1.5rem] font-medium tracking-tight transition-colors duration-200",
                    subtype === opt.id ? "text-white" : "text-white/22 group-hover:text-white/55"
                  )}>
                    {opt.title}
                  </span>
                  {subtype === opt.id && (
                    <motion.div
                      layoutId="sub-dot"
                      className="w-[7px] h-[7px] rounded-full bg-white flex-shrink-0"
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleBack}
              className="mt-10 text-[12px] text-white/18 hover:text-white/40 transition-colors self-start"
            >
              ← Produtos
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
