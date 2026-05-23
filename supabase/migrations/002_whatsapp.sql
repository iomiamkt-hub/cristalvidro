-- WhatsApp conversations table
create table if not exists whatsapp_conversations (
  id             uuid primary key default gen_random_uuid(),
  phone          text not null unique,
  customer_name  text,
  step           text not null default 'GREETING',
  context        jsonb not null default '{}',
  messages       jsonb not null default '[]',
  quote_id       uuid references quotes(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists whatsapp_conversations_phone_idx on whatsapp_conversations(phone);
create index if not exists whatsapp_conversations_updated_idx on whatsapp_conversations(updated_at desc);

alter table whatsapp_conversations enable row level security;

-- Service role can do everything (server-side only)
create policy "service_role_all" on whatsapp_conversations
  for all using (true) with check (true);
