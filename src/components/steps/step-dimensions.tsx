"use client";

import { useState } from "react";
import { useQuoteStore } from "@/store/quote-store";
import { StepActions } from "@/components/ui/step-actions";
import { cn } from "@/lib/utils";

const QTY = [1, 2, 3, 4];

export function StepDimensions() {
  const { width, height, quantity, setDimensions, setQuantity, nextStep } = useQuoteStore();
  const [w, setW] = useState(String(width));
  const [h, setH] = useState(String(height));
  const [errors, setErrors] = useState<{ w?: string; h?: string }>({});

  function validate() {
    const e: { w?: string; h?: string } = {};
    if (!w || Number(w) < 20) e.w = "mín. 20";
    if (!h || Number(h) < 20) e.h = "mín. 20";
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
      <h1 className="text-[2.6rem] font-medium text-white leading-[1.08] tracking-tight mb-14">
        Medidas
      </h1>

      {/* Width + Height inputs */}
      <div className="grid grid-cols-2 gap-8 mb-14">
        {([
          { label: "Largura", val: w, set: setW, err: errors.w },
          { label: "Altura",  val: h, set: setH, err: errors.h },
        ] as const).map(({ label, val, set, err }) => (
          <div key={label}>
            <label className="block text-[10px] text-white/20 uppercase tracking-[0.14em] mb-4">
              {label}
            </label>
            <div className="relative border-b transition-colors duration-150"
              style={{ borderColor: err ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.08)" }}
            >
              <input
                type="number"
                value={val}
                onChange={(e) => { set(e.target.value); setErrors({}); }}
                min={20}
                max={500}
                className="w-full bg-transparent text-[2.2rem] font-medium text-white outline-none pb-3 pr-10 tracking-tight placeholder:text-white/10"
                placeholder="0"
              />
              <span className="absolute right-0 bottom-3.5 text-[13px] text-white/20 pointer-events-none">
                cm
              </span>
            </div>
            {err && <p className="text-[10px] text-red-400/60 mt-2">{err}</p>}
          </div>
        ))}
      </div>

      {/* Quantity */}
      <div className="mb-auto">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-5">Quantidade</p>
        <div className="flex gap-2.5">
          {QTY.map((n) => {
            const label = n === 4 ? "4+" : String(n);
            const sel = n === 4 ? quantity >= 4 : quantity === n;
            return (
              <button
                key={n}
                onClick={() => setQuantity(n)}
                className={cn(
                  "w-12 h-12 rounded-xl text-[14px] font-medium tracking-tight",
                  "transition-all duration-150",
                  sel
                    ? "bg-white text-zinc-950"
                    : "text-white/25 border border-white/[0.07] hover:text-white/45 hover:border-white/[0.14]"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <StepActions onNext={handleContinue} />
    </div>
  );
}
