
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PurchaseOrder {
  id: string;
  po_no: string;
  po_date: string;
  vendor_id?: string;
  total_amount?: number;
  status?: string;
  delivery_date?: string;
  terms_conditions?: string;
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  vendors?: {
    name: string;
  };
  po_items?: Array<{
    quantity: number;
    unit_rate?: number;
    total_amount?: number;
    parts?: {
      part_no: string;
      description: string;
    };
  }>;
}

export const usePurchaseOrders = () => {
  return useQuery({
    queryKey: ['purchase_orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          vendors (name),
          po_items (
            quantity,
            unit_rate,
            total_amount,
            parts (part_no, description)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PurchaseOrder[];
    },
  });
};

export const useAddPurchaseOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (po: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at' | 'vendors' | 'po_items'>) => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert([po])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase_orders'] });
      toast.success('Purchase Order created successfully!');
    },
    onError: (error) => {
      toast.error(`Error creating PO: ${error.message}`);
    },
  });
};
