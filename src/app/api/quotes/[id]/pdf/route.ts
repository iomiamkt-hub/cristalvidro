export const runtime = "nodejs";

import { getQuoteById } from "@/services/quotes";
import { buildPdfData } from "@/services/pdf";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySession(token))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const quote = await getQuoteById(id);
  if (!quote) return Response.json({ error: "Quote not found" }, { status: 404 });

  const pdfData = buildPdfData(quote);

  /*
   * Ready for PDF generation. Two options:
   *
   * Option A — @react-pdf/renderer (recommended):
   *   const buffer = await renderToBuffer(<QuotePdf data={pdfData} />);
   *   return new Response(buffer, {
   *     headers: { "Content-Type": "application/pdf",
   *                "Content-Disposition": `attachment; filename="orcamento-${id.slice(0,8)}.pdf"` }
   *   });
   *
   * Option B — Puppeteer / html-to-pdf:
   *   Generate an HTML string from pdfData and use puppeteer.pdf()
   */

  return Response.json(pdfData, {
    headers: { "Cache-Control": "no-store" },
  });
}
