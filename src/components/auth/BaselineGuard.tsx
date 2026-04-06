"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { PageLoader } from "@/components/ui/page-loader";

interface BaselineGuardProps {
  shouldRedirect: boolean;
}

export function BaselineGuard({ shouldRedirect }: BaselineGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isOnBaselinePage = pathname === "/baseline";

  useEffect(() => {
    if (shouldRedirect && !isOnBaselinePage) {
      router.replace("/baseline");
    }
  }, [shouldRedirect, isOnBaselinePage, router]);

  if (shouldRedirect && !isOnBaselinePage) {
    return <PageLoader message="Mengarahkan ke baseline..." fullscreen />;
  }

  return null;
}
