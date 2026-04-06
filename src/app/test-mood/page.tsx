"use client";

import { MoodCheckin } from "@/components/mood/MoodCheckin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function TestMoodPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <MoodCheckin />
      </div>
    </QueryClientProvider>
  );
}
