"use client";

import { useState } from "react";
import { useQuoteStore } from "@/store/quote-store";
import { StepHeading } from "@/components/ui/step-heading";
import { StepActions } from "@/components/ui/step-actions";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "90 × 200", w: 90, h: 200 },
  { label: "100 × 210", w: 100, h: 210 },
  { label: "120 × 200", w: 120, h: 200 },
  { label: "150 × 220", w: 150, h: 220 },
];

export function StepDimensions() {
  const { width, height, quantity, setDimensions, setQuantity, nextStep, prevStep } = useQuoteStore();
  const [w, setW] = useState(String(width));
  const [h, setH] = useState(String(height));
  const [q, setQ] = useState(String(quantity));
  const [errors, setErrors] = useState<{ w?: string; h?: string }>({});

  function validate() {
    const e: { w?: string; h?: string } = {};
    if (!w || Number(w) < 20) e.w = "mín. 20 cm";
    if (!h || Number(h) < 20) e.h = "mín. 20 cm";
    setErrors(e);
    return !e.w && !e.h;
  }

  function handleContinue() {
    if (!validate()) return;
    setDimensions(Number(w), Number(h));
    setQuantity(Math.max(1, Number(q) || 1));
    nextStep();
  }

  const area = ((Number(w) || 0) * (Number(h) || 0)) / 10000;

  return (
    <div className="flex flex-col flex-1">
      <StepHeading>Qual o tamanho?</StepHeading>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PRESETS.map((p) => {
          const active = w === String(p.w) && h === String(p.h);
          return (
            <button
              key={p.label}
              onClick={() => { setW(String(p.w)); setH(String(p.h)); setErrors({}); }}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                active
                  ? "bg-white text-zinc-900"
                  : "bg-white/[0.04] text-zinc-500 border border-white/[0.07] hover:text-zinc-300"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Inputs largura + altura */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Largura", val: w, set: setW, err: errors.w },
          { label: "Altura",  val: h, set: setH, err: errors.h },
        ].map(({ label, val, set, err }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-600 uppercase tracking-widest">{label}</label>
            <div className="relative">
              <input
                type="number"
                value={val}
                onChange={(e) => { set(e.target.value); setErrors({}); }}
                min={20}
                max={500}
                className={cn(
                  "w-full h-12 bg-white/[0.04] border rounded-xl px-4 pr-10",
                  "text-white text-sm outline-none transition-all duration-150",
                  "placeholder:text-zinc-700",
                  err
                    ? "border-red-500/40 focus:border-red-400/60"
                    : "border-white/[0.08] focus:border-white/25"
                )}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 text-xs pointer-events-none">cm</span>
            </div>
            {err && <p className="text-[10px] text-red-400">{err}</p>}
          </div>
        ))}
      </div>

      {/* Quantidade */}
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-[10px] text-zinc-600 uppercase tracking-widest">Quantidade</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQ(String(Math.max(1, Number(q) - 1)))}
            className="w-10 h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/20 transition-all text-lg flex items-center justify-center"
          >
            −
          </button>
          <span className="text-white font-semibold text-base w-8 text-center tabular-nums">{q}</span>
          <button
            onClick={() => setQ(String(Math.min(50, Number(q) + 1)))}
            className="w-10 h-10 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/20 transition-all text-lg flex items-center justify-center"
          >
            +
          </button>
          <span className="text-zinc-700 text-xs ml-1">
            {area > 0 ? `${(area * Number(q)).toFixed(2)} m² total` : "peças"}
          </span>
        </div>
      </div>

      <StepActions onNext={handleContinue} onBack={prevStep} />
    </div>
  );
}
