"use client";

import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import type { ProfileType, InstallationType } from "@/lib/pricing";
import { OptionCard } from "@/components/ui/option-card";
import { Button } from "@/components/ui/button";

const PROFILE_OPTIONS: { id: ProfileType; title: string; description: string; badge?: string; recommended?: boolean }[] = [
  { id: "sem-perfil", title: "Sem perfil", description: "Fixação direta — look minimalista" },
  { id: "aluminio", title: "Alumínio anodizado", description: "Resistente, econômico e elegante", badge: "Econômico" },
  {
    id: "inox",
    title: "Inox escovado",
    description: "Acabamento de alta qualidade, duradouro",
    badge: "Premium",
    recommended: true,
  },
  { id: "preto-fosco", title: "Preto fosco", description: "Estilo industrial e contemporâneo", badge: "Tendência" },
];

const INSTALL_OPTIONS: { id: InstallationType; title: string; description: string; badge?: string; recommended?: boolean }[] = [
  { id: "parafuso", title: "Parafuso aparente", description: "Clássico e seguro. Mais acessível" },
  {
    id: "embutido",
    title: "Parafuso embutido",
    description: "Visual limpo, sem elementos expostos",
    recommended: true,
  },
  {
    id: "frameless",
    title: "Frameless",
    description: "Sem perfis ou parafusos visíveis. Máximo luxo",
    badge: "Top",
  },
];

export function StepExtras() {
  const { profile, installation, setProfile, setInstallation, nextStep, prevStep } = useQuoteStore();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-white tracking-tight">Acabamento</h2>
        <p className="text-zinc-500 text-sm mt-1">Personalize o perfil e o tipo de instalação</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-5"
      >
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Perfil / Moldura
          </p>
          <div className="space-y-2">
            {PROFILE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.id}
                selected={profile === opt.id}
                onClick={() => setProfile(opt.id)}
                title={opt.title}
                description={opt.description}
                badge={opt.badge}
                recommended={opt.recommended}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Sistema de instalação
          </p>
          <div className="space-y-2">
            {INSTALL_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.id}
                selected={installation === opt.id}
                onClick={() => setInstallation(opt.id)}
                title={opt.title}
                description={opt.description}
                badge={opt.badge}
                recommended={opt.recommended}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={prevStep} className="flex-1">
          Voltar
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Ver orçamento
        </Button>
      </div>
    </div>
  );
}
