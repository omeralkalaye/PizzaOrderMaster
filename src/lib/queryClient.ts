import { QueryClient } from "@tanstack/react-query";
import { mockCategories, mockMenuItems } from "@/data/menu-data";

// Mock API functions
export async function fetchCategories() {
  return mockCategories;
}

export async function fetchMenuItems(categoryId?: number) {
  if (categoryId) {
    return mockMenuItems.filter(item => item.categoryId === categoryId);
  }
  return mockMenuItems;
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