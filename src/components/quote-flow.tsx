"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { useQuoteStore } from "@/store/quote-store";
import { StepProduct } from "@/components/steps/step-product";
import { StepDimensions } from "@/components/steps/step-dimensions";
import { StepGlass } from "@/components/steps/step-glass";
import { StepExtras } from "@/components/steps/step-extras";
import { StepSummary } from "@/components/steps/step-summary";
import { StepContact } from "@/components/steps/step-contact";
import type { Step } from "@/store/quote-store";

const STEP_ORDER: Step[] = ["product", "dimensions", "glass", "extras", "summary", "contact"];

const STEPS = {
  product:    StepProduct,
  dimensions: StepDimensions,
  glass:      StepGlass,
  extras:     StepExtras,
  summary:    StepSummary,
  contact:    StepContact,
};

export function QuoteFlow() {
  const { currentStep, prevStep, setPriceTables } = useQuoteStore();

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setPriceTables)
      .catch(() => {});
  }, [setPriceTables]);
  const prevStepRef = useRef(currentStep);
  const dir = STEP_ORDER.indexOf(currentStep) >= STEP_ORDER.indexOf(prevStepRef.current) ? 1 : -1;
  prevStepRef.current = currentStep;

  const StepComponent = STEPS[currentStep];
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const canGoBack = stepIndex > 0 && currentStep !== "product";

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#080808" }}>

      {/* Minimal header */}
      <header className="max-w-md mx-auto w-full px-8 pt-10 pb-0 flex items-center justify-between">
        <div className="w-7 h-7 flex items-center justify-start">
          {canGoBack && (
            <button
              onClick={prevStep}
              aria-label="Voltar"
              className="text-white/20 hover:text-white/50 transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
        <span className="text-[11px] text-white/15 tabular-nums tracking-widest select-none">
          {stepIndex + 1} / {STEP_ORDER.length}
        </span>
      </header>

      {/* Step content */}
      <main className="flex-1 flex flex-col px-8 pt-14 pb-12 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: dir > 0 ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir > 0 ? -14 : 14 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
