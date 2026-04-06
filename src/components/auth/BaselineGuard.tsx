"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

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

  return null;
}
