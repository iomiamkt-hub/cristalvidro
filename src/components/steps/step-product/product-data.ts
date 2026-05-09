import type { ProductType } from "@/lib/pricing";

export interface ProductDef {
  id: ProductType;
  title: string;
  subtitle: string;
  tag: string;
  tagVariant: "popular" | "value" | "design" | "custom";
  /** Cor de accent usada no glow do hover/select */
  accent: string;
}

export const PRODUCTS: ProductDef[] = [
  {
    id: "box",
    title: "Box de Banheiro",
    subtitle: "Do simples ao frameless premium",
    tag: "Mais popular",
    tagVariant: "popular",
    accent: "rgba(148,163,184,0.12)",   // slate
  },
  {
    id: "sacada",
    title: "Sacada de Vidro",
    subtitle: "Visão desobstruída com segurança total",
    tag: "Alta valorização",
    tagVariant: "value",
    accent: "rgba(125,211,252,0.10)",   // sky
  },
  {
    id: "guarda-corpo",
    title: "Guarda-corpo",
    subtitle: "Elegância estrutural para escadas e mezaninos",
    tag: "Design moderno",
    tagVariant: "design",
    accent: "rgba(251,191,36,0.09)",    // amber
  },
  {
    id: "espelho",
    title: "Espelho",
    subtitle: "Sob medida, com ou sem moldura",
    tag: "Personalizado",
    tagVariant: "custom",
    accent: "rgba(192,132,252,0.10)",   // violet
  },
];

export const TAG_STYLES: Record<ProductDef["tagVariant"], string> = {
  popular: "text-emerald-400 bg-emerald-400/8 border-emerald-400/20",
  value:   "text-sky-400    bg-sky-400/8    border-sky-400/20",
  design:  "text-amber-400  bg-amber-400/8  border-amber-400/20",
  custom:  "text-violet-400 bg-violet-400/8 border-violet-400/20",
};
