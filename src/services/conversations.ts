import { createServerClient } from "@/lib/supabase/server";

export type ConversationStep =
  | "GREETING"
  | "SELECTING_PRODUCT"
  | "SELECTING_SUBTYPE"
  | "COLLECTING_WIDTH"
  | "COLLECTING_HEIGHT"
  | "SELECTING_GLASS"
  | "SELECTING_THICKNESS"
  | "SELECTING_PROFILE"
  | "SELECTING_INSTALLATION"
  | "COLLECTING_QUANTITY"
  | "SHOWING_QUOTE"
  | "COLLECTING_NAME"
  | "COLLECTING_EMAIL"
  | "QUOTE_SAVED"
  | "FAQ";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  ts: string;
}

export interface ConversationContext {
  product?: string;
  subtype?: string;
  width?: number;
  height?: number;
  glassType?: string;
  thickness?: number;
  profile?: string;
  installation?: string;
  quantity?: number;
  customerName?: string;
  customerEmail?: string;
}

export interface Conversation {
  id: string;
  phone: string;
  customerName: string | null;
  step: ConversationStep;
  context: ConversationContext;
  messages: ConversationMessage[];
  quoteId: string | null;
  createdAt: string;
  updatedAt: string;
}

type ConvRow = {
  id: string;
  phone: string;
  customer_name: string | null;
  step: string;
  context: ConversationContext;
  messages: ConversationMessage[];
  quote_id: string | null;
  created_at: string;
  updated_at: string;
};

function rowToConv(row: ConvRow): Conversation {
  return {
    id: row.id,
    phone: row.phone,
    customerName: row.customer_name,
    step: row.step as ConversationStep,
    context: row.context ?? {},
    messages: row.messages ?? [],
    quoteId: row.quote_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getOrCreateConversation(phone: string): Promise<Conversation> {
  const db = createServerClient();
  const { data } = await db
    .from("whatsapp_conversations")
    .select("*")
    .eq("phone", phone)
    .single();

  if (data) return rowToConv(data as unknown as ConvRow);

  const { data: created, error } = await db
    .from("whatsapp_conversations")
    .insert({ phone, step: "GREETING", context: {}, messages: [] })
    .select()
    .single();

  if (error || !created) throw new Error(`[conversations] create failed: ${error?.message}`);
  return rowToConv(created as unknown as ConvRow);
}

export async function updateConversation(
  id: string,
  patch: Partial<{
    step: ConversationStep;
    context: ConversationContext;
    messages: ConversationMessage[];
    customerName: string;
    quoteId: string;
  }>
): Promise<void> {
  const db = createServerClient();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.step !== undefined)        update.step          = patch.step;
  if (patch.context !== undefined)     update.context       = patch.context;
  if (patch.messages !== undefined)    update.messages      = patch.messages;
  if (patch.customerName !== undefined) update.customer_name = patch.customerName;
  if (patch.quoteId !== undefined)     update.quote_id      = patch.quoteId;

  const { error } = await db.from("whatsapp_conversations").update(update).eq("id", id);
  if (error) throw new Error(`[conversations] update failed: ${error.message}`);
}

export async function listConversations(): Promise<Conversation[]> {
  const db = createServerClient();
  const { data, error } = await db
    .from("whatsapp_conversations")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(`[conversations] list failed: ${error.message}`);
  return ((data ?? []) as unknown as ConvRow[]).map(rowToConv);
}

export async function resetConversation(id: string): Promise<void> {
  const db = createServerClient();
  await db
    .from("whatsapp_conversations")
    .update({ step: "GREETING", context: {}, messages: [], quote_id: null, updated_at: new Date().toISOString() })
    .eq("id", id);
}
