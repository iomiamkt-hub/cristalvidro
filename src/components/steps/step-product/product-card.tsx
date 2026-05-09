"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PRODUCT_ICONS } from "./product-icons";
import { TAG_STYLES, type ProductDef } from "./product-data";

interface ProductCardProps {
  product: ProductDef;
  selected: boolean;
  onClick: () => void;
  index: number;
}

export function ProductCard({ product, selected, onClick, index }: ProductCardProps) {
  const Icon = PRODUCT_ICONS[product.id];

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.025, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.975, transition: { duration: 0.1 } }}
      className={cn(
        "group relative text-left w-full h-full",
        "rounded-2xl border transition-colors duration-300 overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        "cursor-pointer",
        selected
          ? "border-white/60 bg-white/[0.07]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      )}
    >
      {/* Glow de accent no hover/select */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        style={{ background: `radial-gradient(ellipse 120% 80% at 30% 0%, ${product.accent}, transparent 65%)` }}
      />

      {/* Linha de brilho no topo quando selecionado */}
      <div
        className={cn(
          "absolute top-0 left-6 right-6 h-px transition-opacity duration-300 pointer-events-none",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-40"
        )}
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }}
      />

      <div className="relative p-4 sm:p-5 flex flex-col h-full min-h-[160px]">
        {/* Badge de tag */}
        <span
          className={cn(
            "self-start inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md border",
            TAG_STYLES[product.tagVariant]
          )}
        >
          {product.tag}
        </span>

        {/* Ícone SVG */}
        <div
          className={cn(
            "mt-auto mb-2 transition-colors duration-300",
            selected ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
          )}
        >
          <Icon size={44} />
        </div>

        {/* Textos */}
        <h3
          className={cn(
            "font-semibold text-sm leading-snug transition-colors duration-200",
            selected ? "text-white" : "text-zinc-200 group-hover:text-white"
          )}
        >
          {product.title}
        </h3>
        <p className="text-zinc-600 text-[11px] leading-relaxed mt-0.5 group-hover:text-zinc-500 transition-colors duration-200">
          {product.subtitle}
        </p>
      </div>

      {/* Checkmark de seleção */}
      <motion.div
        initial={false}
        animate={selected ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center pointer-events-none"
      >
        <svg className="w-2.5 h-2.5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    </motion.button>
  );
}
