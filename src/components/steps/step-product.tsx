"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import type { ProductType, ProductSubtype } from "@/lib/pricing";
import { PRODUCT_SUBTYPES } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRODUCTS: {
  id: ProductType;
  title: string;
  subtitle: string;
  icon: string;
  tag: string;
}[] = [
  { id: "box", title: "Box de Banheiro", subtitle: "Do simples ao frameless premium", icon: "🚿", tag: "Mais popular" },
  { id: "sacada", title: "Sacada", subtitle: "Visão desobstruída com segurança total", icon: "🏙️", tag: "Alta valorização" },
  { id: "guarda-corpo", title: "Guarda-corpo", subtitle: "Elegância estrutural para escadas e mezaninos", icon: "🏗️", tag: "Design moderno" },
  { id: "espelho", title: "Espelho", subtitle: "Sob medida, com ou sem moldura", icon: "🪞", tag: "Personalizado" },
];

const slideIn = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2, ease: "easeIn" as const } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const cardItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function StepProduct() {
  const { product, subtype, setProduct, setSubtype, nextStep } = useQuoteStore();
  const [phase, setPhase] = useState<"product" | "subtype">(product ? "subtype" : "product");
  const [selected, setSelected] = useState<ProductType | null>(product);

  function handleProductSelect(p: ProductType) {
    setSelected(p);
    setProduct(p);
    // auto-seleciona o primeiro subtipo como padrão
    const defaultSub = PRODUCT_SUBTYPES[p].find((o) => o.recommended) ?? PRODUCT_SUBTYPES[p][0];
    setSubtype(defaultSub.id as ProductSubtype);
    setTimeout(() => setPhase("subtype"), 160);
  }

  function handleSubtypeSelect(s: ProductSubtype) {
    setSubtype(s);
  }

  function handleBack() {
    setPhase("product");
    setSelected(null);
  }

  const subtypes = selected ? PRODUCT_SUBTYPES[selected] : [];
  const currentProduct = PRODUCTS.find((p) => p.id === selected);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {phase === "product" ? (
          <motion.div key="product-phase" {...slideIn} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">O que você precisa?</h2>
              <p className="text-zinc-500 text-sm mt-1">Selecione o produto para começar</p>
            </div>

            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 gap-3">
              {PRODUCTS.map((p) => (
                <motion.button
                  key={p.id}
                  variants={cardItem}
                  onClick={() => handleProductSelect(p.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                    selected === p.id
                      ? "border-white bg-white/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/5"
                  )}
                >
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-semibold text-zinc-500 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-full">
                    {p.tag}
                  </span>
                  <div className="text-2xl sm:text-3xl mb-3">{p.icon}</div>
                  <h3 className="font-semibold text-white text-xs sm:text-sm leading-snug">{p.title}</h3>
                  <p className="text-zinc-500 text-[11px] sm:text-xs mt-0.5 leading-relaxed">{p.subtitle}</p>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="subtype-phase" {...slideIn} className="space-y-5">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-1.5 rounded-lg border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all text-zinc-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {currentProduct?.icon} {currentProduct?.title}
                </h2>
                <p className="text-zinc-500 text-sm mt-0.5">Qual o modelo?</p>
              </div>
            </div>

            <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-2">
              {subtypes.map((opt) => (
                <motion.button
                  key={opt.id}
                  variants={cardItem}
                  onClick={() => handleSubtypeSelect(opt.id as ProductSubtype)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className={cn(
                    "relative w-full text-left p-4 rounded-2xl border transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                    subtype === opt.id
                      ? "border-white bg-white/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/5"
                  )}
                >
                  {opt.recommended && (
                    <span className="absolute -top-2.5 left-4 text-[10px] font-semibold bg-white text-zinc-900 px-2 py-0.5 rounded-full">
                      Recomendado
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-semibold text-sm", subtype === opt.id ? "text-white" : "text-zinc-300")}>
                        {opt.title}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{opt.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {opt.priceAdj > 0 && (
                        <span className="text-zinc-500 text-xs">+R$ {opt.priceAdj}</span>
                      )}
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 transition-all flex-shrink-0",
                          subtype === opt.id ? "border-white bg-white" : "border-zinc-600"
                        )}
                      />
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            <Button onClick={nextStep} disabled={!subtype} className="w-full">
              Continuar →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
