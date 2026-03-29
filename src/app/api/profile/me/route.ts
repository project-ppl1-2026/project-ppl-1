import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = sessionResponse;

    const fullProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        birthYear: true,
        gender: true,
        parentEmail: true,
        profileFilled: true,
      },
    });

    if (!fullProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Auto-update Avatar dari Google jika user belum punya image
    if (!fullProfile.image) {
      const googleAccount = await prisma.account.findFirst({
        where: {
          userId: user.id,
          providerId: "google",
        },
        orderBy: { createdAt: "desc" },
      });

      if (googleAccount?.idToken) {
        try {
          const base64Url = googleAccount.idToken.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join(""),
          );
          const payload = JSON.parse(jsonPayload);

          if (payload.picture) {
            // Update db
            await prisma.user.update({
              where: { id: user.id },
              data: { image: payload.picture },
            });
            // Update current response object
            fullProfile.image = payload.picture;
          }
        } catch (e) {
          console.error("Gagal ekstrak gambar dari Google idToken:", e);
        }
      }
    }

    return NextResponse.json(fullProfile);
  } catch (error: unknown) {
    console.error("GET Profile Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
