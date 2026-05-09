import type { StoredQuote } from "@/lib/supabase/types";

const PRODUCT_LABELS: Record<string, string> = {
  box: "Box de Banheiro",
  sacada: "Sacada de Vidro",
  "guarda-corpo": "Guarda-corpo",
  espelho: "Espelho",
};

const GLASS_LABELS: Record<string, string> = {
  temperado: "Temperado", laminado: "Laminado", jateado: "Jateado", espelhado: "Espelhado",
};

const PROFILE_LABELS: Record<string, string> = {
  "sem-perfil": "Sem perfil", aluminio: "Alumínio", inox: "Inox escovado", "preto-fosco": "Preto fosco",
};

const INSTALL_LABELS: Record<string, string> = {
  parafuso: "Parafuso", embutido: "Embutido", frameless: "Frameless",
};

// Structures a quote into a PDF-ready data object.
// Pass this to @react-pdf/renderer, puppeteer, or any HTML-to-PDF solution.
export function buildPdfData(quote: StoredQuote) {
  return {
    company: {
      name: "Cristal Vidro",
      tagline: "Soluções em vidro sob medida",
      phone: "(11) 99999-9999",
      email: "contato@cristalvidro.com.br",
    },
    quote: {
      id: quote.id,
      date: new Date(quote.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "long", year: "numeric",
      }),
    },
    customer: {
      name: quote.customer.name,
      phone: quote.customer.phone,
      email: quote.customer.email,
    },
    product: {
      label: PRODUCT_LABELS[quote.product] ?? quote.product,
      subtype: quote.subtype,
      dimensions: `${quote.width} × ${quote.height} cm`,
      area: `${((quote.width * quote.height) / 10000).toFixed(2)} m²`,
      quantity: quote.quantity,
      glass: `${GLASS_LABELS[quote.glassType] ?? quote.glassType} · ${quote.thickness} mm`,
      profile: PROFILE_LABELS[quote.profile] ?? quote.profile,
      installation: INSTALL_LABELS[quote.installation] ?? quote.installation,
    },
    pricing: {
      total: quote.total,
      totalFormatted: new Intl.NumberFormat("pt-BR", {
        style: "currency", currency: "BRL",
      }).format(quote.total),
      perUnit: quote.quantity > 1
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(quote.total / quote.quantity)
        : null,
      disclaimer: "Valores estimados. Orçamento final após vistoria gratuita.",
    },
    validity: "15 dias",
  };
}

/*
 * To generate a real PDF, install @react-pdf/renderer:
 *   npm install @react-pdf/renderer
 *
 * Then create a React component using the data from buildPdfData() and
 * render it server-side with renderToBuffer() in the /api/quotes/[id]/pdf route.
 *
 * Example:
 *   import { renderToBuffer } from "@react-pdf/renderer";
 *   const buffer = await renderToBuffer(<QuotePdf data={buildPdfData(quote)} />);
 *   return new Response(buffer, { headers: { "Content-Type": "application/pdf" } });
 */
