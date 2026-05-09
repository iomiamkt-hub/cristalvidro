"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepActionsProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function StepActions({
  onNext,
  onBack,
  nextLabel = "Continuar",
  disabled = false,
  loading = false,
}: StepActionsProps) {
  return (
    <div className="mt-auto pt-8 flex items-center gap-4">
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors duration-150 flex-shrink-0"
        >
          ← Voltar
        </button>
      )}
      <motion.button
        onClick={onNext}
        disabled={disabled || loading}
        whileTap={disabled || loading ? {} : { scale: 0.97 }}
        className={cn(
          "flex-1 h-12 rounded-xl text-sm font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          disabled
            ? "bg-white/6 text-zinc-600 cursor-not-allowed"
            : "bg-white text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200"
        )}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
        ) : (
          nextLabel
        )}
      </motion.button>
    </div>
  );
}
