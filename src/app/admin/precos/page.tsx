"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: "box",          label: "Box de Banheiro" },
  { id: "sacada",       label: "Sacada de Vidro" },
  { id: "guarda-corpo", label: "Guarda-corpo" },
  { id: "espelho",      label: "Espelho" },
] as const;

type ProductId = typeof PRODUCTS[number]["id"];
type Config = Record<string, { basePerM2: number; minimumPrice: number; [key: string]: unknown }>;

export default function PrecosPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [active, setActive] = useState<ProductId>("box");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config").then((r) => r.json()).then(setConfig);
  }, []);

  function update(field: "basePerM2" | "minimumPrice", value: string) {
    if (!config) return;
    const n = parseFloat(value);
    if (isNaN(n)) return;
    setConfig({ ...config, [active]: { ...config[active], [field]: n } });
    setSaved(false);
  }

  async function save() {
    if (!config) return;
    setSaving(true);
    await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const current = config?.[active];

  return (
    <div>
      <p className="text-[11px] text-white/20 uppercase tracking-[0.14em] mb-2">Configurações</p>
      <h1 className="text-[1.8rem] font-medium text-white tracking-tight mb-10">Preços base</h1>

      {/* Product tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={cn(
              "h-8 px-4 rounded-lg text-[12px] font-medium tracking-tight transition-all duration-150",
              active === p.id
                ? "bg-white text-zinc-950"
                : "text-white/30 border border-white/[0.07] hover:text-white/55"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {!config ? (
        <p className="text-[13px] text-white/20">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-8 max-w-sm">
          <div className="border-b border-white/[0.07] pb-1">
            <label className="block text-[10px] text-white/20 uppercase tracking-[0.14em] mb-2.5">
              Preço base por m²
            </label>
            <div className="relative">
              <span className="absolute left-0 bottom-2.5 text-[13px] text-white/30 pointer-events-none">R$</span>
              <input
                type="number"
                value={current?.basePerM2 ?? ""}
                onChange={(e) => update("basePerM2", e.target.value)}
                className="w-full bg-transparent text-[1.8rem] font-medium text-white outline-none pb-2 pl-7 tracking-tight"
                step="10"
                min="0"
              />
            </div>
            <p className="text-[11px] text-white/20 mt-1">Calculado sobre a área em m²</p>
          </div>

          <div className="border-b border-white/[0.07] pb-1">
            <label className="block text-[10px] text-white/20 uppercase tracking-[0.14em] mb-2.5">
              Preço mínimo
            </label>
            <div className="relative">
              <span className="absolute left-0 bottom-2.5 text-[13px] text-white/30 pointer-events-none">R$</span>
              <input
                type="number"
                value={current?.minimumPrice ?? ""}
                onChange={(e) => update("minimumPrice", e.target.value)}
                className="w-full bg-transparent text-[1.8rem] font-medium text-white outline-none pb-2 pl-7 tracking-tight"
                step="10"
                min="0"
              />
            </div>
            <p className="text-[11px] text-white/20 mt-1">Valor mínimo cobrado mesmo para áreas pequenas</p>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full h-[52px] rounded-xl text-[14px] font-semibold bg-white text-zinc-950 hover:bg-zinc-100 transition-colors disabled:opacity-50"
          >
            {saving ? "Salvando..." : saved ? "Salvo ✓" : "Salvar alterações"}
          </button>
        </div>
      )}
    </div>
  );
}
