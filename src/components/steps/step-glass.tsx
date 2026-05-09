"use client";

import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import type { GlassType, ThicknessOption } from "@/lib/pricing";
import { OptionCard } from "@/components/ui/option-card";
import { Button } from "@/components/ui/button";

const GLASS_OPTIONS: { id: GlassType; title: string; description: string; badge: string; recommended?: boolean }[] = [
  {
    id: "temperado",
    title: "Temperado",
    description: "Padrão de segurança. 5x mais resistente que o vidro comum.",
    badge: "Mais usado",
    recommended: true,
  },
  {
    id: "laminado",
    title: "Laminado",
    description: "Fragmentos retidos em caso de quebra. Ideal para sacadas.",
    badge: "+35%",
  },
  {
    id: "jateado",
    title: "Jateado",
    description: "Translúcido fosco. Privacidade sem perder luminosidade.",
    badge: "+25%",
  },
  {
    id: "espelhado",
    title: "Espelhado",
    description: "Reflexo parcial. Visual sofisticado e efeito ampliador.",
    badge: "+40%",
  },
];

const THICKNESS_OPTIONS: { value: ThicknessOption; label: string; description: string }[] = [
  { value: 6, label: "6 mm", description: "Para peças menores e interiores" },
  { value: 8, label: "8 mm", description: "Padrão residencial — melhor custo-benefício" },
  { value: 10, label: "10 mm", description: "Alta resistência, ideal para sacadas" },
  { value: 12, label: "12 mm", description: "Máxima robustez — uso premium" },
];

export function StepGlass() {
  const { glassType, thickness, setGlassType, setThickness, nextStep, prevStep } = useQuoteStore();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-white tracking-tight">Tipo de vidro</h2>
        <p className="text-zinc-500 text-sm mt-1">Escolha o acabamento e a espessura</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-5"
      >
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Tipo de acabamento
          </p>
          <div className="space-y-2">
            {GLASS_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.id}
                selected={glassType === opt.id}
                onClick={() => setGlassType(opt.id)}
                title={opt.title}
                description={opt.description}
                badge={opt.badge}
                recommended={opt.recommended}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Espessura
          </p>
          <div className="grid grid-cols-2 gap-2">
            {THICKNESS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setThickness(opt.value)}
                className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                  thickness === opt.value
                    ? "border-white bg-white/10 text-white"
                    : "border-white/10 bg-white/3 text-zinc-400 hover:border-white/25 hover:text-zinc-300"
                }`}
              >
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className="text-xs mt-0.5 opacity-70 leading-relaxed">{opt.description}</p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={prevStep} className="flex-1">
          Voltar
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );
}
