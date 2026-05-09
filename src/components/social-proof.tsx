"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Mariana Costa",
    role: "Arquiteta",
    avatar: "MC",
    rating: 5,
    text: "Orçamento na hora, instalação impecável. O box frameless ficou exatamente como eu havia projetado. Recomendo sem hesitar.",
  },
  {
    name: "Rafael Souza",
    role: "Proprietário de imóvel",
    avatar: "RS",
    rating: 5,
    text: "Fechei a sacada inteira em vidro laminado. O resultado valorizou muito o apartamento. Atendimento rápido e preço justo.",
  },
  {
    name: "Camila Andrade",
    role: "Designer de interiores",
    avatar: "CA",
    rating: 5,
    text: "Uso a Cristal Vidro em todos os meus projetos. Qualidade consistente, prazo cumprido e o sistema de orçamento online facilita muito.",
  },
];

const TRUST_SEALS = [
  { icon: "🏅", label: "ABNT NBR 7199", description: "Vidros certificados" },
  { icon: "🛡️", label: "Garantia 1 ano", description: "Em todos os serviços" },
  { icon: "📋", label: "Nota Fiscal", description: "100% legal e documentado" },
  { icon: "🔧", label: "Técnicos próprios", description: "Sem terceirizados" },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export function SocialProof() {
  return (
    <section className="px-4 py-16 border-t border-white/5">
      <div className="max-w-lg mx-auto space-y-10">
        {/* Selos de confiança */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {TRUST_SEALS.map((seal) => (
            <motion.div
              key={seal.label}
              variants={itemVariants}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl border border-white/8 bg-white/[0.02]"
            >
              <span className="text-2xl">{seal.icon}</span>
              <div>
                <p className="text-white font-semibold text-xs">{seal.label}</p>
                <p className="text-zinc-600 text-[11px] mt-0.5">{seal.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Depoimentos */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45 }}
            className="flex items-center justify-between mb-5"
          >
            <h2 className="text-lg font-bold text-white tracking-tight">O que dizem nossos clientes</h2>
            <div className="flex items-center gap-1.5">
              <Stars count={5} />
              <span className="text-zinc-500 text-xs">4.9 (128)</span>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="space-y-3"
          >
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                variants={itemVariants}
                className="p-4 rounded-2xl border border-white/8 bg-white/[0.02]"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold text-zinc-300 flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div>
                        <p className="text-white font-semibold text-sm leading-none">{t.name}</p>
                        <p className="text-zinc-600 text-xs mt-0.5">{t.role}</p>
                      </div>
                      <Stars count={t.rating} />
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed mt-2">{t.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative rounded-2xl border border-white/10 overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 80% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)" }}
          />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-5">
            <div>
              <p className="text-white font-bold text-sm">Pronto para começar?</p>
              <p className="text-zinc-500 text-xs mt-0.5">Orçamento gratuito, sem compromisso</p>
            </div>
            <a
              href="#orcamento"
              className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              Fazer orçamento
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
