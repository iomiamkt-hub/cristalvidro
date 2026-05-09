"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, onClick, type = "button", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        disabled={disabled || loading}
        onClick={onClick}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-2xl transition-all duration-200 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-white text-zinc-900 shadow-lg shadow-white/10 hover:bg-white/90":
              variant === "primary",
            "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5":
              variant === "ghost",
            "bg-transparent text-zinc-300 border border-white/20 hover:border-white/40 hover:text-white":
              variant === "outline",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-3 text-sm": size === "md",
            "px-8 py-4 text-base": size === "lg",
          },
          className
        )}
        {...(props as object)}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
