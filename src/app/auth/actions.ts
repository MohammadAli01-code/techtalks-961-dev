"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Sign out the current user and end their session.
export async function logout() {
  const supabase = await createClient();

  // Supabase clears the authentication session.
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Unable to log out. Please try again.");
  }

  // Send the user back to the login page.
  redirect("/login");
}
