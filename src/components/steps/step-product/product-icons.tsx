import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base: SVGProps<SVGSVGElement> = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Box de Banheiro — duas folhas de vidro em ângulo, vista em perspectiva */
export function BoxIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      {...base}
      {...props}
    >
      {/* Parede fundo */}
      <rect x="6" y="6" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />

      {/* Folha vertical esquerda */}
      <line x1="15" y1="40" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" />
      {/* Folha horizontal frente */}
      <line x1="15" y1="40" x2="39" y2="40" stroke="currentColor" strokeWidth="1.5" />

      {/* Espessura do vidro — folha vertical */}
      <line x1="17" y1="40" x2="17" y2="14" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
      {/* Espessura do vidro — folha horizontal */}
      <line x1="15" y1="38" x2="39" y2="38" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />

      {/* Reflexo folha vertical */}
      <line x1="11" y1="22" x2="14" y2="19" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
      <line x1="11" y1="28" x2="14" y2="25" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />

      {/* Puxador vertical */}
      <line x1="16" y1="25" x2="16" y2="29" stroke="currentColor" strokeWidth="1.5" />

      {/* Chão */}
      <line x1="6" y1="40" x2="42" y2="40" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
    </svg>
  );
}

/** Sacada — painel de vidro horizontal com cidade ao fundo */
export function SacadaIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      {...base}
      {...props}
    >
      {/* Prédios no fundo */}
      <rect x="7"  y="22" width="5"  height="12" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.2" />
      <rect x="14" y="18" width="6"  height="16" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.2" />
      <rect x="22" y="20" width="5"  height="14" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.2" />
      <rect x="29" y="16" width="7"  height="18" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.2" />
      <rect x="38" y="21" width="4"  height="13" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.2" />

      {/* Painel de vidro principal */}
      <rect x="6" y="28" width="36" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      {/* Espessura superior */}
      <line x1="6" y1="29.5" x2="42" y2="29.5" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.35" />

      {/* Trilho superior */}
      <line x1="4" y1="28" x2="44" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Trilho inferior / piso */}
      <line x1="4" y1="36" x2="44" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* Reflexo no vidro */}
      <line x1="10" y1="30" x2="15" y2="35" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
      <line x1="14" y1="30" x2="17" y2="33" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
    </svg>
  );
}

/** Guarda-corpo — painel com perfil superior e fixação no chão */
export function GuardaCorpoIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      {...base}
      {...props}
    >
      {/* Piso */}
      <line x1="4" y1="40" x2="44" y2="40" stroke="currentColor" strokeWidth="2" />

      {/* Painel de vidro */}
      <rect x="8" y="16" width="32" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" />
      {/* Espessura — borda interna superior */}
      <line x1="8" y1="17.5" x2="40" y2="17.5" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.35" />

      {/* Perfil superior */}
      <rect x="5" y="13" width="38" height="3.5" rx="1.5" stroke="currentColor" strokeWidth="1.25" />

      {/* Fixações no piso — spider */}
      <line x1="13" y1="38" x2="13" y2="42" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="13" cy="40" r="1.5" stroke="currentColor" strokeWidth="1" />
      <line x1="35" y1="38" x2="35" y2="42" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="35" cy="40" r="1.5" stroke="currentColor" strokeWidth="1" />

      {/* Reflexo */}
      <line x1="12" y1="19" x2="17" y2="24" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
      <line x1="17" y1="19" x2="20" y2="22" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
    </svg>
  );
}

/** Espelho — moldura com brilho diagonal e reflexo */
export function EspelhoIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      {...base}
      {...props}
    >
      {/* Moldura externa */}
      <rect x="8" y="7" width="32" height="34" rx="3" stroke="currentColor" strokeWidth="1.5" />
      {/* Superfície interna */}
      <rect x="11" y="10" width="26" height="28" rx="1.5" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />

      {/* Brilho diagonal principal */}
      <line x1="14" y1="13" x2="22" y2="21" stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.7" />
      {/* Brilho secundário */}
      <line x1="14" y1="18" x2="18" y2="22" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.45" />

      {/* Reflexo horizontal suave */}
      <line x1="14" y1="30" x2="34" y2="30" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="2 3" />
      <line x1="14" y1="34" x2="28" y2="34" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="2 3" />

      {/* Ponto de brilho */}
      <circle cx="33" cy="14" r="1.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );
}

export const PRODUCT_ICONS = {
  box: BoxIcon,
  sacada: SacadaIcon,
  "guarda-corpo": GuardaCorpoIcon,
  espelho: EspelhoIcon,
} as const;
