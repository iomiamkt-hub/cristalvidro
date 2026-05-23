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

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/[0.05] ${className ?? ""}`} />;
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
  const monthValue = monthQuotes.reduce((s, q) => s + q.total, 0);

  const productCount: Record<string, number> = {};
  quotes.forEach((q) => { productCount[q.product] = (productCount[q.product] ?? 0) + 1; });
  const topProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: "Orçamentos este mês", value: String(monthQuotes.length), sub: "solicitações" },
    { label: "Valor estimado (mês)", value: formatCurrency(monthValue), sub: "em orçamentos" },
    { label: "Total recebido", value: String(quotes.length), sub: "orçamentos" },
    { label: "Produto líder", value: topProduct ? PRODUCT_LABELS[topProduct[0]] ?? topProduct[0] : "—", sub: topProduct ? `${topProduct[1]} pedidos` : "" },
  ];

  return (
    <div>
      <p className="text-[11px] text-white/25 uppercase tracking-[0.15em] mb-2">Visão geral</p>
      <h1 className="text-[1.75rem] font-semibold text-white tracking-tight mb-8">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col gap-3"
          >
            <p className="text-[10px] text-white/30 uppercase tracking-[0.13em] leading-none">{s.label}</p>
            {loading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-[1.5rem] font-semibold text-white tracking-tight tabular-nums leading-none">
                {s.value}
              </p>
            )}
            {s.sub && !loading && (
              <p className="text-[11px] text-white/20">{s.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent quotes */}
      <div>
        <p className="text-[11px] text-white/25 uppercase tracking-[0.15em] mb-4">Últimos orçamentos</p>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/[0.05]">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            ))}
          </div>
        ) : quotes.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] p-8 text-center">
            <p className="text-[13px] text-white/20">Nenhum orçamento recebido ainda.</p>
          </div>
        ) : (
          <div className="border-t border-white/[0.06]">
            {quotes.slice(0, 10).map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between py-4 border-b border-white/[0.05] gap-4"
              >
                <div className="min-w-0">
                  <p className="text-[13px] text-white font-medium truncate">{q.customer.name}</p>
                  <p className="text-[11px] text-white/35 mt-0.5">{PRODUCT_LABELS[q.product] ?? q.product}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[13px] text-white tabular-nums font-medium">{formatCurrency(q.total)}</p>
                  <p className="text-[11px] text-white/25 mt-0.5">
                    {new Date(q.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
