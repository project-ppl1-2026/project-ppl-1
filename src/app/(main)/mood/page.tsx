"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoodCheckin } from "@/components/mood/MoodCheckin";
import React from "react";

export default function MoodPage() {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MoodCheckin />
    </QueryClientProvider>
  );
}
