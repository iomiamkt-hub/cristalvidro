export const runtime = "nodejs";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { getPriceTables, savePriceTables } from "@/lib/server/storage";
import type { ProductType, PriceTable } from "@/lib/pricing";

async function auth() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifySession(token) : false;
}

export async function GET() {
  if (!(await auth())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(await getPriceTables());
}

export async function PUT(req: Request) {
  if (!(await auth())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });
  await savePriceTables(body as Record<ProductType, PriceTable>);
  return Response.json({ ok: true });
}
