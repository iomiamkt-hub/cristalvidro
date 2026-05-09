import { createServerClient } from "@/lib/supabase/server";
import { PRICE_TABLES } from "@/lib/pricing";
import type { ProductType, PriceTable } from "@/lib/pricing";

type PricingRow = {
  product: string;
  base_per_m2: number;
  minimum_price: number;
  glass_multiplier: Record<string, number>;
  thickness_multiplier: Record<string, number>;
  profile_price: Record<string, number>;
  installation_price: Record<string, number>;
};

function rowToTable(row: PricingRow): PriceTable {
  return {
    basePerM2: row.base_per_m2,
    minimumPrice: row.minimum_price,
    glassMultiplier: row.glass_multiplier as PriceTable["glassMultiplier"],
    thicknessMultiplier: row.thickness_multiplier as PriceTable["thicknessMultiplier"],
    profilePrice: row.profile_price as PriceTable["profilePrice"],
    installationPrice: row.installation_price as PriceTable["installationPrice"],
  };
}

export async function getPriceTables(): Promise<Record<ProductType, PriceTable>> {
  const db = createServerClient();
  const { data, error } = await db.from("pricing_config").select("*");

  if (error) {
    console.warn("[pricing] Supabase error, using defaults:", error.message);
    return PRICE_TABLES;
  }

  const rows = (data ?? []) as unknown as PricingRow[];
  if (rows.length === 0) return PRICE_TABLES;

  const result: Partial<Record<ProductType, PriceTable>> = {};
  for (const row of rows) {
    result[row.product as ProductType] = rowToTable(row);
  }
  return { ...PRICE_TABLES, ...result } as Record<ProductType, PriceTable>;
}

export async function savePriceTables(tables: Record<ProductType, PriceTable>): Promise<void> {
  const db = createServerClient();

  const rows = (Object.entries(tables) as [ProductType, PriceTable][]).map(([product, t]) => ({
    product,
    base_per_m2: t.basePerM2,
    minimum_price: t.minimumPrice,
    glass_multiplier: t.glassMultiplier as Record<string, number>,
    thickness_multiplier: t.thicknessMultiplier as Record<string, number>,
    profile_price: t.profilePrice as Record<string, number>,
    installation_price: t.installationPrice as Record<string, number>,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await db
    .from("pricing_config")
    .upsert(rows, { onConflict: "product" });

  if (error) throw new Error(`[pricing] Save failed: ${error.message}`);
}
