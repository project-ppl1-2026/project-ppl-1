import { NextResponse } from "next/server";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import { getPostLoginRedirect } from "@/lib/get-post-login-redirect";

export async function GET(request: Request) {
  const userId = await getAuthenticatedUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json(
      { isAuthenticated: false, nextRoute: "/login" },
      { status: 200 },
    );
  }

  const nextRoute = await getPostLoginRedirect(userId);

  return NextResponse.json({ isAuthenticated: true, nextRoute });
}
