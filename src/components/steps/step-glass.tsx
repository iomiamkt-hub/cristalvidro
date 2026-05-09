"use client";

import { useQuoteStore } from "@/store/quote-store";
import type { GlassType, ThicknessOption } from "@/lib/pricing";
import { SelectRow } from "@/components/ui/select-row";
import { ChipGroup } from "@/components/ui/chip-group";
import { StepHeading } from "@/components/ui/step-heading";
import { StepActions } from "@/components/ui/step-actions";

const GLASS: { id: GlassType; label: string; sublabel: string }[] = [
  { id: "temperado", label: "Temperado",  sublabel: "Padrão de segurança" },
  { id: "laminado",  label: "Laminado",   sublabel: "Fragmentos retidos" },
  { id: "jateado",   label: "Jateado",    sublabel: "Translúcido fosco" },
  { id: "espelhado", label: "Espelhado",  sublabel: "Reflexo parcial" },
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

      <div className="mb-10">
        {GLASS.map((g, i) => (
          <SelectRow
            key={g.id}
            label={g.label}
            sublabel={g.sublabel}
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
