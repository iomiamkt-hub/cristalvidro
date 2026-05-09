"use client";

import { useQuoteStore } from "@/store/quote-store";
import type { GlassType, ThicknessOption } from "@/lib/pricing";
import { SelectRow } from "@/components/ui/select-row";
import { ChipGroup } from "@/components/ui/chip-group";
import { StepHeading } from "@/components/ui/step-heading";
import { StepActions } from "@/components/ui/step-actions";

const GLASS: { id: GlassType; label: string; badge: string }[] = [
  { id: "temperado", label: "Temperado",  badge: "padrão" },
  { id: "laminado",  label: "Laminado",   badge: "+35%" },
  { id: "jateado",   label: "Jateado",    badge: "+25%" },
  { id: "espelhado", label: "Espelhado",  badge: "+40%" },
];

const THICKNESS: { value: ThicknessOption; label: string }[] = [
  { value: 6,  label: "6 mm" },
  { value: 8,  label: "8 mm" },
  { value: 10, label: "10 mm" },
  { value: 12, label: "12 mm" },
];

export function StepGlass() {
  const { glassType, thickness, setGlassType, setThickness, nextStep, prevStep } = useQuoteStore();

  return (
    <div className="flex flex-col flex-1">
      <StepHeading>Tipo de vidro</StepHeading>

      <div className="mb-8">
        {GLASS.map((g, i) => (
          <SelectRow
            key={g.id}
            label={g.label}
            badge={g.badge}
            selected={glassType === g.id}
            onClick={() => setGlassType(g.id)}
            index={i}
          />
        ))}
      </div>

      <ChipGroup
        label="Espessura"
        options={THICKNESS}
        value={thickness}
        onChange={setThickness}
      />

      <StepActions onNext={nextStep} onBack={prevStep} />
    </div>
  );
}
