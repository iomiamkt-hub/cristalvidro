"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { StoredQuote } from "@/lib/server/storage";

const PRODUCT_LABELS: Record<string, string> = {
  box: "Box de Banheiro", sacada: "Sacada", "guarda-corpo": "Guarda-corpo", espelho: "Espelho",
};

export default function OrcamentosPage() {
  const [quotes, setQuotes] = useState<StoredQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((data) => { setQuotes(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function whatsappUrl(q: StoredQuote) {
    const text = [
      `Olá ${q.customer.name}! Aqui é da Cristal Vidro.`,
      ``,
      `Recebi seu orçamento para *${PRODUCT_LABELS[q.product] ?? q.product}* no valor estimado de *${formatCurrency(q.total)}*.`,
      `Podemos agendar uma vistoria gratuita?`,
    ].join("\n");
    const phone = q.customer.phone.replace(/\D/g, "");
    return `https://wa.me/55${phone}?text=${encodeURIComponent(text)}`;
  }

  return (
    <div>
      <p className="text-[11px] text-white/20 uppercase tracking-[0.14em] mb-2">Solicitações</p>
      <h1 className="text-[1.8rem] font-medium text-white tracking-tight mb-10">Orçamentos</h1>

      {loading ? (
        <p className="text-[13px] text-white/20">Carregando...</p>
      ) : quotes.length === 0 ? (
        <p className="text-[13px] text-white/20">Nenhum orçamento recebido ainda.</p>
      ) : (
        <div className="border-t border-white/[0.05]">
          {quotes.map((q) => (
            <div key={q.id} className="py-5 border-b border-white/[0.04]">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-[14px] text-white font-medium">{q.customer.name}</p>
                  <p className="text-[12px] text-white/35 mt-0.5">{q.customer.phone}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[14px] text-white tabular-nums font-medium">{formatCurrency(q.total)}</p>
                  <p className="text-[11px] text-white/25 mt-0.5">
                    {new Date(q.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span className="text-[11px] text-white/30">{PRODUCT_LABELS[q.product] ?? q.product}</span>
                  <span className="text-[11px] text-white/18">·</span>
                  <span className="text-[11px] text-white/30">{q.width}×{q.height} cm</span>
                  <span className="text-[11px] text-white/18">·</span>
                  <span className="text-[11px] text-white/30">{q.glassType} {q.thickness}mm</span>
                  {q.quantity > 1 && <><span className="text-[11px] text-white/18">·</span><span className="text-[11px] text-white/30">{q.quantity} peças</span></>}
                </div>
                <a
                  href={whatsappUrl(q)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-[11px] text-emerald-400/70 hover:text-emerald-400 transition-colors font-medium"
                >
                  WhatsApp ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
