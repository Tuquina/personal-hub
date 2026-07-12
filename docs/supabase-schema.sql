-- Fase 2: schema de Supabase para reemplazar PlaceholderContentRepository.
-- Lectura publica para todo, escritura solo para Fernando.
-- YA APLICADO en el proyecto "personal-hub" (chytzzgharuncthfzenx) via el conector.
-- Este archivo queda como fuente de verdad / para recrear el schema.

create table now_status (
  id int primary key default 1,
  headline text not null,
  week_summary text not null,
  ticker_items text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  title text not null,
  description text not null,
  stack text not null,
  year_label text not null,
  url text,
  status text not null check (status in ('live', 'draft')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  minutes int not null default 5,
  body_markdown text not null default '',
  published boolean not null default false,
  published_at date,
  created_at timestamptz not null default now()
);

create table training_logs (
  id uuid primary key default gen_random_uuid(),
  logged_on date not null,
  kind text not null check (kind in ('RUN', 'GYM', 'SNOW', 'OTHER')),
  description text not null,
  distance_km numeric,
  duration text,
  upcoming boolean not null default false,
  created_at timestamptz not null default now()
);

create table books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  genre text not null,
  status text not null check (status in ('reading', 'queued', 'done')),
  progress_percent int,
  rating int check (rating between 1 and 5),
  note text,
  created_at timestamptz not null default now()
);

create table uses_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('LANGUAGES & BACKEND', 'EVERYDAY TOOLS', 'OFF THE DESK')),
  tag text not null,
  sort_order int not null default 0
);

-- RLS: lectura publica, escritura solo para el usuario autenticado cuyo email
-- es el de Fernando. Se usa el claim de email del JWT en vez del uid, asi la
-- policy funciona desde el primer login (el uid recien existe tras el magic link).

alter table now_status enable row level security;
alter table projects enable row level security;
alter table notes enable row level security;
alter table training_logs enable row level security;
alter table books enable row level security;
alter table uses_items enable row level security;

create policy "public read" on now_status for select using (true);
create policy "public read" on projects for select using (true);
create policy "public read published notes" on notes for select using (published = true);
create policy "public read" on training_logs for select using (true);
create policy "public read" on books for select using (true);
create policy "public read" on uses_items for select using (true);

create policy "owner write" on now_status for all using ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com') with check ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com');
create policy "owner write" on projects for all using ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com') with check ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com');
create policy "owner write" on notes for all using ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com') with check ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com');
create policy "owner write" on training_logs for all using ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com') with check ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com');
create policy "owner write" on books for all using ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com') with check ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com');
create policy "owner write" on uses_items for all using ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com') with check ((auth.jwt() ->> 'email') = 'fernandotuquina@gmail.com');

-- Storage: bucket publico de solo-lectura para imagenes (covers de libros, etc.)
-- Crear a mano en Supabase Studio > Storage > New bucket > "media", marcar como publico.
