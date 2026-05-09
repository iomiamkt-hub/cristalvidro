export const runtime = "nodejs";

import { getPriceTables } from "@/services/pricing";

export async function GET() {
  const priceTables = await getPriceTables();
  return Response.json(priceTables, {
    headers: { "Cache-Control": "no-store" },
  });
}
