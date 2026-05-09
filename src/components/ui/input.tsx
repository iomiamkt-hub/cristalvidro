"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, suffix, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white",
              "placeholder:text-zinc-600 text-sm outline-none",
              "focus:border-white/30 focus:bg-white/8 transition-all duration-200",
              suffix && "pr-12",
              error && "border-red-500/50",
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
