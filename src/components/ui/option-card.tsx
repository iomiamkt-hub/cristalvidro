"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  recommended?: boolean;
}

export function OptionCard({
  selected,
  onClick,
  title,
  description,
  badge,
  icon,
  recommended,
}: OptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        selected
          ? "border-white bg-white/10 shadow-lg shadow-white/5"
          : "border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/6"
      )}
    >
      {recommended && (
        <span className="absolute -top-2.5 left-4 text-xs font-semibold bg-white text-zinc-900 px-2 py-0.5 rounded-full">
          Recomendado
        </span>
      )}
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={cn(
              "mt-0.5 p-2 rounded-xl transition-colors",
              selected ? "bg-white/20" : "bg-white/5"
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "font-semibold text-sm transition-colors",
                selected ? "text-white" : "text-zinc-300"
              )}
            >
              {title}
            </span>
            {badge && (
              <span className="text-xs text-zinc-400 whitespace-nowrap">{badge}</span>
            )}
          </div>
          {description && (
            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
        <div
          className={cn(
            "mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all",
            selected ? "border-white bg-white" : "border-zinc-600"
          )}
        >
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-full h-full rounded-full bg-zinc-900 scale-50"
            />
          )}
        </div>
      </div>
    </motion.button>
  );
}
