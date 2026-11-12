"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../ui/sonner";
import { TooltipProvider } from "../ui/tooltip";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}

        {/* Without this, every toast() in the app is silently dropped. */}
        <Toaster position="top-center" richColors />

        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
