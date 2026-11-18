import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      {
        connected: false,
        error: "Missing Supabase environment variables",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${url}/auth/v1/health`, {
      headers: {
        apikey: key,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          connected: false,
          error: "Supabase health check failed",
          status: response.status,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      connected: true,
      message: "Supabase connection successful!",
    });
  } catch {
    return NextResponse.json(
      {
        connected: false,
        error: "Cannot reach Supabase",
      },
      { status: 502 },
    );
  }
}
