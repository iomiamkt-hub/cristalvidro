"use client";

import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import type { ProfileType, InstallationType } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const PROFILES: { id: ProfileType; label: string }[] = [
  { id: "sem-perfil",  label: "Sem perfil" },
  { id: "aluminio",    label: "Alumínio" },
  { id: "inox",        label: "Inox escovado" },
  { id: "preto-fosco", label: "Preto fosco" },
];

const INSTALLS: { value: InstallationType; label: string }[] = [
  { value: "parafuso",  label: "Parafuso" },
  { value: "embutido",  label: "Embutido" },
  { value: "frameless", label: "Frameless" },
];

export function StepExtras() {
  const { profile, installation, setProfile, setInstallation, nextStep } = useQuoteStore();

  async function handleInstall(v: InstallationType) {
    setInstallation(v);
    await new Promise((r) => setTimeout(r, 260));
    nextStep();
  }

  return (
    <div className="flex flex-col flex-1">
      <h1 className="text-[2.6rem] font-medium text-white leading-[1.08] tracking-tight mb-14">
        Acabamento
      </h1>

      {/* Profile list */}
      <div className="mb-14">
        {PROFILES.map((p) => (
          <button
            key={p.id}
            onClick={() => setProfile(p.id)}
            className={cn(
              "w-full text-left py-6 border-b border-white/[0.05]",
              "flex items-center justify-between group",
              "transition-all duration-200"
            )}
          >
            <span className={cn(
              "text-[1.5rem] font-medium tracking-tight transition-colors duration-200",
              profile === p.id ? "text-white" : "text-white/22 group-hover:text-white/55"
            )}>
              {p.label}
            </span>
            {profile === p.id && (
              <motion.div
                layoutId="profile-dot"
                className="w-[7px] h-[7px] rounded-full bg-white flex-shrink-0"
              />
            )}
          </button>
        ))}
      </div>

      {/* Installation — tap to advance */}
      <div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] mb-5">Instalação</p>
        <div className="flex gap-2.5">
          {INSTALLS.map((inst) => (
            <button
              key={inst.value}
              onClick={() => handleInstall(inst.value)}
              className={cn(
                "flex-1 h-11 rounded-xl text-[13px] font-medium tracking-tight",
                "transition-all duration-150",
                installation === inst.value
                  ? "bg-white text-zinc-950"
                  : "text-white/25 border border-white/[0.07] hover:text-white/45 hover:border-white/[0.14]"
              )}
            >
              {inst.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
