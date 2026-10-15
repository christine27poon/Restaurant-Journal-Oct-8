-- Sign-up now collects first name, last name, date of birth and city.
-- first name -> profiles.display_name (used in the greeting), city -> preferences.home_city.
alter table public.profiles
  add column last_name text check (char_length(last_name) <= 60),
  add column date_of_birth date check (date_of_birth >= date '1900-01-01');

create or replace function public.handle_new_user() returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  dob date;
begin
  -- Never let a malformed value block account creation: bad dates are simply dropped.
  begin
    dob := nullif(meta ->> 'date_of_birth', '')::date;
  exception when others then
    dob := null;
  end;
  if dob is not null and (dob > current_date or dob < date '1900-01-01') then
    dob := null;
  end if;

  insert into public.profiles (id, display_name, last_name, date_of_birth, preferences)
  values (
    new.id,
    left(coalesce(nullif(trim(meta ->> 'display_name'), ''), nullif(split_part(new.email, '@', 1), ''), 'Friend'), 60),
    nullif(left(trim(meta ->> 'last_name'), 60), ''),
    dob,
    jsonb_build_object(
      'show_health_tags', true,
      'default_price_tier', null,
      'home_city', nullif(left(trim(meta ->> 'home_city'), 60), '')
    )
  );
  return new;
end
$$;
