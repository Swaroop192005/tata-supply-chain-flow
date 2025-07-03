
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Part {
  id: string;
  part_no: string;
  description: string;
  category: string;
  unit_of_measure?: string;
  unit_rate?: number;
  opening_stock?: number;
  current_stock?: number;
  minimum_stock?: number;
  order_quantity?: number;
  created_at: string;
  updated_at: string;
}

export const useParts = () => {
  return useQuery({
    queryKey: ['parts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Part[];
    },
  });
};

export const useAddPart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (part: Omit<Part, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('parts')
        .insert([part])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Part added successfully!');
    },
    onError: (error) => {
      toast.error(`Error adding part: ${error.message}`);
    },
  });
};
