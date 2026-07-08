-- Table du livre d'or
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  author text,
  content text not null,
  created_at timestamptz default now()
);

-- Activation de la Row Level Security
alter table public.messages enable row level security;

-- Policies ouvertes (livre d'or de test) : lecture et écriture publiques pour le rôle anon.
-- ATTENTION : à ne PAS utiliser tel quel en production (n'importe qui peut lire/écrire).

-- Lecture publique
create policy "messages_select_public"
  on public.messages
  for select
  to anon
  using (true);

-- Insertion publique
create policy "messages_insert_public"
  on public.messages
  for insert
  to anon
  with check (true);
