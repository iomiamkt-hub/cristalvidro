"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuoteStore } from "@/store/quote-store";
import { calculateQuote } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";

function AnimatedPrice({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 70, damping: 16 });
  const display = useTransform(spring, (v) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
  );
  const [text, setText] = useState(formatCurrency(value));

  useEffect(() => { spring.set(value); }, [value, spring]);
  useEffect(() => display.on("change", setText), [display]);

  return <span className="tabular-nums">{text}</span>;
}

export function PriceTicker() {
  const { product, width, height, glassType, thickness, profile, installation, quantity, subtype, currentStep } =
    useQuoteStore();

  const visible = !!product && currentStep !== "contact";

  const total = product
    ? calculateQuote({ product, subtype: subtype ?? undefined, width, height, glassType, thickness, profile, installation, quantity }).total
    : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 64, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
          style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
        >
          <div className="max-w-md mx-auto px-6">
            <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-zinc-900 border border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-zinc-500 text-xs">estimativa</span>
              </div>
              <p className="text-white font-semibold text-base">
                <AnimatedPrice value={total} />
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
