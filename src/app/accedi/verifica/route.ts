import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { consumeLoginToken, startSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const requested = request.nextUrl.searchParams.get("next") ?? "/preferiti";
  const next = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/preferiti";

  const result = await consumeLoginToken(token);

  if (!result.ok) {
    const url = new URL("/accedi/scaduto", request.url);
    if (result.email) {
      url.searchParams.set("email", result.email);
    }
    url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  await startSession(result.userId);
  return NextResponse.redirect(new URL(next, request.url));
}
