import { createServerClient } from "@/lib/supabase/server";
import type { StoredReference } from "@/lib/supabase/types";

function rowToRef(row: {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url: string;
  product: string;
}): StoredReference {
  return {
    id: row.id,
    createdAt: row.created_at,
    title: row.title,
    description: row.description ?? "",
    imageUrl: row.image_url,
    product: row.product,
  };
}

export async function getReferences(): Promise<StoredReference[]> {
  const db = createServerClient();
  const { data, error } = await db
    .from("project_references")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[references] getReferences failed:", error.message);
    return [];
  }
  return (data ?? []).map(rowToRef);
}

export async function addReference(
  ref: Omit<StoredReference, "id" | "createdAt">
): Promise<StoredReference | null> {
  const db = createServerClient();
  const { data, error } = await db
    .from("project_references")
    .insert({
      title: ref.title,
      description: ref.description,
      image_url: ref.imageUrl,
      product: ref.product,
    })
    .select()
    .single();

  if (error) {
    console.error("[references] addReference failed:", error.message);
    return null;
  }
  return rowToRef(data);
}

export async function deleteReference(id: string): Promise<boolean> {
  const db = createServerClient();
  const { error } = await db
    .from("project_references")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[references] deleteReference failed:", error.message);
    return false;
  }
  return true;
}
