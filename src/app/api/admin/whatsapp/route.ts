export const runtime = "nodejs";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { listConversations, resetConversation } from "@/services/conversations";

export async function GET() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(await listConversations());
}

export async function DELETE(req: Request) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  await resetConversation(id);
  return Response.json({ ok: true });
}
