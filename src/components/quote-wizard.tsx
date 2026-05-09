"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useQuoteStore, STEP_ORDER_CONST } from "@/store/quote-store";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StepProduct } from "@/components/steps/step-product";
import { StepDimensions } from "@/components/steps/step-dimensions";
import { StepGlass } from "@/components/steps/step-glass";
import { StepExtras } from "@/components/steps/step-extras";
import { StepSummary } from "@/components/steps/step-summary";
import { StepContact } from "@/components/steps/step-contact";

const STEP_COMPONENTS = {
  product: StepProduct,
  dimensions: StepDimensions,
  glass: StepGlass,
  extras: StepExtras,
  summary: StepSummary,
  contact: StepContact,
};

export function QuoteWizard() {
  const { currentStep } = useQuoteStore();
  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLastStep = currentStep === "contact";

  return (
    <div className="flex flex-col gap-6">
      {!isLastStep && <ProgressBar currentStep={currentStep} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
