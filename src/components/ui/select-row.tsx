"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SelectRowProps {
  label: string;
  sublabel?: string;
  badge?: string;
  selected: boolean;
  onClick: () => void;
  index?: number;
}

export function SelectRow({ label, sublabel, badge, selected, onClick, index = 0 }: SelectRowProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, delay: index * 0.035 }}
      whileTap={{ scale: 0.995 }}
      className={cn(
        "w-full flex items-center justify-between py-[18px]",
        "border-b border-white/[0.06] last:border-0",
        "text-left focus-visible:outline-none group cursor-pointer"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className={cn(
          "text-[15px] font-medium tracking-tight transition-colors duration-150",
          selected ? "text-white" : "text-white/40 group-hover:text-white/70"
        )}>
          {label}
        </span>
        {sublabel && (
          <span className="text-[12px] text-white/20">{sublabel}</span>
        )}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        {badge && (
          <span className={cn(
            "text-[11px] tracking-wide transition-colors duration-150",
            selected ? "text-white/40" : "text-white/18"
          )}>
            {badge}
          </span>
        )}

        {/* Radio */}
        <div className={cn(
          "w-[18px] h-[18px] rounded-full border flex items-center justify-center",
          "transition-all duration-200",
          selected
            ? "border-white"
            : "border-white/[0.18] group-hover:border-white/35"
        )}>
          <motion.div
            initial={false}
            animate={selected ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="w-[8px] h-[8px] rounded-full bg-white"
          />
        </div>
      </div>
    </motion.button>
  );
}
