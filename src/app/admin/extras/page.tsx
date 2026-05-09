"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { id: "box",          label: "Box de Banheiro" },
  { id: "sacada",       label: "Sacada de Vidro" },
  { id: "guarda-corpo", label: "Guarda-corpo" },
  { id: "espelho",      label: "Espelho" },
] as const;

const PROFILE_LABELS: Record<string, string> = {
  "sem-perfil": "Sem perfil", aluminio: "Alumínio", inox: "Inox escovado", "preto-fosco": "Preto fosco",
};

const INSTALL_LABELS: Record<string, string> = {
  parafuso: "Parafuso", embutido: "Embutido", frameless: "Frameless",
};

type ProductId = typeof PRODUCTS[number]["id"];
type Config = Record<string, {
  profilePrice: Record<string, number>;
  installationPrice: Record<string, number>;
  [key: string]: unknown;
}>;

export default function ExtrasPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [active, setActive] = useState<ProductId>("box");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config").then((r) => r.json()).then(setConfig);
  }, []);

  function updateProfile(key: string, value: string) {
    if (!config) return;
    const n = parseFloat(value);
    if (isNaN(n)) return;
    setConfig({ ...config, [active]: { ...config[active], profilePrice: { ...config[active].profilePrice, [key]: n } } });
    setSaved(false);
  }

  function updateInstall(key: string, value: string) {
    if (!config) return;
    const n = parseFloat(value);
    if (isNaN(n)) return;
    setConfig({ ...config, [active]: { ...config[active], installationPrice: { ...config[active].installationPrice, [key]: n } } });
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

  const Field = ({ label, value, onChange }: { label: string; value: number; onChange: (v: string) => void }) => (
    <div className="flex items-center justify-between gap-4">
      <label className="text-[13px] text-white/55 w-32 flex-shrink-0">{label}</label>
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-white/25 pointer-events-none">R$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step="10"
          min="0"
          className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg h-10 pl-8 pr-3 text-[13px] text-white font-medium outline-none text-right tabular-nums focus:border-white/20 transition-colors"
        />
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-[11px] text-white/20 uppercase tracking-[0.14em] mb-2">Configurações</p>
      <h1 className="text-[1.8rem] font-medium text-white tracking-tight mb-10">Acabamentos e instalação</h1>

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
          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-5">Perfil (adicionado ao total)</p>
            <div className="flex flex-col gap-5">
              {Object.entries(current?.profilePrice ?? {}).map(([key, val]) => (
                <Field key={key} label={PROFILE_LABELS[key] ?? key} value={val} onChange={(v) => updateProfile(key, v)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-5">Instalação (adicionado ao total)</p>
            <div className="flex flex-col gap-5">
              {Object.entries(current?.installationPrice ?? {}).map(([key, val]) => (
                <Field key={key} label={INSTALL_LABELS[key] ?? key} value={val} onChange={(v) => updateInstall(key, v)} />
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
