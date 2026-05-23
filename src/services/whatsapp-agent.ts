import Anthropic from "@anthropic-ai/sdk";
import {
  getOrCreateConversation,
  updateConversation,
  type Conversation,
  type ConversationStep,
  type ConversationContext,
  type ConversationMessage,
} from "@/services/conversations";
import { sendText } from "@/lib/whatsapp-client";
import { calculateQuote, PRICE_TABLES, PRODUCT_SUBTYPES } from "@/lib/pricing";
import type { ProductType, GlassType, ThicknessOption, ProfileType, InstallationType } from "@/lib/pricing";
import { insertQuote } from "@/services/quotes";
import { getPriceTables } from "@/services/pricing";
import { formatCurrency } from "@/lib/utils";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Você é a Sofia, assistente virtual da Cristal Vidro, empresa especializada em box de banheiro, fechamento de sacada, guarda-corpo e espelhos sob medida.

PERSONALIDADE:
- Simpática, direta e profissional
- Usa português brasileiro informal mas educado
- Responde de forma concisa (máximo 3 frases por mensagem)
- Usa emojis com moderação (1-2 por mensagem)

PRODUTOS QUE VENDEMOS:
1. Box de Banheiro (abrir, correr, canto, banheira)
2. Fechamento de Sacada (reta, canto 90°, canto 135°, curva)
3. Guarda-corpo (escada, mezanino, varanda, piscina)
4. Espelho (simples, bisotê, lapidado, decorativo)

TIPOS DE VIDRO: temperado, laminado, jateado, espelhado
ESPESSURAS: 6mm, 8mm, 10mm, 12mm
PERFIS: sem perfil, alumínio, inox, preto fosco
INSTALAÇÃO: parafuso, embutido, frameless

REGRAS IMPORTANTES:
- Colete as informações na ordem correta para calcular o orçamento
- Quando o cliente fornecer medidas, confirme em metros (ex: 1,20m × 2,10m)
- Preço mínimo por produto: box R$890, sacada R$1.200, guarda-corpo R$1.100, espelho R$550
- Não invente preços — use apenas os calculados pelo sistema
- Se não souber algo, diga "deixa eu verificar com nossa equipe"
- Para dúvidas técnicas complexas, ofereça vistoria gratuita`;

// ─── Step helpers ─────────────────────────────────────────────────────────────

function productOptions() {
  return `Qual produto você precisa? 🏠

1️⃣ Box de Banheiro
2️⃣ Fechamento de Sacada
3️⃣ Guarda-corpo
4️⃣ Espelho

Digite o número ou nome do produto.`;
}

function subtypeOptions(product: ProductType) {
  const options = PRODUCT_SUBTYPES[product];
  const lines = options.map((o, i) => `${i + 1}️⃣ ${o.title} — ${o.description}`);
  return `Qual o tipo de ${productLabel(product)}?\n\n${lines.join("\n")}\n\nDigite o número ou nome.`;
}

function productLabel(p: string): string {
  const map: Record<string, string> = {
    box: "Box de Banheiro",
    sacada: "Fechamento de Sacada",
    "guarda-corpo": "Guarda-corpo",
    espelho: "Espelho",
  };
  return map[p] ?? p;
}

function glassOptions() {
  return `Qual tipo de vidro prefere? 🪟

1️⃣ Temperado — seguro e econômico (mais comum)
2️⃣ Laminado — maior segurança, não fragmenta
3️⃣ Jateado — privacidade, translúcido
4️⃣ Espelhado — reflexo total, elegante

Digite o número ou nome.`;
}

function thicknessOptions() {
  return `Qual a espessura desejada?

1️⃣ 6mm — mais econômico
2️⃣ 8mm — equilíbrio custo-benefício ⭐ recomendado
3️⃣ 10mm — premium, mais resistente
4️⃣ 12mm — top de linha

Digite o número ou mm (ex: 8).`;
}

function profileOptions() {
  return `Qual o perfil/acabamento?

1️⃣ Sem perfil — fixação direta (frameless)
2️⃣ Alumínio — clássico e durável
3️⃣ Inox — premium e resistente
4️⃣ Preto fosco — moderno e sofisticado

Digite o número ou nome.`;
}

function installationOptions() {
  return `Como será a instalação?

1️⃣ Parafuso — mais simples e econômico
2️⃣ Embutido — acabamento clean na parede
3️⃣ Frameless — sem perfis, visual minimalista ⭐

