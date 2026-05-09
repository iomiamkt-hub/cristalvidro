"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import { calculateQuote, PRODUCT_SUBTYPES } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { StepHeading } from "@/components/ui/step-heading";
import { StepActions } from "@/components/ui/step-actions";
import { cn } from "@/lib/utils";

const PRODUCT_LABELS: Record<string, string> = {
  box: "Box de Banheiro",
  sacada: "Sacada",
  "guarda-corpo": "Guarda-corpo",
  espelho: "Espelho",
};

function FieldInput({
  label, type, value, onChange, placeholder, autoComplete, error,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  autoComplete?: string; error?: string;
}) {
  return (
    <div className="border-b border-white/[0.07] pb-1 mb-1">
      <label className="block text-[10px] text-white/20 uppercase tracking-[0.14em] mb-2.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full bg-transparent text-[15px] font-medium text-white placeholder:text-white/15",
          "outline-none pb-2 transition-colors duration-150",
          error ? "placeholder:text-red-900/50" : ""
        )}
      />
      {error && <p className="text-[10px] text-red-400/70 pb-1">{error}</p>}
    </div>
  );
}

export function StepContact() {
  const { product, subtype, width, height, glassType, thickness, profile, installation, quantity, customerName, customerPhone, customerEmail, setCustomer, prevStep, reset } =
    useQuoteStore();

  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [email, setEmail] = useState(customerEmail);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function formatPhone(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 3) e.name = "Nome obrigatório";
    if (phone.replace(/\D/g, "").length < 10) e.phone = "WhatsApp inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setCustomer(name, phone, email);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  if (!product) return null;
  const result = calculateQuote({ product, subtype: subtype ?? undefined, width, height, glassType, thickness, profile, installation, quantity });
  const subtypeLabel = subtype ? PRODUCT_SUBTYPES[product].find((o) => o.id === subtype)?.title : null;

  const whatsappText = [
    `Olá! Acabei de fazer um orçamento:`,
    ``,
    `*Produto:* ${PRODUCT_LABELS[product]}${subtypeLabel ? ` — ${subtypeLabel}` : ""}`,
    `*Medidas:* ${width}×${height}cm · ${quantity} peça(s)`,
    `*Vidro:* ${glassType} ${thickness}mm · ${profile} · ${installation}`,
    `*Estimativa:* ${formatCurrency(result.total)}`,
    ``,
    `Pode confirmar?`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappText)}`;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col flex-1 items-center justify-center text-center gap-8"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 22 }}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-[1.75rem] font-medium text-white tracking-tight">Enviado</h2>
          <p className="text-[13px] text-white/30 leading-relaxed">
            Responderemos em até 2 horas pelo WhatsApp.
          </p>
        </div>

        <div className="w-full text-left border-t border-white/[0.06] pt-6 space-y-1">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.16em]">Estimativa</p>
          <p className="text-[2.4rem] font-medium text-white tabular-nums tracking-tight leading-none">
            {formatCurrency(result.total)}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2.5 mt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[52px] rounded-xl bg-[#25D366] text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#1db954] transition-colors tracking-wide"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </a>
          <button
            onClick={reset}
            className="w-full h-10 text-[12px] text-white/20 hover:text-white/40 transition-colors"
          >
            Novo orçamento
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <StepHeading>Quase lá</StepHeading>
      <p className="text-[13px] text-white/30 -mt-7 mb-10 leading-relaxed">
        Enviaremos o orçamento pelo WhatsApp.
      </p>

      <div className="space-y-6 flex-1">
        <FieldInput
          label="Nome"
          type="text"
          value={name}
          onChange={(v) => { setName(v); setErrors({}); }}
          placeholder="João Silva"
          autoComplete="name"
          error={errors.name}
        />
        <FieldInput
          label="WhatsApp"
          type="tel"
          value={phone}
          onChange={(v) => { setPhone(formatPhone(v)); setErrors({}); }}
          placeholder="(11) 99999-9999"
          autoComplete="tel"
          error={errors.phone}
        />
        <FieldInput
          label="E-mail (opcional)"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="joao@email.com"
          autoComplete="email"
        />
      </div>

      <StepActions
        onNext={handleSubmit}
        onBack={prevStep}
        nextLabel="Receber orçamento"
        loading={loading}
      />
    </div>
  );
}
