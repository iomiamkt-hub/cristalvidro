"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepActionsProps {
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function StepActions({
  onNext,
  nextLabel = "Continuar",
  disabled = false,
  loading = false,
}: StepActionsProps) {
  return (
    <div className="mt-auto pt-10">
      <motion.button
        onClick={onNext}
        disabled={disabled || loading}
        whileTap={disabled || loading ? {} : { scale: 0.975 }}
        className={cn(
          "w-full h-[52px] rounded-xl text-[14px] font-semibold tracking-wide",
          "transition-all duration-200",
          disabled
            ? "bg-white/[0.05] text-white/20 cursor-not-allowed"
            : "bg-white text-zinc-950 hover:bg-zinc-100"
        )}
      >
        {loading ? (
          <span className="inline-block w-[18px] h-[18px] border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
        ) : (
          nextLabel
        )}
      </motion.button>
    </div>
  );
}
