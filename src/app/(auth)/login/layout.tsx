import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getPostLoginRedirect } from "@/lib/get-post-login-redirect";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (userId) {
    const nextRoute = await getPostLoginRedirect(userId);
    redirect(nextRoute);
  }

  return <>{children}</>;
}
