"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: "box",          label: "Box de Banheiro" },
  { id: "sacada",       label: "Sacada de Vidro" },
  { id: "guarda-corpo", label: "Guarda-corpo" },
  { id: "espelho",      label: "Espelho" },
] as const;

const GLASS_LABELS: Record<string, string> = {
  temperado: "Temperado", laminado: "Laminado", jateado: "Jateado", espelhado: "Espelhado",
};

const THICKNESS_LABELS: Record<string, string> = {
  "6": "6 mm", "8": "8 mm", "10": "10 mm", "12": "12 mm",
};

type ProductId = typeof PRODUCTS[number]["id"];
type Config = Record<string, {
  glassMultiplier: Record<string, number>;
  thicknessMultiplier: Record<string, number>;
  [key: string]: unknown;
}>;

export default function VidrosPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [active, setActive] = useState<ProductId>("box");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config").then((r) => r.json()).then(setConfig);
  }, []);

  function updateGlass(key: string, value: string) {
    if (!config) return;
    const n = parseFloat(value);
    if (isNaN(n)) return;
    setConfig({
      ...config,
      [active]: {
        ...config[active],
        glassMultiplier: { ...config[active].glassMultiplier, [key]: n },
      },
    });
    setSaved(false);
  }

  function updateThickness(key: string, value: string) {
    if (!config) return;
    const n = parseFloat(value);
    if (isNaN(n)) return;
    setConfig({
      ...config,
      [active]: {
        ...config[active],
        thicknessMultiplier: { ...config[active].thicknessMultiplier, [key]: n },
      },
    });
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
      <h1 className="text-[1.8rem] font-medium text-white tracking-tight mb-10">Tipos de vidro</h1>

      <div className="flex flex-wrap gap-2 mb-10">
        {PRODUCTS.map((p) => (
          <button key={p.id} onClick={() => setActive(p.id)}
            className={cn("h-8 px-4 rounded-lg text-[12px] font-medium tracking-tight transition-all duration-150",
              active === p.id ? "bg-white text-zinc-950" : "text-white/30 border border-white/[0.07] hover:text-white/55"
            )}>
            {p.label}
          </button>
        ))}
      </div>

      {!config ? (
        <p className="text-[13px] text-white/20">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-10 max-w-sm">
          {/* Glass multipliers */}
          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-5">
              Multiplicadores por tipo de vidro
            </p>
            <p className="text-[11px] text-white/20 mb-6">1.0 = preço base, 1.35 = +35%</p>
            <div className="flex flex-col gap-5">
              {Object.entries(current?.glassMultiplier ?? {}).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <label className="text-[13px] text-white/55 w-28 flex-shrink-0">{GLASS_LABELS[key] ?? key}</label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => updateGlass(key, e.target.value)}
                    step="0.05"
                    min="0"
                    className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-lg h-10 px-3 text-[13px] text-white font-medium outline-none text-right tabular-nums focus:border-white/20 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thickness multipliers */}
          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-5">Multiplicadores por espessura</p>
            <div className="flex flex-col gap-5">
              {Object.entries(current?.thicknessMultiplier ?? {}).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <label className="text-[13px] text-white/55 w-28 flex-shrink-0">{THICKNESS_LABELS[key] ?? key}</label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => updateThickness(key, e.target.value)}
                    step="0.05"
                    min="0"
                    className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-lg h-10 px-3 text-[13px] text-white font-medium outline-none text-right tabular-nums focus:border-white/20 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <button onClick={save} disabled={saving}
            className="w-full h-[52px] rounded-xl text-[14px] font-semibold bg-white text-zinc-950 hover:bg-zinc-100 transition-colors disabled:opacity-50">
            {saving ? "Salvando..." : saved ? "Salvo ✓" : "Salvar alterações"}
          </button>
        </div>
      )}
    </div>
  );
}
