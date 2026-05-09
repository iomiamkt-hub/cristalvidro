export const runtime = "nodejs";

import { insertQuote, getQuotes } from "@/services/quotes";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import type { StoredQuote } from "@/lib/supabase/types";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });

  const quote: StoredQuote = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    customer: {
      name: String(body.customer?.name ?? ""),
      phone: String(body.customer?.phone ?? ""),
      email: String(body.customer?.email ?? ""),
    },
    product: String(body.product ?? ""),
    subtype: body.subtype ? String(body.subtype) : null,
    width: Number(body.width ?? 0),
    height: Number(body.height ?? 0),
    glassType: String(body.glassType ?? ""),
    thickness: Number(body.thickness ?? 0),
    profile: String(body.profile ?? ""),
    installation: String(body.installation ?? ""),
    quantity: Number(body.quantity ?? 1),
    total: Number(body.total ?? 0),
  };

  const result = await insertQuote(quote);
  if (!result) return Response.json({ error: "Failed to save quote" }, { status: 500 });

  return Response.json({ ok: true, id: result.id });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(await getQuotes());
}
