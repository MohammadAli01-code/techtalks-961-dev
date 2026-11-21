import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Run Supabase session handling before matching requests.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
