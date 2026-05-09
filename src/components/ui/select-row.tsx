"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SelectRowProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
  index?: number;
  badge?: string;
}

export function SelectRow({ label, sublabel, selected, onClick, index = 0, badge }: SelectRowProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "w-full flex items-center justify-between py-4",
        "border-b border-white/[0.06] last:border-0",
        "text-left transition-colors duration-150 group",
        "focus-visible:outline-none"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            "text-[15px] font-medium transition-colors duration-150",
            selected ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
          )}
        >
          {label}
        </span>
        {sublabel && (
          <span className="text-xs text-zinc-700">{sublabel}</span>
        )}
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0 ml-4">
        {badge && (
          <span className="text-[10px] text-zinc-600">{badge}</span>
        )}
        <div
          className={cn(
            "w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-200",
            selected ? "border-white" : "border-zinc-700 group-hover:border-zinc-500"
          )}
        >
          <motion.div
            initial={false}
            animate={selected ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="w-[8px] h-[8px] rounded-full bg-white"
          />
        </div>
      </div>
    </motion.button>
  );
}
