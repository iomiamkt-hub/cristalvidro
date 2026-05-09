"use client";

import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import type { ProductType } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

const PRODUCTS: {
  id: ProductType;
  title: string;
  subtitle: string;
  emoji: string;
  highlight: string;
}[] = [
  {
    id: "box",
    title: "Box de Banheiro",
    subtitle: "Do simples ao frameless premium",
    emoji: "🚿",
    highlight: "Mais popular",
  },
  {
    id: "sacada",
    title: "Sacada",
    subtitle: "Visão desobstruída com segurança máxima",
    emoji: "🏙️",
    highlight: "Alta valorização",
  },
  {
    id: "guarda-corpo",
    title: "Guarda-corpo",
    subtitle: "Elegância estrutural para escadas e mezaninos",
    emoji: "🏗️",
    highlight: "Design moderno",
  },
  {
    id: "espelho",
    title: "Espelho",
    subtitle: "Sob medida, com ou sem moldura",
    emoji: "🪞",
    highlight: "Personalizado",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function StepProduct() {
  const { product, setProduct, nextStep } = useQuoteStore();

  function handleSelect(p: ProductType) {
    setProduct(p);
    setTimeout(nextStep, 220);
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-white tracking-tight">O que você precisa?</h2>
        <p className="text-zinc-500 text-sm mt-1">Selecione o tipo de produto para começar</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {PRODUCTS.map((p) => (
          <motion.button
            key={p.id}
            variants={item}
            onClick={() => handleSelect(p.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
              product === p.id
                ? "border-white bg-white/10 shadow-lg shadow-white/5"
                : "border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/6"
            }`}
          >
            <span className="absolute top-3 right-3 text-xs font-medium text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
              {p.highlight}
            </span>
            <div className="text-3xl mb-3">{p.emoji}</div>
            <h3 className="font-semibold text-white text-sm">{p.title}</h3>
            <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{p.subtitle}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
