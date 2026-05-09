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
  const total = STEP_ORDER.length;
  const isContact = currentStep === "contact";

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-10 pb-2 max-w-md mx-auto w-full">
        <span className="text-sm font-semibold tracking-tight text-white">Cristal Vidro</span>
        {!isContact && (
          <span className="text-xs text-zinc-600 tabular-nums">
            {stepIndex + 1} / {total}
          </span>
        )}
      </header>

      {/* Progress line */}
      {!isContact && (
        <div className="px-6 max-w-md mx-auto w-full">
          <div className="h-px bg-white/8 rounded-full overflow-hidden mt-3">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={false}
              animate={{ width: `${((stepIndex + 1) / total) * 100}%` }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>
      )}

      {/* Step content */}
      <main className="flex-1 flex flex-col px-6 pt-10 pb-32 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: dir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -20 }}
            transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] as const }}
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
