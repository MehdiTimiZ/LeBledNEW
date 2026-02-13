-- 1. Create the Profiles Table (if not exists)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'USER' check (role in ('USER', 'ADMIN', 'SUPER_ADMIN')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable RLS (Security)
alter table public.profiles enable row level security;

-- 3. Policy: Everyone can read basic info
-- Drop first to avoid "already exists" error
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" 
  on profiles for select using ( true );

-- 4. Policy: Only Super Admins can update roles
drop policy if exists "Only Super Admins can update roles" on profiles;
create policy "Only Super Admins can update roles" 
  on profiles for update 
  using ( 
    auth.uid() in (select id from profiles where role = 'SUPER_ADMIN')
  );

-- 5. Trigger: Automatically create a profile when a user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'USER')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. BOOTSTRAP: Elevate your specific user to SUPER_ADMIN
-- This is safe to run multiple times
update public.profiles 
set role = 'SUPER_ADMIN' 
where email = 'mehdi.timizar@sap.com';
