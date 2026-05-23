import { NextRequest, NextResponse } from "next/server";
import { handleIncomingMessage } from "@/services/whatsapp-agent";
import { normalizePhone } from "@/lib/whatsapp-client";

/**
 * Webhook endpoint for Evolution API.
 * Configure in Evolution API dashboard:
 *   URL: https://<seu-domínio>/api/whatsapp/webhook
 *   Events: MESSAGES_UPSERT
 *
 * Optional: set WHATSAPP_WEBHOOK_SECRET env var to validate requests.
 */

// Evolution API sends a POST with the message payload
export async function POST(req: NextRequest) {
  try {
    // Verify optional webhook secret
    const secret = process.env.WHATSAPP_WEBHOOK_SECRET;
    if (secret) {
      const incomingSecret = req.headers.get("x-webhook-secret") ?? req.nextUrl.searchParams.get("secret");
      if (incomingSecret !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok: true }); // ignore malformed

    // Evolution API webhook payload
    const event = body.event as string | undefined;

    // Only process incoming messages
    if (event !== "messages.upsert" && event !== "MESSAGES_UPSERT") {
      return NextResponse.json({ ok: true, ignored: event });
    }

    const data = body.data;
    if (!data) return NextResponse.json({ ok: true });

    // Skip messages sent by us (fromMe)
    if (data.key?.fromMe) return NextResponse.json({ ok: true });

    // Extract phone and text
    const remoteJid: string = data.key?.remoteJid ?? "";
    if (!remoteJid || remoteJid.includes("@g.us")) {
      // Skip group messages
      return NextResponse.json({ ok: true, ignored: "group" });
    }

    const rawPhone = remoteJid.replace("@s.whatsapp.net", "");
    const phone = normalizePhone(rawPhone);
    if (!phone) return NextResponse.json({ ok: true });

    // Extract message text
    const messageObj = data.message ?? {};
    const text: string =
      messageObj.conversation ??
      messageObj.extendedTextMessage?.text ??
      messageObj.listResponseMessage?.singleSelectReply?.selectedRowId ??
      messageObj.buttonsResponseMessage?.selectedButtonId ??
      "";

    if (!text.trim()) return NextResponse.json({ ok: true, ignored: "empty" });

    // Process asynchronously — respond 200 immediately to avoid Evolution API retries
    void handleIncomingMessage(phone, text).catch((err) =>
      console.error("[webhook] handleIncomingMessage error:", err)
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook] unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Evolution API sends GET to verify the webhook endpoint
export async function GET() {
  return NextResponse.json({ status: "Cristal Vidro WhatsApp Agent online" });
}
