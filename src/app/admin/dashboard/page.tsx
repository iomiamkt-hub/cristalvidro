"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { StoredQuote } from "@/lib/supabase/types";

const PRODUCT_LABELS: Record<string, string> = {
  box: "Box de Banheiro",
  sacada: "Sacada",
  "guarda-corpo": "Guarda-corpo",
  espelho: "Espelho",
};

function thisMonth(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export default function Dashboard() {
  const [quotes, setQuotes] = useState<StoredQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((data) => { setQuotes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const monthQuotes = quotes.filter((q) => thisMonth(q.createdAt));
  const totalValue = quotes.reduce((s, q) => s + q.total, 0);
  const monthValue = monthQuotes.reduce((s, q) => s + q.total, 0);

  const productCount: Record<string, number> = {};
  quotes.forEach((q) => { productCount[q.product] = (productCount[q.product] ?? 0) + 1; });
  const topProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: "Orçamentos este mês", value: String(monthQuotes.length) },
    { label: "Valor estimado (mês)", value: formatCurrency(monthValue) },
    { label: "Total recebido", value: String(quotes.length) },
    { label: "Produto líder", value: topProduct ? PRODUCT_LABELS[topProduct[0]] ?? topProduct[0] : "—" },
  ];

  return (
    <div>
      <p className="text-[11px] text-white/20 uppercase tracking-[0.14em] mb-2">Visão geral</p>
      <h1 className="text-[1.8rem] font-medium text-white tracking-tight mb-10">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.06] p-5 bg-white/[0.02]">
            <p className="text-[10px] text-white/25 uppercase tracking-[0.12em] mb-3">{s.label}</p>
            <p className="text-[1.4rem] font-medium text-white tracking-tight tabular-nums leading-none">
              {loading ? "—" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent quotes */}
      <div>
        <p className="text-[11px] text-white/20 uppercase tracking-[0.14em] mb-5">Últimos orçamentos</p>
        {loading ? (
          <p className="text-[13px] text-white/20">Carregando...</p>
        ) : quotes.length === 0 ? (
          <p className="text-[13px] text-white/20">Nenhum orçamento recebido ainda.</p>
        ) : (
          <div className="border-t border-white/[0.05]">
            {quotes.slice(0, 10).map((q) => (
              <div key={q.id} className="flex items-center justify-between py-4 border-b border-white/[0.04] gap-4">
                <div className="min-w-0">
                  <p className="text-[13px] text-white font-medium truncate">{q.customer.name}</p>
                  <p className="text-[11px] text-white/30">{PRODUCT_LABELS[q.product] ?? q.product}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[13px] text-white tabular-nums">{formatCurrency(q.total)}</p>
                  <p className="text-[11px] text-white/25">{new Date(q.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
