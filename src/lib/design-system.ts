/**
 * Cristal Vidro — Design System Tokens
 *
 * Source of truth para todos os valores visuais do projeto.
 * Em Tailwind v4 os tokens são registrados em globals.css via @theme {}.
 * Este arquivo exporta os mesmos valores para uso em código TypeScript
 * (inline styles, animações Framer Motion, lógica dinâmica).
 */

// ─── Cores ────────────────────────────────────────────────────────────────────

export const colors = {
  // Superfícies
  background:    "#080808",
  surface:       "#111111",
  surfaceRaised: "#161616",
  surfaceHover:  "#1A1A1A",

  // Identidade
  accent:        "#E8D5B0",
  accentDim:     "rgba(232, 213, 176, 0.55)",
  accentGlow:    "rgba(232, 213, 176, 0.08)",
  accentBorder:  "rgba(232, 213, 176, 0.20)",

  // Semânticas
  success:       "#4ADE80",
  successGlow:   "rgba(74, 222, 128, 0.10)",
  warning:       "#FBBF24",
  warningGlow:   "rgba(251, 191, 36, 0.10)",
  danger:        "#F87171",
  dangerGlow:    "rgba(248, 113, 113, 0.10)",

  // Texto
  textPrimary:   "rgba(255, 255, 255, 0.92)",
  textSecondary: "rgba(255, 255, 255, 0.45)",
  textMuted:     "rgba(255, 255, 255, 0.20)",
  textDisabled:  "rgba(255, 255, 255, 0.12)",

  // Bordas
  border:        "rgba(255, 255, 255, 0.06)",
  borderStrong:  "rgba(255, 255, 255, 0.12)",
  borderFocus:   "rgba(255, 255, 255, 0.24)",
} as const;

export type ColorToken = keyof typeof colors;

// ─── Tipografia ───────────────────────────────────────────────────────────────

export const typography = {
  fontSans: "'Inter', system-ui, -apple-system, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",

  // Escala de tamanhos (em px, mas usar classes Tailwind: text-label, text-body...)
  sizeLabel:    "11px",
  sizeBody:     "13px",
  sizeSubtitle: "15px",
  sizeTitle:    "24px",
  sizeHero:     "36px",

  // Letter-spacing
  trackingLabel: "0.14em",
  trackingWide:  "0.08em",
  trackingTight: "-0.02em",

  // Line-heights
  leadingTight:   "1.1",
  leadingSnug:    "1.3",
  leadingNormal:  "1.5",
} as const;

// ─── Espaçamento ──────────────────────────────────────────────────────────────

export const spacing = {
  cardPadding:  "24px",   // p-6
  sectionGap:   "32px",   // gap-8
  pagePadding:  "40px",   // p-10
  itemGap:      "16px",   // gap-4
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const radius = {
  card:   "16px",  // rounded-card
  button: "12px",  // rounded-button
  input:  "8px",   // rounded-input
  badge:  "6px",   // rounded-badge
  full:   "9999px",
} as const;

// ─── Elevação (bordas em vez de sombras) ──────────────────────────────────────

export const elevation = {
  1: { border: `1px solid ${colors.border}` },
  2: { border: `1px solid ${colors.borderStrong}`, background: "rgba(255,255,255,0.02)" },
  3: { border: `1px solid rgba(255,255,255,0.14)`, background: "rgba(255,255,255,0.04)" },
} as const;

// ─── Presets de classes Tailwind (para usar com cn()) ─────────────────────────

export const ds = {
  // Cards
  card:        "rounded-card border border-white/[0.06] bg-surface p-6",
  cardRaised:  "rounded-card border border-white/[0.10] bg-white/[0.02] p-6",
  cardElevated:"rounded-card border border-white/[0.14] bg-white/[0.04] p-6",

  // Superfícies interativas
  interactive: "transition-colors duration-150 cursor-pointer",
  hoverSurface:"hover:bg-white/[0.03] hover:border-white/[0.10]",

  // Texto
  labelText:   "text-label text-white/20 uppercase tracking-label font-medium",
  bodyText:    "text-body text-white/45",
  titleText:   "text-title font-semibold text-white tracking-tight",
  heroText:    "text-hero font-semibold text-white tracking-tight",

  // Inputs
  input:       "rounded-input border border-white/[0.07] bg-transparent text-body text-white placeholder:text-white/15 outline-none transition-colors focus:border-white/[0.24] px-3 py-2",

  // Botões
  btnPrimary:  "rounded-button h-11 px-5 text-body font-semibold bg-white text-zinc-950 hover:bg-zinc-100 transition-colors disabled:opacity-35",
  btnSecondary:"rounded-button h-11 px-5 text-body font-medium border border-white/[0.10] text-white/55 hover:text-white/80 hover:border-white/[0.18] transition-colors",
  btnAccent:   "rounded-button h-11 px-5 text-body font-semibold bg-accent text-zinc-950 hover:opacity-90 transition-opacity",
  btnGhost:    "rounded-button h-9 px-4 text-body text-white/35 hover:text-white/65 hover:bg-white/[0.04] transition-colors",
  btnDanger:   "rounded-button h-9 px-4 text-body text-danger/70 hover:text-danger hover:bg-danger/[0.08] transition-colors",

  // Badges
  badge:       "inline-flex items-center rounded-badge px-2 py-0.5 text-label font-medium border",
  badgeNeutral:"border-white/[0.08] text-white/35",
  badgeAccent: "border-accent/[0.25] text-accent bg-accent/[0.08]",
  badgeSuccess:"border-success/[0.25] text-success bg-success/[0.08]",
  badgeWarning:"border-warning/[0.25] text-warning bg-warning/[0.08]",
  badgeDanger: "border-danger/[0.25] text-danger bg-danger/[0.08]",

  // Divisores
  divider:     "border-t border-white/[0.06]",
  dividerStrong:"border-t border-white/[0.10]",

  // Seções de página
  pageHeader:  "mb-8",
  pageLabel:   "text-label text-white/25 uppercase tracking-label mb-2",
  pageTitle:   "text-title font-semibold text-white tracking-tight",

  // Tabelas / listas
  listItem:    "flex items-center justify-between py-4 border-b border-white/[0.05] gap-4",
  listItemLast:"flex items-center justify-between py-4 gap-4",
} as const;

// ─── Variantes de animação (Framer Motion) ────────────────────────────────────

export const motion = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
    transition: { duration: 0.18 },
  },
  slideUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -8 },
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  slideIn: {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: 12 },
    transition: { duration: 0.20, ease: [0.16, 1, 0.3, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.96 },
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
  stagger: (i: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.20, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Retorna classes Tailwind para um badge de status */
export function statusBadge(status: string): string {
  const map: Record<string, string> = {
    ativo:     `${ds.badge} ${ds.badgeSuccess}`,
    pendente:  `${ds.badge} ${ds.badgeWarning}`,
    cancelado: `${ds.badge} ${ds.badgeDanger}`,
    novo:      `${ds.badge} ${ds.badgeAccent}`,
    concluido: `${ds.badge} ${ds.badgeNeutral}`,
  };
  return map[status.toLowerCase()] ?? `${ds.badge} ${ds.badgeNeutral}`;
}

/** Inline style para glow de cor semântica */
export function glowStyle(color: "accent" | "success" | "warning" | "danger") {
  return {
    boxShadow: `0 0 0 1px ${colors[`${color}Border` as ColorToken] ?? colors.border}, 0 4px 24px ${colors[`${color}Glow` as ColorToken] ?? "transparent"}`,
  };
}
