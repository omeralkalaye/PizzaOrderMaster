import { QueryClient } from "@tanstack/react-query";

// Simplified fetch wrapper for mock data
export async function apiRequest<T>(url: string): Promise<T> {
  // In a real app, this would make actual API calls
  // For now, we'll return mock data
  return Promise.resolve({} as T);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});