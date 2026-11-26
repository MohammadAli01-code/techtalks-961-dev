-- Restrict authenticated users to editing their display name only.
revoke update on table public.profiles from authenticated;

grant update (display_name)
on table public.profiles
to authenticated;