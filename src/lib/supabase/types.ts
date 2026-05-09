// ─── Domain types (shared across services and admin pages) ───────────────────

export interface StoredQuote {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; email: string };
  product: string;
  subtype: string | null;
  width: number;
  height: number;
  glassType: string;
  thickness: number;
  profile: string;
  installation: string;
  quantity: number;
  total: number;
}

export interface StoredReference {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  imageUrl: string;
  product: string;
}

// ─── Database schema (used for createClient<Database> type safety) ─────────

export interface Database {
  public: {
    Tables: {
      pricing_config: {
        Row: {
          product: string;
          base_per_m2: number;
          minimum_price: number;
          glass_multiplier: Record<string, number>;
          thickness_multiplier: Record<string, number>;
          profile_price: Record<string, number>;
          installation_price: Record<string, number>;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pricing_config"]["Row"], "updated_at"> & { updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["pricing_config"]["Insert"]>;
      };
      quotes: {
        Row: {
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
        };
        Insert: Omit<Database["public"]["Tables"]["quotes"]["Row"], "created_at"> & { created_at?: string };
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
      };
      project_references: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          image_url: string;
          product: string;
        };
        Insert: Omit<Database["public"]["Tables"]["project_references"]["Row"], "created_at" | "id"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["project_references"]["Insert"]>;
      };
    };
  };
}
