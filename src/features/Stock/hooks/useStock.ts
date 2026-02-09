import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Stock } from '@/types';
 
export const useStock= () => {
  return useQuery({
    queryKey: ['order'],
    // Update return type to Promise<orders[]> (Array of orders)
    queryFn: async (): Promise<Stock[]> => {
      const { data } = await api.get(`/product`);
      // Ensure this actually returns an array. If backend wraps it, use data.result
      return data.result || []; 
    },
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
};

