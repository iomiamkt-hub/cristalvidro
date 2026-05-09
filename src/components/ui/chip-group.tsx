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
    <div className="space-y-4">
      {label && (
        <p className="text-[11px] text-white/20 uppercase tracking-[0.12em]">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const sel = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              onClick={() => onChange(opt.value)}
              className={cn(
                "h-9 px-4 rounded-lg text-[13px] font-medium tracking-wide",
                "transition-all duration-150 focus-visible:outline-none",
                sel
                  ? "bg-white text-zinc-950"
                  : "bg-white/[0.04] text-white/30 border border-white/[0.08] hover:text-white/60 hover:border-white/[0.16]"
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
