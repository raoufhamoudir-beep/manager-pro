import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useStock } from "@/features/Stock/hooks/useStock";
import type { order, postorder } from "@/types";
import { useOrders } from "./useOrders";
   
export const useAddOrder = () => {
  const { refetch } = useStock();
  const { refetch: orderrefetch } = useOrders();
  
  return useMutation({
    mutationFn: async (data: postorder) => {    
      const res = await api.post('/logs', data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      const isReturn = variables.log.type === "Income";
      toast.success(isReturn ? "تمت عملية الإرجاع بنجاح!" : "تمت عملية الإرسال بنجاح!");
      refetch();
      orderrefetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(msg);
    },
  });
};

export const useDeleteOrder = () => {
  const { refetch } = useStock();
  const { refetch: orderrefetch } = useOrders();

  return useMutation({
    mutationFn: async (id: string) => {    
      const res = await api.delete(`/logs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("تم حذف العملية بنجاح!");
      refetch();
      orderrefetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(msg);
    },
  });
};

export const useUpdateOrder = () => {
  const { refetch } = useStock(); 
  const { refetch: orderrefetch } = useOrders();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: order }) => {    
      const res = await api.put(`/logs/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("تم تحديث العملية بنجاح!");
      refetch(); 
      orderrefetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "حدث خطأ ما";
      toast.error(msg);
    },
  });
};