import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function AccountPage() {
  const supabase = await createClient();

  // Verify the current user's signed authentication token.
  const { data, error } = await supabase.auth.getClaims();

  // Guests must log in before viewing this page.
  if (error || !data?.claims?.sub) {
    redirect("/login");
  }

  const userId = data.claims.sub;

  // RLS should allow access only to this user's profile.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Unable to load account profile");
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">My Account</h1>

      <p className="mb-4 text-gray-600">You are signed in to 961-Dev.</p>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="mb-2">
          <strong>Name:</strong> {profile?.display_name || "Not provided"}
        </p>

        <p className="mb-6 text-sm text-gray-500">
          This account page is protected by server-side authentication.
        </p>

        {/* Submitting this form runs our Server Action. */}
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white hover:opacity-90"
          >
            Log Out
          </button>
        </form>
      </div>
    </section>
  );
}
