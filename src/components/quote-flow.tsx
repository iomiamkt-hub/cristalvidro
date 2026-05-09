"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { useQuoteStore } from "@/store/quote-store";
import { StepProduct } from "@/components/steps/step-product";
import { StepDimensions } from "@/components/steps/step-dimensions";
import { StepGlass } from "@/components/steps/step-glass";
import { StepExtras } from "@/components/steps/step-extras";
import { StepSummary } from "@/components/steps/step-summary";
import { StepContact } from "@/components/steps/step-contact";
import { PriceTicker } from "@/components/ui/price-ticker";
import type { Step } from "@/store/quote-store";

const STEP_ORDER: Step[] = ["product", "dimensions", "glass", "extras", "summary", "contact"];

const STEPS = {
  product: StepProduct,
  dimensions: StepDimensions,
  glass: StepGlass,
  extras: StepExtras,
  summary: StepSummary,
  contact: StepContact,
};

export function QuoteFlow() {
  const { currentStep } = useQuoteStore();
  const prevStepRef = useRef(currentStep);
  const dir = STEP_ORDER.indexOf(currentStep) >= STEP_ORDER.indexOf(prevStepRef.current) ? 1 : -1;
  prevStepRef.current = currentStep;

  const StepComponent = STEPS[currentStep];
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const isContact = currentStep === "contact";

  return (
    <div className="min-h-dvh flex flex-col bg-[#0d0d0d]">

      {/* Header */}
      <header className="max-w-md mx-auto w-full px-7 pt-12 pb-0">
        <div className="flex items-center justify-between">

          {/* Marca CV */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-white/[0.18] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold tracking-widest text-white select-none">CV</span>
            </div>
            <span className="text-[13px] font-medium text-white/50 tracking-wide">
              Cristal Vidro
            </span>
          </div>

          {/* Contador de step */}
          {!isContact && (
            <span className="text-[11px] text-white/20 tabular-nums tracking-wider">
              {stepIndex + 1} — {STEP_ORDER.length}
            </span>
          )}
        </div>

        {/* Linha de progresso */}
        {!isContact && (
          <div className="mt-8 h-px bg-white/[0.07] overflow-hidden">
            <motion.div
              className="h-full bg-white/60"
              initial={false}
              animate={{ width: `${((stepIndex + 1) / STEP_ORDER.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        )}
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex flex-col px-7 pt-12 pb-36 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: dir > 0 ? 16 : -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir > 0 ? -12 : 12 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 flex flex-col"
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      <PriceTicker />
    </div>
  );
}
