-- Fase 2 (draft, BELUM diuji). Jalankan lewat Supabase SQL Editor atau `supabase db push`.
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'READY',
  frame_id text,
  created_at timestamptz not null default now()
);

create table if not exists print_jobs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  idempotency_key text not null,
  status text not null default 'PRINT_SUBMITTED'
    check (status in ('READY','PRINT_SUBMITTED','PRINTING','PRINTED','PRINT_FAILED','PRINT_STATUS_UNKNOWN')),
  copies int not null default 1 check (copies = 1),
  created_at timestamptz not null default now(),
  unique (session_id),          -- 1 sesi = 1 pekerjaan cetak
  unique (idempotency_key)
);

alter table sessions enable row level security;
alter table print_jobs enable row level security;
-- Tanpa policy = anon/authenticated ditolak. Hanya service role (main process kiosk) yang bisa akses.
