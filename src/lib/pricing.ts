export type ProductType = "box" | "sacada" | "guarda-corpo" | "espelho";
export type GlassType = "temperado" | "laminado" | "jateado" | "espelhado";
export type ThicknessOption = 6 | 8 | 10 | 12;
export type ProfileType = "sem-perfil" | "aluminio" | "inox" | "preto-fosco";
export type InstallationType = "parafuso" | "embutido" | "frameless";

export interface PriceTable {
  basePerM2: number;
  glassMultiplier: Record<GlassType, number>;
  thicknessMultiplier: Record<ThicknessOption, number>;
  profilePrice: Record<ProfileType, number>;
  installationPrice: Record<InstallationType, number>;
  minimumPrice: number;
}

export const PRICE_TABLES: Record<ProductType, PriceTable> = {
  box: {
    basePerM2: 580,
    glassMultiplier: { temperado: 1, laminado: 1.35, jateado: 1.25, espelhado: 1.4 },
    thicknessMultiplier: { 6: 1, 8: 1.2, 10: 1.45, 12: 1.7 },
    profilePrice: { "sem-perfil": 0, aluminio: 180, inox: 320, "preto-fosco": 280 },
    installationPrice: { parafuso: 150, embutido: 280, frameless: 450 },
    minimumPrice: 890,
  },
  sacada: {
    basePerM2: 720,
    glassMultiplier: { temperado: 1, laminado: 1.3, jateado: 1.2, espelhado: 1.5 },
    thicknessMultiplier: { 6: 1, 8: 1.15, 10: 1.4, 12: 1.65 },
    profilePrice: { "sem-perfil": 0, aluminio: 220, inox: 380, "preto-fosco": 340 },
    installationPrice: { parafuso: 200, embutido: 350, frameless: 520 },
    minimumPrice: 1200,
  },
  "guarda-corpo": {
    basePerM2: 680,
    glassMultiplier: { temperado: 1, laminado: 1.4, jateado: 1.15, espelhado: 1.45 },
    thicknessMultiplier: { 6: 1, 8: 1.18, 10: 1.42, 12: 1.68 },
    profilePrice: { "sem-perfil": 0, aluminio: 200, inox: 360, "preto-fosco": 310 },
    installationPrice: { parafuso: 180, embutido: 300, frameless: 480 },
    minimumPrice: 1100,
  },
  espelho: {
    basePerM2: 420,
    glassMultiplier: { temperado: 1, laminado: 1.2, jateado: 1.1, espelhado: 1.3 },
    thicknessMultiplier: { 6: 1, 8: 1.1, 10: 1.3, 12: 1.5 },
    profilePrice: { "sem-perfil": 0, aluminio: 140, inox: 260, "preto-fosco": 220 },
    installationPrice: { parafuso: 100, embutido: 220, frameless: 380 },
    minimumPrice: 550,
  },
};

export interface QuoteConfig {
  product: ProductType;
  width: number;
  height: number;
  glassType: GlassType;
  thickness: ThicknessOption;
  profile: ProfileType;
  installation: InstallationType;
  quantity: number;
}

export function calculateQuote(config: QuoteConfig): {
  subtotal: number;
  area: number;
  total: number;
  breakdown: { label: string; value: number }[];
} {
  const table = PRICE_TABLES[config.product];
  const area = (config.width * config.height) / 10000;

  const glassBase = area * table.basePerM2 * table.glassMultiplier[config.glassType];
  const thicknessAdjust = glassBase * (table.thicknessMultiplier[config.thickness] - 1);
  const profileCost = table.profilePrice[config.profile];
  const installCost = table.installationPrice[config.installation];

  const unitPrice = Math.max(glassBase + thicknessAdjust + profileCost + installCost, table.minimumPrice);
  const total = unitPrice * config.quantity;

  return {
    area,
    subtotal: unitPrice,
    total,
    breakdown: [
      { label: "Vidro base", value: glassBase },
      { label: "Espessura", value: thicknessAdjust },
      { label: "Perfil", value: profileCost },
      { label: "Instalação", value: installCost },
    ],
  };
}
