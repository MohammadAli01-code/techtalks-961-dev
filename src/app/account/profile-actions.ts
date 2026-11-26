
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Update the authenticated user's existing profile.
export async function updateProfile(displayName: string) {
  // Server-side validation prevents invalid direct requests.
  if (typeof displayName !== "string") {
    return {
      success: false,
      message: "Invalid profile name.",
    };
  }

  const name = displayName.trim();

  if (name.length < 2 || name.length > 80) {
    return {
      success: false,
      message: "Your name must contain between 2 and 80 characters.",
    };
  }

  const supabase = await createClient();

  // Verify the current user's identity.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Your session has expired. Please log in again.",
    };
  }

  // Update only the current user's profile.
  // Existing Supabase RLS policies remain active.
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: name,
    })
    .eq("id", user.id)
    .select("display_name")
    .maybeSingle();

  // Confirm that a database row was actually updated.
  if (error || !data) {
    return {
      success: false,
      message: "Unable to update your profile. Please try again.",
    };
  }

  // Refresh the account page with the saved profile data.
  revalidatePath("/account");

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}
