import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getPostLoginRedirect } from "@/lib/get-post-login-redirect";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({
        isAuthenticated: false,
        nextRoute: "/login",
      });
    }

    const nextRoute = await getPostLoginRedirect(userId);

    return NextResponse.json({
      isAuthenticated: true,
      nextRoute,
    });
  } catch (error) {
    console.error("POST_LOGIN_STATUS_ERROR", error);

    return NextResponse.json(
      {
        isAuthenticated: false,
        nextRoute: "/login",
        error: "Gagal memeriksa status login.",
      },
      { status: 500 },
    );
  }
}
