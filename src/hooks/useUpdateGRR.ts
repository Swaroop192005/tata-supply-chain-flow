
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GRR } from './useGRRs';

export const useUpdateGRR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<GRR>) => {
      const { data, error } = await supabase
        .from('grrs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grrs'] });
      toast.success('GRR updated successfully!');
    },
    onError: (error) => {
      toast.error(`Error updating GRR: ${error.message}`);
    },
  });
};
