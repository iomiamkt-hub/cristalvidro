"use client";

import { cn } from "@/lib/utils";

interface ChipOption<T extends string | number> {
  value: T;
  label: string;
}

interface ChipGroupProps<T extends string | number> {
  options: ChipOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
}

export function ChipGroup<T extends string | number>({ options, value, onChange, label }: ChipGroupProps<T>) {
  return (
    <div className="space-y-3">
      {label && (
        <p className="text-xs text-zinc-600 uppercase tracking-widest">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              onClick={() => onChange(opt.value)}
              className={cn(
                "h-9 px-4 rounded-lg text-sm font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                selected
                  ? "bg-white text-zinc-900"
                  : "bg-white/[0.04] text-zinc-500 border border-white/[0.07] hover:text-zinc-300 hover:border-white/15"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
