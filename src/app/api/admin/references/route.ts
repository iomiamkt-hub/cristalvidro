export const runtime = "nodejs";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { getReferences, addReference, deleteReference } from "@/services/references";

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
  const ref = await addReference({
    title: String(body.title),
    description: String(body.description ?? ""),
    imageUrl: String(body.imageUrl),
    product: String(body.product ?? "box"),
  });
  if (!ref) return Response.json({ error: "Failed to add reference" }, { status: 500 });
  return Response.json(ref);
}

export async function DELETE(req: Request) {
  if (!(await auth())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const ok = await deleteReference(id);
  if (!ok) return Response.json({ error: "Failed to delete reference" }, { status: 500 });
  return Response.json({ ok: true });
}
