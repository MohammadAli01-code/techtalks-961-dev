import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Read the confirmation token and its type.
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type === "email") {
    const supabase = await createClient();

    // Verify the email token and establish a session.
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      // Redirect to the homepage after verification.
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Missing, invalid, or expired confirmation token.
  return NextResponse.redirect(
    new URL("/login?error=confirmation_failed", request.url),
  );
}
