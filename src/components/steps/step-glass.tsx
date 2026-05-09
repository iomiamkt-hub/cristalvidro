"use client";

import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import type { GlassType, ThicknessOption } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const GLASS: { id: GlassType; label: string }[] = [
  { id: "temperado", label: "Temperado" },
  { id: "laminado",  label: "Laminado" },
  { id: "jateado",   label: "Jateado" },
  { id: "espelhado", label: "Espelhado" },
];

const THICKNESS: ThicknessOption[] = [6, 8, 10, 12];

export function StepGlass() {
  const { glassType, thickness, setGlassType, setThickness, nextStep } = useQuoteStore();

  async function handleThickness(v: ThicknessOption) {
    setThickness(v);
    await new Promise((r) => setTimeout(r, 260));
    nextStep();
  }

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-[2.6rem] font-medium text-white leading-[1.08] tracking-tight mb-14">
        Tipo de vidro
      </h1>

      {/* Glass type list */}
      <div className="mb-14">
        {GLASS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGlassType(g.id)}
            className={cn(
              "w-full text-left py-6 border-b border-white/[0.05]",
              "flex items-center justify-between group",
              "transition-all duration-200"
            )}
          >
            <span className={cn(
              "text-[1.5rem] font-medium tracking-tight transition-colors duration-200",
              glassType === g.id ? "text-white" : "text-white/22 group-hover:text-white/55"
            )}>
              {g.label}
            </span>
            {glassType === g.id && (
              <motion.div
                layoutId="glass-dot"
                className="w-[7px] h-[7px] rounded-full bg-white flex-shrink-0"
              />
            )}
          </button>
        ))}
      </div>

      {/* Thickness — tap to advance */}
      <div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-5">Espessura</p>
        <div className="flex gap-2.5">
          {THICKNESS.map((t) => (
            <button
              key={t}
              onClick={() => handleThickness(t)}
              className={cn(
                "flex-1 h-11 rounded-xl text-[13px] font-medium tracking-tight",
                "transition-all duration-150",
                thickness === t
                  ? "bg-white text-zinc-950"
                  : "text-white/25 border border-white/[0.07] hover:text-white/45 hover:border-white/[0.14]"
              )}
            >
              {t} mm
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
