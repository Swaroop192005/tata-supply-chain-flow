
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Part } from './useParts';

export const useUpdatePart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Part>) => {
      const { data, error } = await supabase
        .from('parts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Part updated successfully!');
    },
    onError: (error) => {
      toast.error(`Error updating part: ${error.message}`);
    },
  });
};
