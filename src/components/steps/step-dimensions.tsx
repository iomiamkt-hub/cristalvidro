"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PRESETS: { label: string; w: number; h: number }[] = [
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
    const newErrors: { w?: string; h?: string } = {};
    if (!w || Number(w) < 20) newErrors.w = "Mínimo 20 cm";
    if (!h || Number(h) < 20) newErrors.h = "Mínimo 20 cm";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleContinue() {
    if (!validate()) return;
    setDimensions(Number(w), Number(h));
    setQuantity(Math.max(1, Number(q) || 1));
    nextStep();
  }

  const area = ((Number(w) || 0) * (Number(h) || 0)) / 10000;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-white tracking-tight">Qual o tamanho?</h2>
        <p className="text-zinc-500 text-sm mt-1">Informe as medidas em centímetros</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-4"
      >
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
            Medidas prontas
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => { setW(String(preset.w)); setH(String(preset.h)); }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  w === String(preset.w) && h === String(preset.h)
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/10 bg-transparent text-zinc-500 hover:border-white/25 hover:text-zinc-300"
                }`}
              >
                {preset.label} cm
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Largura"
            type="number"
            value={w}
            onChange={(e) => { setW(e.target.value); setErrors({}); }}
            suffix="cm"
            error={errors.w}
            min={20}
            max={500}
          />
          <Input
            label="Altura"
            type="number"
            value={h}
            onChange={(e) => { setH(e.target.value); setErrors({}); }}
            suffix="cm"
            error={errors.h}
            min={20}
            max={500}
          />
        </div>

        <Input
          label="Quantidade de peças"
          type="number"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          min={1}
          max={50}
        />

        {area > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base">
              📐
            </div>
            <div>
              <p className="text-xs text-zinc-500">Área calculada por peça</p>
              <p className="text-white font-semibold text-sm">{area.toFixed(2)} m²</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={prevStep} className="flex-1">
          Voltar
        </Button>
        <Button onClick={handleContinue} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );
}
