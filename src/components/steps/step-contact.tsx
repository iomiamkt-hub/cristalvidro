"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuoteStore } from "@/store/quote-store";
import { calculateQuote } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function StepContact() {
  const store = useQuoteStore();
  const { product, width, height, glassType, thickness, profile, installation, quantity, customerName, customerPhone, customerEmail, setCustomer, prevStep, reset } = store;

  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [email, setEmail] = useState(customerEmail);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) e.name = "Nome completo obrigatório";
    if (!phone.replace(/\D/g, "") || phone.replace(/\D/g, "").length < 10) e.phone = "WhatsApp inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function formatPhone(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return v;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setCustomer(name, phone, email);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  }

  if (!product) return null;
  const result = calculateQuote({ product, width, height, glassType, thickness, profile, installation, quantity });

  if (submitted) {
    const whatsappMessage = encodeURIComponent(
      `Olá! Fiz um orçamento pelo site:\n\n*Produto:* ${product}\n*Dimensões:* ${width}×${height}cm\n*Vidro:* ${glassType} ${thickness}mm\n*Perfil:* ${profile}\n*Instalação:* ${installation}\n*Quantidade:* ${quantity}\n*Total estimado:* ${formatCurrency(result.total)}\n\nPoderia confirmar?`
    );
    const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center text-center gap-6 py-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-zinc-900 text-2xl"
        >
          ✓
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-white">Orçamento enviado!</h2>
          <p className="text-zinc-500 text-sm mt-2 leading-relaxed max-w-xs">
            Recebemos sua solicitação. Nossa equipe entrará em contato em até 2 horas úteis.
          </p>
        </div>

        <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1">
          <p className="text-zinc-500 text-xs">Total estimado</p>
          <p className="text-white text-2xl font-bold">{formatCurrency(result.total)}</p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-2xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20b957] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </a>
          <Button variant="ghost" onClick={reset} className="w-full">
            Fazer novo orçamento
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold text-white tracking-tight">Quase lá!</h2>
        <p className="text-zinc-500 text-sm mt-1">Preencha seus dados para receber o orçamento oficial</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-4"
      >
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
          <span className="text-zinc-500 text-sm">Seu orçamento estimado</span>
          <span className="text-white font-bold text-lg">{formatCurrency(result.total)}</span>
        </div>

        <Input
          label="Seu nome"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors({}); }}
          placeholder="João Silva"
          error={errors.name}
          autoComplete="name"
        />
        <Input
          label="WhatsApp"
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(formatPhone(e.target.value)); setErrors({}); }}
          placeholder="(11) 99999-9999"
          error={errors.phone}
          autoComplete="tel"
        />
        <Input
          label="E-mail (opcional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="joao@email.com"
          autoComplete="email"
        />

        <p className="text-xs text-zinc-600 leading-relaxed">
          Seus dados são usados apenas para envio do orçamento. Não enviamos spam.
        </p>
      </motion.div>

      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={prevStep} className="flex-1">
          Voltar
        </Button>
        <Button onClick={handleSubmit} loading={loading} className="flex-1">
          Enviar orçamento
        </Button>
      </div>
    </div>
  );
}
