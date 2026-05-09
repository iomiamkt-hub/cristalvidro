-- ═══════════════════════════════════════════════════════════════════════════
-- Cristal Vidro — Schema inicial
-- Execute no Supabase Dashboard › SQL Editor › New query
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Tabela: pricing_config ──────────────────────────────────────────────────
-- Uma linha por produto. Colunas JSONB para multiplicadores e preços.

CREATE TABLE IF NOT EXISTS public.pricing_config (
  product              TEXT PRIMARY KEY,
  base_per_m2          NUMERIC(10, 2) NOT NULL,
  minimum_price        NUMERIC(10, 2) NOT NULL,
  glass_multiplier     JSONB NOT NULL DEFAULT '{}'::JSONB,
  thickness_multiplier JSONB NOT NULL DEFAULT '{}'::JSONB,
  profile_price        JSONB NOT NULL DEFAULT '{}'::JSONB,
  installation_price   JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at           TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER pricing_config_updated_at
  BEFORE UPDATE ON public.pricing_config
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Tabela: quotes ──────────────────────────────────────────────────────────
-- Cada orçamento enviado pelo cliente através do formulário.

CREATE TABLE IF NOT EXISTS public.quotes (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  customer_name   TEXT        NOT NULL,
  customer_phone  TEXT        NOT NULL,
  customer_email  TEXT        NOT NULL    DEFAULT '',
  product         TEXT        NOT NULL,
  subtype         TEXT,
  width           NUMERIC(8, 2) NOT NULL,
  height          NUMERIC(8, 2) NOT NULL,
  glass_type      TEXT        NOT NULL,
  thickness       INTEGER     NOT NULL,
  profile         TEXT        NOT NULL,
  installation    TEXT        NOT NULL,
  quantity        INTEGER     NOT NULL DEFAULT 1,
  total           NUMERIC(10, 2) NOT NULL
);

-- Índice para busca por data (mais recentes primeiro)
CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON public.quotes (created_at DESC);

-- ─── Tabela: project_references ──────────────────────────────────────────────
-- Galeria de projetos executados (gerenciada pelo admin).

CREATE TABLE IF NOT EXISTS public.project_references (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL    DEFAULT '',
  image_url   TEXT        NOT NULL,
  product     TEXT        NOT NULL    DEFAULT 'box'
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Políticas permissivas para o MVP. Tighten com service_role em produção.

ALTER TABLE public.pricing_config    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_references ENABLE ROW LEVEL SECURITY;

-- pricing_config: leitura pública (calculadora do cliente), escrita via API autenticada
DROP POLICY IF EXISTS "pricing_public_read"  ON public.pricing_config;
DROP POLICY IF EXISTS "pricing_public_write" ON public.pricing_config;
CREATE POLICY "pricing_public_read"  ON public.pricing_config FOR SELECT USING (true);
CREATE POLICY "pricing_public_write" ON public.pricing_config FOR ALL    USING (true);

-- quotes: qualquer visitante pode inserir (envio de orçamento), leitura via API admin
DROP POLICY IF EXISTS "quotes_public_insert" ON public.quotes;
DROP POLICY IF EXISTS "quotes_public_read"   ON public.quotes;
CREATE POLICY "quotes_public_insert" ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "quotes_public_read"   ON public.quotes FOR SELECT USING (true);

-- project_references: leitura pública, escrita via API admin
DROP POLICY IF EXISTS "refs_public_read"  ON public.project_references;
DROP POLICY IF EXISTS "refs_public_write" ON public.project_references;
CREATE POLICY "refs_public_read"  ON public.project_references FOR SELECT USING (true);
CREATE POLICY "refs_public_write" ON public.project_references FOR ALL    USING (true);

-- ─── Dados iniciais: pricing_config ─────────────────────────────────────────
-- Insere os valores padrão. Se já existirem, ignora (ON CONFLICT DO NOTHING).

INSERT INTO public.pricing_config
  (product, base_per_m2, minimum_price, glass_multiplier, thickness_multiplier, profile_price, installation_price)
VALUES
  (
    'box', 580, 890,
    '{"temperado": 1, "laminado": 1.35, "jateado": 1.25, "espelhado": 1.4}',
    '{"6": 1, "8": 1.2, "10": 1.45, "12": 1.7}',
    '{"sem-perfil": 0, "aluminio": 180, "inox": 320, "preto-fosco": 280}',
    '{"parafuso": 150, "embutido": 280, "frameless": 450}'
  ),
  (
    'sacada', 720, 1200,
    '{"temperado": 1, "laminado": 1.3, "jateado": 1.2, "espelhado": 1.5}',
    '{"6": 1, "8": 1.15, "10": 1.4, "12": 1.65}',
    '{"sem-perfil": 0, "aluminio": 220, "inox": 380, "preto-fosco": 340}',
    '{"parafuso": 200, "embutido": 350, "frameless": 520}'
  ),
  (
    'guarda-corpo', 680, 1100,
    '{"temperado": 1, "laminado": 1.4, "jateado": 1.15, "espelhado": 1.45}',
    '{"6": 1, "8": 1.18, "10": 1.42, "12": 1.68}',
    '{"sem-perfil": 0, "aluminio": 200, "inox": 360, "preto-fosco": 310}',
    '{"parafuso": 180, "embutido": 300, "frameless": 480}'
  ),
  (
    'espelho', 420, 550,
    '{"temperado": 1, "laminado": 1.2, "jateado": 1.1, "espelhado": 1.3}',
    '{"6": 1, "8": 1.1, "10": 1.3, "12": 1.5}',
    '{"sem-perfil": 0, "aluminio": 140, "inox": 260, "preto-fosco": 220}',
    '{"parafuso": 100, "embutido": 220, "frameless": 380}'
  )
ON CONFLICT (product) DO NOTHING;
