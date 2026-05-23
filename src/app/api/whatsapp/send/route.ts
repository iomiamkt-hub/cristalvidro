export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { handleIncomingMessage } from "@/services/whatsapp-agent";
import { sendText } from "@/lib/whatsapp-client";

/**
 * Admin-only endpoints for WhatsApp conversations.
 *
 * POST /api/whatsapp/send  — simulate an incoming message (for testing)
 *   Body: { phone: string; message: string; simulate?: boolean }
 *   simulate=true  → runs through AI agent (as if customer sent it)
 *   simulate=false → sends a raw text directly to the number
 */
export async function POST(req: NextRequest) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone, message, simulate = true } = await req.json();
  if (!phone || !message) {
    return NextResponse.json({ error: "phone and message required" }, { status: 400 });
  }

  if (simulate) {
    await handleIncomingMessage(String(phone), String(message));
    return NextResponse.json({ ok: true, mode: "simulated" });
  } else {
    await sendText(String(phone), String(message));
    return NextResponse.json({ ok: true, mode: "direct" });
  }
}
