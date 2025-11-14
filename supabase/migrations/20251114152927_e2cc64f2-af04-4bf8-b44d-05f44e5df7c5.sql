-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum for professional experience levels
create type public.experience_level as enum ('sin_experiencia', 'junior', 'semi_senior', 'senior', 'experto');

-- Create enum for app roles (admin, user)
create type public.app_role as enum ('admin', 'user');

-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  nombre text not null,
  email text not null,
  avatar_url text,
  rol_profesional text,
  experiencia experience_level default 'sin_experiencia',
  pais text,
  industria text,
  preferencias_laborales jsonb default '{}'::jsonb,
  progreso jsonb default '{"cv_completado": false, "entrevistas_realizadas": 0, "oportunidades_guardadas": 0}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS policies for user_roles
create policy "Users can view own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can manage all roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'));

-- Create CVs table
create table public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre_cv text not null default 'Mi CV',
  info_personal jsonb default '{}'::jsonb,
  resumen text,
  educacion jsonb default '[]'::jsonb,
  experiencia jsonb default '[]'::jsonb,
  habilidades jsonb default '[]'::jsonb,
  idiomas jsonb default '[]'::jsonb,
  proyectos jsonb default '[]'::jsonb,
  certificaciones jsonb default '[]'::jsonb,
  template text default 'modern',
  is_active boolean default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS on cvs
alter table public.cvs enable row level security;

-- RLS policies for cvs
create policy "Users can view own CVs"
  on public.cvs for select
  using (auth.uid() = user_id);

create policy "Users can insert own CVs"
  on public.cvs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own CVs"
  on public.cvs for update
  using (auth.uid() = user_id);

create policy "Users can delete own CVs"
  on public.cvs for delete
  using (auth.uid() = user_id);

-- Create interview_sessions table
create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rol text not null,
  industria text,
  duracion_minutos integer default 30,
  puntuacion integer,
  feedback jsonb default '{}'::jsonb,
  respuestas jsonb default '[]'::jsonb,
  completada boolean default false,
  created_at timestamp with time zone not null default now()
);

-- Enable RLS on interview_sessions
alter table public.interview_sessions enable row level security;

-- RLS policies for interview_sessions
create policy "Users can view own interview sessions"
  on public.interview_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own interview sessions"
  on public.interview_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own interview sessions"
  on public.interview_sessions for update
  using (auth.uid() = user_id);

-- Create saved_opportunities table
create table public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_data jsonb not null,
  notes text,
  status text default 'saved',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS on saved_opportunities
alter table public.saved_opportunities enable row level security;

-- RLS policies for saved_opportunities
create policy "Users can view own saved opportunities"
  on public.saved_opportunities for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved opportunities"
  on public.saved_opportunities for insert
  with check (auth.uid() = user_id);

create policy "Users can update own saved opportunities"
  on public.saved_opportunities for update
  using (auth.uid() = user_id);

create policy "Users can delete own saved opportunities"
  on public.saved_opportunities for delete
  using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

create trigger update_cvs_updated_at
  before update on public.cvs
  for each row
  execute function public.update_updated_at_column();

create trigger update_saved_opportunities_updated_at
  before update on public.saved_opportunities
  for each row
  execute function public.update_updated_at_column();

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', new.raw_user_meta_data->>'name', 'Usuario'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default 'user' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();