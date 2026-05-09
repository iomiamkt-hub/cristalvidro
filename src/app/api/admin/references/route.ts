export const runtime = "nodejs";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { getReferences, saveReferences } from "@/lib/server/storage";
import type { StoredReference } from "@/lib/server/storage";

async function auth() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifySession(token) : false;
}

export async function GET() {
  if (!(await auth())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(await getReferences());
}

export async function POST(req: Request) {
  if (!(await auth())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.imageUrl) {
    return Response.json({ error: "title and imageUrl required" }, { status: 400 });
  }
  const ref: StoredReference = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    title: String(body.title),
    description: String(body.description ?? ""),
    imageUrl: String(body.imageUrl),
    product: String(body.product ?? "box"),
  };
  const refs = await getReferences();
  refs.unshift(ref);
  await saveReferences(refs);
  return Response.json(ref);
}

export async function DELETE(req: Request) {
  if (!(await auth())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const refs = await getReferences();
  await saveReferences(refs.filter((r) => r.id !== id));
  return Response.json({ ok: true });
}
