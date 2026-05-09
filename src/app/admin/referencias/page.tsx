"use client";

import { useEffect, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import type { StoredReference } from "@/lib/supabase/types";

const PRODUCTS = [
  { id: "box",          label: "Box" },
  { id: "sacada",       label: "Sacada" },
  { id: "guarda-corpo", label: "Guarda-corpo" },
  { id: "espelho",      label: "Espelho" },
];

export default function ReferenciasPage() {
  const [refs, setRefs] = useState<StoredReference[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", imageUrl: "", description: "", product: "box" });

  useEffect(() => {
    fetch("/api/admin/references")
      .then((r) => r.json())
      .then((data) => { setRefs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setAdding(true);
    const res = await fetch("/api/admin/references", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newRef = await res.json();
      setRefs([newRef, ...refs]);
      setForm({ title: "", imageUrl: "", description: "", product: "box" });
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/references", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRefs(refs.filter((r) => r.id !== id));
  }

  const Field = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div className="border-b border-white/[0.07] pb-1">
      <label className="block text-[10px] text-white/20 uppercase tracking-[0.14em] mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[14px] text-white placeholder:text-white/15 outline-none pb-1.5"
      />
    </div>
  );

  return (
    <div>
      <p className="text-[11px] text-white/20 uppercase tracking-[0.14em] mb-2">Portfólio</p>
      <h1 className="text-[1.8rem] font-medium text-white tracking-tight mb-10">Referências</h1>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex flex-col gap-5 mb-12 max-w-sm">
        <Field label="Título" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Projeto Vila Madalena" />
        <Field label="URL da imagem" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} placeholder="https://..." />
        <Field label="Descrição (opcional)" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Box frameless com vidro laminado..." />

        <div>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-3">Produto</p>
          <div className="flex gap-2 flex-wrap">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setForm({ ...form, product: p.id })}
                className={cn(
                  "h-8 px-3 rounded-lg text-[12px] font-medium transition-all duration-150",
                  form.product === p.id ? "bg-white text-zinc-950" : "text-white/30 border border-white/[0.07] hover:text-white/55"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={adding || !form.title || !form.imageUrl}
          className="w-full h-[52px] rounded-xl text-[14px] font-semibold bg-white text-zinc-950 hover:bg-zinc-100 transition-colors disabled:opacity-40"
        >
          {adding ? "Adicionando..." : "Adicionar referência"}
        </button>
      </form>

      {/* Grid */}
      {loading ? (
        <p className="text-[13px] text-white/20">Carregando...</p>
      ) : refs.length === 0 ? (
        <p className="text-[13px] text-white/20">Nenhuma referência cadastrada.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {refs.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/[0.06] overflow-hidden">
              {r.imageUrl && (
                <div className="aspect-[4/3] bg-white/[0.03] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div className="p-4">
                <p className="text-[13px] text-white font-medium truncate">{r.title}</p>
                {r.description && <p className="text-[11px] text-white/30 mt-1 line-clamp-2">{r.description}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-white/20 uppercase tracking-wider">{r.product}</span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-[11px] text-white/20 hover:text-red-400/70 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
