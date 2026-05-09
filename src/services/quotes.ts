import { createServerClient } from "@/lib/supabase/server";
import type { StoredQuote } from "@/lib/supabase/types";

function rowToQuote(row: {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  product: string;
  subtype: string | null;
  width: number;
  height: number;
  glass_type: string;
  thickness: number;
  profile: string;
  installation: string;
  quantity: number;
  total: number;
}): StoredQuote {
  return {
    id: row.id,
    createdAt: row.created_at,
    customer: { name: row.customer_name, phone: row.customer_phone, email: row.customer_email },
    product: row.product,
    subtype: row.subtype,
    width: row.width,
    height: row.height,
    glassType: row.glass_type,
    thickness: row.thickness,
    profile: row.profile,
    installation: row.installation,
    quantity: row.quantity,
    total: row.total,
  };
}

export async function getQuotes(): Promise<StoredQuote[]> {
  const db = createServerClient();
  const { data, error } = await db
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[quotes] getQuotes failed:", error.message);
    return [];
  }
  return (data ?? []).map(rowToQuote);
}

export async function getQuoteById(id: string): Promise<StoredQuote | null> {
  const db = createServerClient();
  const { data, error } = await db
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToQuote(data);
}

export async function insertQuote(quote: StoredQuote): Promise<{ id: string } | null> {
  const db = createServerClient();
  const { data, error } = await db
    .from("quotes")
    .insert({
      id: quote.id,
      customer_name: quote.customer.name,
      customer_phone: quote.customer.phone,
      customer_email: quote.customer.email ?? "",
      product: quote.product,
      subtype: quote.subtype,
      width: quote.width,
      height: quote.height,
      glass_type: quote.glassType,
      thickness: quote.thickness,
      profile: quote.profile,
      installation: quote.installation,
      quantity: quote.quantity,
      total: quote.total,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[quotes] insertQuote failed:", error.message);
    return null;
  }
  return { id: data.id };
}

export async function getQuoteStats(): Promise<{
  total: number;
  thisMonth: number;
  totalValue: number;
  monthValue: number;
}> {
  const db = createServerClient();
  const { data } = await db.from("quotes").select("created_at, total");

  const quotes = data ?? [];
  const now = new Date();

  const thisMonth = quotes.filter((q) => {
    const d = new Date(q.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  return {
    total: quotes.length,
    thisMonth: thisMonth.length,
    totalValue: quotes.reduce((s, q) => s + Number(q.total), 0),
    monthValue: thisMonth.reduce((s, q) => s + Number(q.total), 0),
  };
}
