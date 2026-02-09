import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useStock } from "./useStock";
import type { Stock } from "@/types";
   
export const useAddStock = () => {
  const { refetch } = useStock();
  
  return useMutation({
    mutationFn: async (data: Stock) => {    
      const res = await api.post('/product', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("تمت إضافة السلعة بنجاح!");
      refetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(msg);
    },
  });
};

export const useDeleteStock = () => {
  const { refetch } = useStock();
  
  return useMutation({
    mutationFn: async (id: string) => {    
      const res = await api.delete(`/product/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("تم حذف السلعة بنجاح!");
      refetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(msg);
    },
  });
};

export const useUpdateStock = () => {
  const { refetch } = useStock(); 

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Stock }) => {    
      const res = await api.put(`/product/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("تم تحديث السلعة بنجاح!");
      refetch(); 
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(msg);
    },
  });
};