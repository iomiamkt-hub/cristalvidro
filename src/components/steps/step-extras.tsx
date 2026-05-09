"use client";

import { useQuoteStore } from "@/store/quote-store";
import type { ProfileType, InstallationType } from "@/lib/pricing";
import { SelectRow } from "@/components/ui/select-row";
import { ChipGroup } from "@/components/ui/chip-group";
import { StepHeading } from "@/components/ui/step-heading";
import { StepActions } from "@/components/ui/step-actions";

const PROFILES: { id: ProfileType; label: string; sublabel: string }[] = [
  { id: "sem-perfil",  label: "Sem perfil",       sublabel: "Fixação direta" },
  { id: "aluminio",    label: "Alumínio",          sublabel: "Resistente e econômico" },
  { id: "inox",        label: "Inox escovado",     sublabel: "Alta durabilidade" },
  { id: "preto-fosco", label: "Preto fosco",       sublabel: "Design contemporâneo" },
];

const INSTALLS: { value: InstallationType; label: string }[] = [
  { value: "parafuso",  label: "Parafuso" },
  { value: "embutido",  label: "Embutido" },
  { value: "frameless", label: "Frameless" },
];

export function StepExtras() {
  const { profile, installation, setProfile, setInstallation, nextStep, prevStep } = useQuoteStore();

  return (
    <div className="flex flex-col flex-1">
      <StepHeading>Acabamento</StepHeading>

      <div className="mb-10">
        {PROFILES.map((p, i) => (
          <SelectRow
            key={p.id}
            label={p.label}
            sublabel={p.sublabel}
            selected={profile === p.id}
            onClick={() => setProfile(p.id)}
            index={i}
          />
        ))}
      </div>

      <ChipGroup
        label="Instalação"
        options={INSTALLS}
        value={installation}
        onChange={setInstallation}
      />

      <StepActions onNext={nextStep} onBack={prevStep} nextLabel="Ver orçamento" />
    </div>
  );
}
