/**
 * Evolution API client for sending WhatsApp messages.
 * Docs: https://doc.evolution-api.com
 *
 * Set env vars:
 *   EVOLUTION_API_URL   e.g. https://evo.suaempresa.com.br
 *   EVOLUTION_API_KEY   global API key
 *   EVOLUTION_INSTANCE  instance name (e.g. "cristalvidro")
 */

const BASE_URL = process.env.EVOLUTION_API_URL?.replace(/\/$/, "") ?? "";
const API_KEY  = process.env.EVOLUTION_API_KEY ?? "";
const INSTANCE = process.env.EVOLUTION_INSTANCE ?? "cristalvidro";

function headers() {
  return { "Content-Type": "application/json", apikey: API_KEY };
}

/** Normalize phone to E.164 digits only (no +), e.g. "5511999999999" */
export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

export async function sendText(to: string, text: string): Promise<void> {
  if (!BASE_URL || !API_KEY) {
    console.warn("[whatsapp] EVOLUTION_API_URL or EVOLUTION_API_KEY not set — message not sent.");
    return;
  }
  const phone = normalizePhone(to);
  const url = `${BASE_URL}/message/sendText/${INSTANCE}`;
  const body = { number: phone, text };
  const res = await fetch(url, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) {
    const msg = await res.text().catch(() => String(res.status));
    throw new Error(`[whatsapp] sendText failed: ${msg}`);
  }
}

export async function sendList(
  to: string,
  title: string,
  description: string,
  buttonLabel: string,
  sections: { title: string; rows: { title: string; description?: string; rowId: string }[] }[]
): Promise<void> {
  if (!BASE_URL || !API_KEY) {
    console.warn("[whatsapp] Evolution API not configured — list not sent.");
    return;
  }
  const phone = normalizePhone(to);
  const url = `${BASE_URL}/message/sendList/${INSTANCE}`;
  const body = {
    number: phone,
    title,
    description,
    buttonText: buttonLabel,
    footerText: "Cristal Vidro",
    sections,
  };
  const res = await fetch(url, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  if (!res.ok) console.warn("[whatsapp] sendList failed:", await res.text().catch(() => ""));
}
