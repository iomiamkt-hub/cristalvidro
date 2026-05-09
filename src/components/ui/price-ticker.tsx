"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useQuoteStore } from "@/store/quote-store";
import { calculateQuote } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 80, damping: 18, mass: 0.8 });
  const display = useTransform(spring, (v) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
  );
  const [text, setText] = useState(formatCurrency(value));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsub = display.on("change", setText);
    return unsub;
  }, [display]);

  return <span>{text}</span>;
}

const STEP_LABELS: Record<string, string> = {
  product: "Selecione o produto",
  dimensions: "Defina as medidas",
  glass: "Escolha o vidro",
  extras: "Configure o acabamento",
  summary: "Revise seu orçamento",
  contact: "Finalize o pedido",
};

export function PriceTicker() {
  const { product, width, height, glassType, thickness, profile, installation, quantity, currentStep } =
    useQuoteStore();

  const hasProduct = !!product;
  const isContactDone = currentStep === "contact";

  const total = hasProduct
    ? calculateQuote({ product: product!, width, height, glassType, thickness, profile, installation, quantity }).total
    : 0;

  const isVisible = hasProduct && !isContactDone;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
          style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl border border-white/15 bg-zinc-950/90 backdrop-blur-xl shadow-2xl shadow-black/60">
              <div className="flex flex-col min-w-0">
                <span className="text-zinc-500 text-xs truncate">{STEP_LABELS[currentStep]}</span>
                <motion.div
                  key={Math.round(total)}
                  className="text-white font-bold text-lg leading-none mt-0.5 tabular-nums"
                >
                  <AnimatedNumber value={total} />
                </motion.div>
                {quantity > 1 && (
                  <span className="text-zinc-600 text-xs mt-0.5">
                    {quantity} peças · {formatCurrency(total / quantity)} cada
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <PulsingDot />
                <span className="text-zinc-400 text-xs font-medium">ao vivo</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PulsingDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
    </span>
  );
}