Digite o número ou nome.`;
}

// ─── Value parsers ────────────────────────────────────────────────────────────

function parseProduct(text: string): ProductType | null {
  const t = text.toLowerCase().trim();
  if (t === "1" || t.includes("box") || t.includes("banheiro")) return "box";
  if (t === "2" || t.includes("sacada") || t.includes("fechamento")) return "sacada";
  if (t === "3" || t.includes("guarda")) return "guarda-corpo";
  if (t === "4" || t.includes("espelho")) return "espelho";
  return null;
}

function parseSubtype(text: string, product: ProductType): string | null {
  const options = PRODUCT_SUBTYPES[product];
  const t = text.toLowerCase().trim();
  const idx = parseInt(t);
  if (!isNaN(idx) && idx >= 1 && idx <= options.length) return options[idx - 1].id;
  const match = options.find(
    (o) => o.id.includes(t) || o.title.toLowerCase().includes(t)
  );
  return match?.id ?? null;
}

function parseDimension(text: string): number | null {
  const clean = text.replace(",", ".").replace(/[^\d.]/g, "");
  const val = parseFloat(clean);
  if (isNaN(val) || val <= 0) return null;
  // If looks like cm (> 10), return as-is; if looks like meters (< 10), convert
  return val < 10 ? Math.round(val * 100) : val;
}

function parseGlass(text: string): GlassType | null {
  const t = text.toLowerCase().trim();
  if (t === "1" || t.includes("temper")) return "temperado";
  if (t === "2" || t.includes("lamin")) return "laminado";
  if (t === "3" || t.includes("jate")) return "jateado";
  if (t === "4" || t.includes("espelh")) return "espelhado";
  return null;
}

function parseThickness(text: string): ThicknessOption | null {
  const t = text.toLowerCase().replace(/mm/g, "").trim();
  if (t === "1") return 6;
  if (t === "2") return 8;
  if (t === "3") return 10;
  if (t === "4") return 12;
  const n = parseInt(t);
  if ([6, 8, 10, 12].includes(n)) return n as ThicknessOption;
  return null;
}

function parseProfile(text: string): ProfileType | null {
  const t = text.toLowerCase().trim();
  if (t === "1" || t.includes("sem")) return "sem-perfil";
  if (t === "2" || t.includes("alum")) return "aluminio";
  if (t === "3" || t.includes("inox")) return "inox";
  if (t === "4" || t.includes("preto") || t.includes("fosco")) return "preto-fosco";
  return null;
}

function parseInstallation(text: string): InstallationType | null {
  const t = text.toLowerCase().trim();
  if (t === "1" || t.includes("parafu")) return "parafuso";
  if (t === "2" || t.includes("embutid")) return "embutido";
  if (t === "3" || t.includes("framel")) return "frameless";
  return null;
}

function parseQuantity(text: string): number | null {
  const n = parseInt(text.replace(/\D/g, ""));
  if (isNaN(n) || n <= 0 || n > 100) return null;
  return n;
}

// ─── Quote summary builder ────────────────────────────────────────────────────

async function buildQuoteSummary(ctx: ConversationContext): Promise<string> {
  const tables = await getPriceTables().catch(() => PRICE_TABLES);
  const result = calculateQuote(
    {
      product: ctx.product as ProductType,
      subtype: ctx.subtype as never,
      width: ctx.width!,
      height: ctx.height!,
      glassType: ctx.glassType as GlassType,
      thickness: ctx.thickness as ThicknessOption,
      profile: ctx.profile as ProfileType,
      installation: ctx.installation as InstallationType,
      quantity: ctx.quantity ?? 1,
    },
    tables
  );

  const area = result.area.toFixed(2).replace(".", ",");
  const total = formatCurrency(result.total);
  const product = productLabel(ctx.product!);
  const qty = ctx.quantity && ctx.quantity > 1 ? ` (${ctx.quantity} peças)` : "";

  return `✅ *Orçamento estimado — Cristal Vidro*

🪟 *Produto:* ${product}
📐 *Medidas:* ${ctx.width}×${ctx.height} cm (${area} m²)
🔹 *Vidro:* ${ctx.glassType} ${ctx.thickness}mm
🔧 *Perfil:* ${ctx.profile?.replace("-", " ")}
🔩 *Instalação:* ${ctx.installation}${qty}

💰 *Total estimado: ${total}*

_Este é um valor aproximado. O preço final é confirmado após vistoria técnica gratuita._

