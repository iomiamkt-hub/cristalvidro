"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Conversation, ConversationMessage } from "@/services/conversations";

const STEP_LABEL: Record<string, string> = {
  GREETING: "Início",
  SELECTING_PRODUCT: "Produto",
  SELECTING_SUBTYPE: "Subtipo",
  COLLECTING_WIDTH: "Largura",
  COLLECTING_HEIGHT: "Altura",
  SELECTING_GLASS: "Vidro",
  SELECTING_THICKNESS: "Espessura",
  SELECTING_PROFILE: "Perfil",
  SELECTING_INSTALLATION: "Instalação",
  COLLECTING_QUANTITY: "Qtd.",
  SHOWING_QUOTE: "Orçamento",
  COLLECTING_NAME: "Nome",
  COLLECTING_EMAIL: "E-mail",
  QUOTE_SAVED: "Concluído ✓",
  FAQ: "FAQ",
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default function WhatsAppPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [simPhone, setSimPhone] = useState("");
  const [simMsg, setSimMsg] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/admin/whatsapp")
      .then((r) => r.json())
      .then((data) => { setConvs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleReset(id: string) {
    await fetch("/api/admin/whatsapp", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setConvs(convs.map((c) => c.id === id ? { ...c, step: "GREETING" as const, messages: [], context: {} } : c));
    if (selected?.id === id) setSelected(null);
  }

  async function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const res = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: simPhone, message: simMsg, simulate: true }),
    });
    if (res.ok) {
      setSimMsg("");
      // Refresh conversations
      const updated = await fetch("/api/admin/whatsapp").then((r) => r.json());
      if (Array.isArray(updated)) {
        setConvs(updated);
        const updatedSelected = updated.find((c: Conversation) => c.id === selected?.id || c.phone === simPhone);
        if (updatedSelected) setSelected(updatedSelected);
      }
    }
    setSending(false);
  }

  return (
    <div>
      <p className="text-[11px] text-white/20 uppercase tracking-[0.14em] mb-2">Agente IA</p>
      <h1 className="text-[1.8rem] font-medium text-white tracking-tight mb-8">WhatsApp</h1>

      <div className="flex gap-6 items-start">
        {/* Conversation list */}
        <div className="w-64 flex-shrink-0">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-3">Conversas</p>
          {loading ? (
            <p className="text-[12px] text-white/20">Carregando...</p>
          ) : convs.length === 0 ? (
            <p className="text-[12px] text-white/20">Nenhuma conversa ainda.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {convs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={cn(
                    "w-full text-left px-3 py-3 rounded-xl border transition-all",
                    selected?.id === c.id
                      ? "border-white/15 bg-white/[0.05]"
                      : "border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02]"
                  )}
                >
                  <p className="text-[13px] text-white font-medium truncate">
                    {c.customerName ?? c.phone}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/30 truncate">{STEP_LABEL[c.step] ?? c.step}</span>
                    <span className="text-[10px] text-white/15">·</span>
                    <span className="text-[10px] text-white/20">{relativeTime(c.updatedAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Simulate message */}
          <div className="mt-8 border-t border-white/[0.05] pt-6">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-3">Simular mensagem</p>
            <form onSubmit={handleSimulate} className="flex flex-col gap-3">
              <input
                value={simPhone}
                onChange={(e) => setSimPhone(e.target.value)}
                placeholder="5511999999999"
                className="w-full bg-transparent border-b border-white/[0.07] text-[13px] text-white placeholder:text-white/15 outline-none pb-1.5"
              />
              <input
                value={simMsg}
                onChange={(e) => setSimMsg(e.target.value)}
                placeholder="Mensagem do cliente..."
                className="w-full bg-transparent border-b border-white/[0.07] text-[13px] text-white placeholder:text-white/15 outline-none pb-1.5"
              />
              <button
                type="submit"
                disabled={sending || !simPhone || !simMsg}
                className="h-9 rounded-lg text-[12px] font-medium bg-white/[0.08] text-white/70 hover:bg-white/[0.12] disabled:opacity-30 transition-colors"
              >
                {sending ? "Enviando..." : "Simular"}
              </button>
            </form>
          </div>
        </div>

        {/* Chat view */}
        <div className="flex-1 min-w-0">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[15px] text-white font-medium">{selected.customerName ?? "—"}</p>
                  <p className="text-[12px] text-white/30 mt-0.5">{selected.phone}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="inline-block text-[10px] text-white/20 border border-white/[0.07] rounded-full px-2 py-0.5">
                      {STEP_LABEL[selected.step] ?? selected.step}
                    </span>
                    {selected.quoteId && (
                      <span className="inline-block text-[10px] text-emerald-400/60 border border-emerald-400/20 rounded-full px-2 py-0.5">
                        Orçamento salvo
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleReset(selected.id)}
                  className="text-[11px] text-white/20 hover:text-red-400/60 transition-colors"
                >
                  Reiniciar conversa
                </button>
              </div>

              {/* Context */}
              {Object.keys(selected.context).length > 0 && (
                <div className="mb-6 p-4 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-3">Contexto coletado</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(selected.context).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[10px] text-white/20 capitalize">{k}</p>
                        <p className="text-[12px] text-white/60">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex flex-col gap-3">
                {selected.messages.length === 0 ? (
                  <p className="text-[12px] text-white/20">Sem mensagens.</p>
                ) : (
                  selected.messages.map((m: ConversationMessage, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "max-w-[80%] px-4 py-3 rounded-2xl text-[13px] whitespace-pre-wrap leading-relaxed",
                        m.role === "user"
                          ? "self-end bg-white/[0.07] text-white/80"
                          : "self-start bg-white/[0.03] text-white/60 border border-white/[0.05]"
                      )}
                    >
                      {m.content}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-[13px] text-white/15">Selecione uma conversa</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
