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

const QTY_CHIPS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4+" },
];

export function StepDimensions() {
  const { width, height, quantity, setDimensions, setQuantity, nextStep, prevStep } = useQuoteStore();
  const [w, setW] = useState(String(width));
  const [h, setH] = useState(String(height));
  const [errors, setErrors] = useState<{ w?: string; h?: string }>({});

  const qDisplay = quantity >= 4 ? 4 : quantity;

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
    nextStep();
  }

  return (
    <div className="flex flex-col flex-1">
      <StepHeading>Qual o tamanho?</StepHeading>

      {/* Presets rápidos */}
      <div className="flex flex-wrap gap-2 mb-10">
        {PRESETS.map((p) => {
          const active = w === String(p.w) && h === String(p.h);
          return (
            <button
              key={p.label}
              onClick={() => { setW(String(p.w)); setH(String(p.h)); setErrors({}); }}
              className={cn(
                "h-8 px-3.5 rounded-lg text-[12px] font-medium tracking-wide",
                "transition-all duration-150 focus-visible:outline-none",
                active
                  ? "bg-white text-zinc-950"
                  : "bg-white/[0.04] text-white/25 border border-white/[0.08] hover:text-white/50"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Inputs largura e altura */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { label: "Largura", val: w, set: setW, err: errors.w },
          { label: "Altura",  val: h, set: setH, err: errors.h },
        ].map(({ label, val, set, err }) => (
          <div key={label}>
            <label className="block text-[10px] text-white/20 uppercase tracking-[0.14em] mb-2.5">
              {label}
            </label>
            <div className="relative">
              <input
                type="number"
                value={val}
                onChange={(e) => { set(e.target.value); setErrors({}); }}
                min={20}
                max={500}
                className={cn(
                  "w-full h-14 bg-white/[0.04] border rounded-xl px-4 pr-11",
                  "text-white text-[15px] font-medium outline-none",
                  "transition-colors duration-150 placeholder:text-white/10",
                  err
                    ? "border-red-500/30"
                    : "border-white/[0.09] focus:border-white/20"
                )}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/20 pointer-events-none">
                cm
              </span>
            </div>
            {err && <p className="text-[11px] text-red-400/70 mt-1.5">{err}</p>}
          </div>
        ))}
      </div>

      {/* Quantidade */}
      <div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-4">Quantidade</p>
        <div className="flex gap-2">
          {QTY_CHIPS.map((chip) => {
            const sel = chip.value === qDisplay;
            return (
              <button
                key={chip.value}
                onClick={() => setQuantity(chip.value)}
                className={cn(
                  "w-12 h-12 rounded-xl text-[14px] font-semibold tracking-tight",
                  "transition-all duration-150 focus-visible:outline-none",
                  sel
                    ? "bg-white text-zinc-950"
                    : "bg-white/[0.04] text-white/25 border border-white/[0.08] hover:text-white/50"
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <StepActions onNext={handleContinue} onBack={prevStep} />
    </div>
  );
}
