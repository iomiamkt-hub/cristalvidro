import { promises as fs } from "fs";
import path from "path";
import { PRICE_TABLES } from "@/lib/pricing";
import type { ProductType, PriceTable } from "@/lib/pricing";

const DATA = path.join(process.cwd(), "data");

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

async function readJSON<T>(file: string, fallback: T): Promise<T> {
  try {
    await fs.mkdir(DATA, { recursive: true });
    const raw = await fs.readFile(path.join(DATA, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJSON(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA, { recursive: true });
  const target = path.join(DATA, file);
  const tmp = target + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, target);
}

export async function getPriceTables(): Promise<Record<ProductType, PriceTable>> {
  return readJSON("pricing-config.json", PRICE_TABLES);
}

export async function savePriceTables(data: Record<ProductType, PriceTable>): Promise<void> {
  return writeJSON("pricing-config.json", data);
}

export async function getQuotes(): Promise<StoredQuote[]> {
  return readJSON("quotes.json", []);
}

export async function appendQuote(quote: StoredQuote): Promise<void> {
  const quotes = await getQuotes();
  quotes.unshift(quote);
  return writeJSON("quotes.json", quotes);
}

export async function getReferences(): Promise<StoredReference[]> {
  return readJSON("references.json", []);
}

export async function saveReferences(refs: StoredReference[]): Promise<void> {
  return writeJSON("references.json", refs);
}
