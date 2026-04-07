"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoodCheckin } from "@/components/mood/MoodCheckin";

const queryClient = new QueryClient();

export default function MoodPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <MoodCheckin />
    </QueryClientProvider>
  );
}
