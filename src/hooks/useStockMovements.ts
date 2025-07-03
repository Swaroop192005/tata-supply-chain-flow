
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StockMovement {
  id: string;
  part_id?: string;
  movement_type: string;
  quantity: number;
  reference_type?: string;
  reference_id?: string;
  movement_date: string;
  unit_rate?: number;
  remarks?: string;
  created_by?: string;
  created_at: string;
  parts?: {
    part_no: string;
    description: string;
  };
}

export const useStockMovements = () => {
  return useQuery({
    queryKey: ['stock_movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          *,
          parts (part_no, description)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as StockMovement[];
    },
  });
};

export const useAddStockMovement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (movement: Omit<StockMovement, 'id' | 'created_at' | 'parts'>) => {
      const { data, error } = await supabase
        .from('stock_movements')
        .insert([movement])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock_movements'] });
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Stock movement recorded successfully!');
    },
    onError: (error) => {
      toast.error(`Error recording movement: ${error.message}`);
    },
  });
};
