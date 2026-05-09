const SECRET = process.env.ADMIN_SECRET ?? "cristalvidro-dev-secret-change-in-prod";
const SESSION_DATA = "cv_admin_session_v1";

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signSession(): Promise<string> {
  return hmac(SESSION_DATA, SECRET);
}

export async function verifySession(token: string): Promise<boolean> {
  const expected = await signSession();
  return token === expected;
}

export function checkPassword(submitted: string): boolean {
  const required = process.env.ADMIN_PASSWORD ?? "admin123";
  return submitted === required;
}

export const SESSION_COOKIE = "cv_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
