import Navbar from "./Navbar";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function Header() {
  // Verify the currently authenticated user on the server.
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full">
      <Navbar isAuthenticated={!!user} logoutAction={logout} />
    </header>
  );
}
