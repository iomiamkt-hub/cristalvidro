"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Step } from "@/store/quote-store";

const STEPS: { key: Step; label: string }[] = [
  { key: "product", label: "Produto" },
  { key: "dimensions", label: "Medidas" },
  { key: "glass", label: "Vidro" },
  { key: "extras", label: "Detalhes" },
  { key: "summary", label: "Resumo" },
  { key: "contact", label: "Contato" },
];

interface ProgressBarProps {
  currentStep: Step;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="relative w-full flex items-center">
                {idx > 0 && (
                  <div className="absolute left-0 right-1/2 h-px top-1/2 -translate-y-1/2">
                    <motion.div
                      className="h-full bg-white origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isDone ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-0 bg-white/10" />
                  </div>
                )}
                {idx < STEPS.length - 1 && (
                  <div className="absolute left-1/2 right-0 h-px top-1/2 -translate-y-1/2">
                    <div className="absolute inset-0 bg-white/10" />
                  </div>
                )}
                <div className="relative z-10 mx-auto">
                  <motion.div
                    className={cn(
                      "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold",
                      isDone
                        ? "bg-white border-white text-zinc-900"
                        : isCurrent
                        ? "bg-zinc-900 border-white text-white"
                        : "bg-zinc-900 border-white/20 text-zinc-600"
                    )}
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDone ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </motion.div>
                </div>
              </div>
              <span
                className={cn(
                  "text-xs transition-colors duration-200 hidden sm:block",
                  isCurrent ? "text-white font-medium" : isDone ? "text-zinc-400" : "text-zinc-600"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