Posso agendar a vistoria? Me informe seu nome completo 😊`;
}

// ─── AI fallback for free text ────────────────────────────────────────────────

async function claudeReply(
  userMessage: string,
  history: ConversationMessage[],
  step: string
): Promise<string> {
  const contextNote = `\n\n[Contexto interno: O cliente está na etapa "${step}". Guie-o de volta ao fluxo de orçamento se necessário.]`;

  const messages = [
    ...history.slice(-8).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: SYSTEM_PROMPT + contextNote,
    messages,
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "Desculpe, não entendi. Pode repetir?";
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function handleIncomingMessage(phone: string, text: string): Promise<void> {
  const conv = await getOrCreateConversation(phone);
  const trimmed = text.trim();

  // Append user message to history
  const messages: ConversationMessage[] = [
    ...conv.messages,
    { role: "user", content: trimmed, ts: new Date().toISOString() },
  ];

  let reply = "";
  let nextStep: ConversationStep = conv.step;
  let ctx: ConversationContext = { ...conv.context };

  // Global restart commands
  if (/^(reiniciar|restart|reset|menu|início|inicio|olá|ola|oi|bom dia|boa tarde|boa noite)$/i.test(trimmed)) {
    nextStep = "GREETING";
    ctx = {};
  }

  // ─── Step machine ───────────────────────────────────────────────────────────

  if (nextStep === "GREETING") {
    const name = conv.customerName ? `, ${conv.customerName.split(" ")[0]}` : "";
    reply = `Olá${name}! 👋 Sou a Sofia, da *Cristal Vidro*.\n\nSou especialista em box de banheiro, sacada, guarda-corpo e espelhos. Como posso te ajudar?\n\n${productOptions()}`;
    nextStep = "SELECTING_PRODUCT";

  } else if (nextStep === "SELECTING_PRODUCT") {
    const product = parseProduct(trimmed);
    if (product) {
      ctx.product = product;
      reply = subtypeOptions(product);
      nextStep = "SELECTING_SUBTYPE";
    } else {
      reply = await claudeReply(trimmed, messages, nextStep);
      // If FAQ-like, stay on step but use Claude
    }

  } else if (nextStep === "SELECTING_SUBTYPE") {
    const sub = parseSubtype(trimmed, ctx.product as ProductType);
    if (sub) {
      ctx.subtype = sub;
      reply = `Ótimo! Agora me informe a *largura* do espaço em cm (ex: 90 ou 1,20m) 📐`;
      nextStep = "COLLECTING_WIDTH";
    } else {
      reply = subtypeOptions(ctx.product as ProductType) + "\n\n_Digite o número da opção._";
    }

  } else if (nextStep === "COLLECTING_WIDTH") {
    const w = parseDimension(trimmed);
    if (w && w >= 20 && w <= 2000) {
      ctx.width = w;
      reply = `Largura: *${w} cm* ✓\n\nAgora a *altura* (ex: 210 ou 2,10m):`;
      nextStep = "COLLECTING_HEIGHT";
    } else {
      reply = `Não entendi a medida. Digite a largura em cm (ex: *90*) ou metros (ex: *0,90m*).`;
    }

  } else if (nextStep === "COLLECTING_HEIGHT") {
    const h = parseDimension(trimmed);
    if (h && h >= 20 && h <= 500) {
      ctx.height = h;
      reply = glassOptions();
      nextStep = "SELECTING_GLASS";
    } else {
      reply = `Não entendi. Digite a altura em cm (ex: *210*) ou metros (ex: *2,10m*).`;
    }

  } else if (nextStep === "SELECTING_GLASS") {
    const glass = parseGlass(trimmed);
    if (glass) {
      ctx.glassType = glass;
      reply = thicknessOptions();
      nextStep = "SELECTING_THICKNESS";
    } else {
      reply = glassOptions() + "\n\n_Digite o número (1-4)._";
    }

  } else if (nextStep === "SELECTING_THICKNESS") {
    const t = parseThickness(trimmed);
    if (t) {
      ctx.thickness = t;
      reply = profileOptions();
      nextStep = "SELECTING_PROFILE";
    } else {
      reply = `Digite a espessura: *6*, *8*, *10* ou *12* mm.`;
    }

  } else if (nextStep === "SELECTING_PROFILE") {
    const p = parseProfile(trimmed);
    if (p) {
      ctx.profile = p;
      reply = installationOptions();
      nextStep = "SELECTING_INSTALLATION";
    } else {
      reply = profileOptions() + "\n\n_Digite o número (1-4)._";
    }

  } else if (nextStep === "SELECTING_INSTALLATION") {
    const inst = parseInstallation(trimmed);
    if (inst) {
      ctx.installation = inst;
      reply = `Quantas peças? (Digite *1* se for uma unidade)`;
      nextStep = "COLLECTING_QUANTITY";
    } else {
      reply = installationOptions() + "\n\n_Digite o número (1-3)._";
    }

  } else if (nextStep === "COLLECTING_QUANTITY") {
    const qty = parseQuantity(trimmed);
    if (qty) {
      ctx.quantity = qty;
      reply = await buildQuoteSummary(ctx);
      nextStep = "COLLECTING_NAME";
    } else {
      reply = `Digite a quantidade (número inteiro, ex: *1* ou *3*).`;
    }

  } else if (nextStep === "COLLECTING_NAME") {
    if (trimmed.length >= 3 && /[a-záéíóúâêîôûãõàç\s]/i.test(trimmed)) {
      ctx.customerName = trimmed;
      reply = `Obrigada, ${trimmed.split(" ")[0]}! 😊\n\nQual seu e-mail? (opcional — para enviar o orçamento detalhado)\n\nOu escreva *pular* para continuar.`;
      nextStep = "COLLECTING_EMAIL";
    } else {
      reply = `Por favor, informe seu nome completo.`;
    }

  } else if (nextStep === "COLLECTING_EMAIL") {
    const skip = /pular|skip|não|nao|sem/i.test(trimmed);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (isEmail) ctx.customerEmail = trimmed;

    // Save the quote
    try {
      const tables = await getPriceTables().catch(() => PRICE_TABLES);
      const { total } = calculateQuote(
        {
          product: ctx.product as ProductType,
          subtype: ctx.subtype as never,
          width: ctx.width!,
          height: ctx.height!,
          glassType: ctx.glassType as GlassType,
          thickness: ctx.thickness as ThicknessOption,
          profile: ctx.profile as ProfileType,
          installation: ctx.installation as InstallationType,
          quantity: ctx.quantity ?? 1,
        },
        tables
      );

      const savedQuote = await insertQuote({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        customer: {
          name: ctx.customerName ?? conv.customerName ?? "Cliente WhatsApp",
          phone,
          email: ctx.customerEmail ?? "",
        },
        product: ctx.product as ProductType,
        subtype: ctx.subtype ?? null,
        width: ctx.width!,
        height: ctx.height!,
        glassType: ctx.glassType as GlassType,
        thickness: ctx.thickness as ThicknessOption,
        profile: ctx.profile as ProfileType,
        installation: ctx.installation as InstallationType,
        quantity: ctx.quantity ?? 1,
        total,
      });

      if (savedQuote) {
        await updateConversation(conv.id, {
          quoteId: savedQuote.id,
          customerName: ctx.customerName ?? undefined,
        });
      }
    } catch (e) {
      console.error("[agent] quote save error:", e);
    }

    if (!skip && !isEmail) {
      reply = `Não reconheci o e-mail. Digite um e-mail válido ou escreva *pular*.`;
      // Stay on COLLECTING_EMAIL
      const msgs: ConversationMessage[] = [
        ...messages,
        { role: "assistant", content: reply, ts: new Date().toISOString() },
      ];
      await updateConversation(conv.id, { context: ctx, messages: msgs });
      await sendText(phone, reply);
      return;
    }

    reply = `🎉 Orçamento salvo com sucesso!\n\nNossa equipe vai entrar em contato em breve para confirmar a vistoria gratuita.\n\nAgradecemos o contato com a *Cristal Vidro*! 💙\n\nEscreva *oi* para fazer outro orçamento.`;
    nextStep = "QUOTE_SAVED";

  } else if (nextStep === "QUOTE_SAVED") {
    reply = `Olá novamente! 😊\n\n${productOptions()}`;
    nextStep = "SELECTING_PRODUCT";
    ctx = {};

  } else {
    reply = await claudeReply(trimmed, conv.messages, nextStep);
  }

  // Append assistant reply
  const finalMessages: ConversationMessage[] = [
    ...messages,
    { role: "assistant", content: reply, ts: new Date().toISOString() },
  ];

  await updateConversation(conv.id, {
    step: nextStep,
    context: ctx,
    messages: finalMessages.slice(-40), // keep last 40 messages
    customerName: ctx.customerName ?? conv.customerName ?? undefined,
  });

  await sendText(phone, reply);
}
