import Navbar from "./Navbar";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function Header() {
  const supabase = await createClient();

  // Verify the current user using Supabase Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full">
      <Navbar isAuthenticated={!!user} logoutAction={logout} />
    </header>
  );
}
