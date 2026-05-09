"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProductSubtypeOption } from "@/lib/pricing";

/** Ícones geométricos minimalistas para subtipos */
function SubtypeGlyph({ id }: { id: string }) {
  const glyphs: Record<string, React.ReactNode> = {
    // Box
    abrir: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="5" y1="18" x2="5" y2="4" />
        <path d="M5 4 L14 10 L5 16" />
      </svg>
    ),
    correr: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="4" y1="18" x2="4" y2="4" />
        <line x1="11" y1="18" x2="11" y2="4" />
        <line x1="8" y1="11" x2="14" y2="11" />
        <line x1="12" y1="9" x2="14" y2="11" /><line x1="12" y1="13" x2="14" y2="11" />
      </svg>
    ),
    canto: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="4" y1="16" x2="4" y2="5" />
        <line x1="4" y1="16" x2="15" y2="16" />
      </svg>
    ),
    banheira: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 12 Q3 16 10 16 Q17 16 17 12" />
        <line x1="3" y1="10" x2="17" y2="10" />
        <line x1="6" y1="10" x2="6" y2="7" />
      </svg>
    ),
    // Sacada
    reta: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="3" y1="13" x2="17" y2="13" />
        <line x1="3" y1="10" x2="17" y2="10" />
        <line x1="3" y1="8" x2="17" y2="8" />
      </svg>
    ),
    "canto-90": (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="4" y1="16" x2="4" y2="7" />
        <line x1="4" y1="16" x2="15" y2="16" />
        <line x1="4" y1="9" x2="13" y2="9" />
      </svg>
    ),
    "canto-135": (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="3" y1="16" x2="10" y2="7" />
        <line x1="10" y1="7" x2="17" y2="16" />
        <line x1="5" y1="13" x2="15" y2="13" />
      </svg>
    ),
    curva: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 16 Q10 8 17 16" />
        <path d="M3 13 Q10 6 17 13" />
      </svg>
    ),
    // Guarda-corpo
    escada: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 16 L4 12 L8 12 L8 8 L12 8 L12 4 L16 4" />
        <line x1="3" y1="17" x2="17" y2="17" />
      </svg>
    ),
    mezanino: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="3" y1="10" x2="17" y2="10" />
        <line x1="6" y1="10" x2="6" y2="14" />
        <line x1="10" y1="10" x2="10" y2="14" />
        <line x1="14" y1="10" x2="14" y2="14" />
        <line x1="3" y1="14" x2="17" y2="14" />
      </svg>
    ),
    varanda: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="4" y="8" width="12" height="8" rx="0.5" />
        <line x1="3" y1="8" x2="17" y2="8" />
        <line x1="3" y1="16" x2="17" y2="16" />
      </svg>
    ),
    piscina: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="4" y="7" width="12" height="9" rx="0.5" />
        <path d="M4 14 Q7 12 10 14 Q13 16 16 14" />
        <line x1="3" y1="7" x2="17" y2="7" />
      </svg>
    ),
    // Espelho
    simples: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="5" y="4" width="10" height="13" rx="1" />
      </svg>
    ),
    bisote: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="5" y="4" width="10" height="13" rx="1" />
        <rect x="7" y="6" width="6" height="9" rx="0.5" strokeWidth="0.75" strokeOpacity="0.5" />
      </svg>
    ),
    lapidado: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M10 3 L16 6 L16 15 L10 18 L4 15 L4 6 Z" />
      </svg>
    ),
    decorativo: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="10" cy="10" r="7" />
        <line x1="6" y1="6" x2="9" y2="9" strokeOpacity="0.5" strokeWidth="0.75" />
      </svg>
    ),
  };

  return <>{glyphs[id] ?? null}</>;
}

interface SubtypeCardProps {
  option: ProductSubtypeOption;
  selected: boolean;
  onClick: () => void;
  index: number;
}

export function SubtypeCard({ option, selected, onClick, index }: SubtypeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ x: 2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "group relative w-full text-left",
        "flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        "cursor-pointer",
        selected
          ? "border-white/40 bg-white/[0.07]"
          : "border-white/[0.07] bg-transparent hover:border-white/18 hover:bg-white/[0.03]"
      )}
    >
      {option.recommended && (
        <span className="absolute -top-2 left-3.5 text-[9px] font-bold tracking-wide uppercase bg-white text-zinc-900 px-1.5 py-0.5 rounded-full">
          Recomendado
        </span>
      )}

      {/* Ícone geométrico */}
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200",
          selected
            ? "border-white/30 bg-white/10 text-white"
            : "border-white/8 bg-white/[0.03] text-zinc-600 group-hover:border-white/15 group-hover:text-zinc-400"
        )}
      >
        <SubtypeGlyph id={option.id} />
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold leading-none transition-colors duration-200",
            selected ? "text-white" : "text-zinc-300 group-hover:text-white"
          )}
        >
          {option.title}
        </p>
        <p className="text-zinc-600 text-[11px] leading-relaxed mt-1 group-hover:text-zinc-500 transition-colors duration-200">
          {option.description}
        </p>
      </div>

      {/* Lado direito: preço + radio */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
        {option.priceAdj > 0 ? (
          <span className="text-[10px] font-medium text-zinc-500 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-md tabular-nums">
            +R$ {option.priceAdj}
          </span>
        ) : (
          <span className="text-[10px] font-medium text-zinc-600 px-1.5 py-0.5">
            incluso
          </span>
        )}

        {/* Indicador de radio */}
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            selected ? "border-white" : "border-zinc-700 group-hover:border-zinc-500"
          )}
        >
          <motion.div
            initial={false}
            animate={selected ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="w-2 h-2 rounded-full bg-white"
          />
        </div>
      </div>
    </motion.button>
  );
}
