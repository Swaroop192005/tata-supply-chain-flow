
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ReorderLevel {
  id: string;
  part_id?: string;
  reorder_level: number;
  max_stock_level?: number;
  lead_time_days?: number;
  created_at: string;
  updated_at: string;
  parts?: {
    part_no: string;
    description: string;
    current_stock?: number;
  };
}

export const useReorderLevels = () => {
  return useQuery({
    queryKey: ['reorder_levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reorder_levels')
        .select(`
          *,
          parts (part_no, description, current_stock)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ReorderLevel[];
    },
  });
};

export const useAddReorderLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (level: Omit<ReorderLevel, 'id' | 'created_at' | 'updated_at' | 'parts'>) => {
      const { data, error } = await supabase
        .from('reorder_levels')
        .insert([level])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reorder_levels'] });
      toast.success('Reorder level set successfully!');
    },
    onError: (error) => {
      toast.error(`Error setting reorder level: ${error.message}`);
    },
  });
};
