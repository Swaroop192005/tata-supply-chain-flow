
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MIR {
  id: string;
  mir_no: string;
  date: string;
  department: string;
  requested_by: string;
  status?: string;
  total_value?: number;
  purpose?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  mir_parts?: Array<{
    qty_issued: number;
    unit_rate?: number;
    parts?: {
      part_no: string;
      description: string;
    };
  }>;
}

export const useMIRs = () => {
  return useQuery({
    queryKey: ['mirs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mirs')
        .select(`
          *,
          mir_parts (
            qty_issued,
            unit_rate,
            parts (part_no, description)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MIR[];
    },
  });
};

export const useAddMIR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (mir: Omit<MIR, 'id' | 'created_at' | 'updated_at' | 'mir_parts'>) => {
      const { data, error } = await supabase
        .from('mirs')
        .insert([mir])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mirs'] });
      toast.success('MIR created successfully!');
    },
    onError: (error) => {
      toast.error(`Error creating MIR: ${error.message}`);
    },
  });
};

export const useUpdateMIR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<MIR>) => {
      const { data, error } = await supabase
        .from('mirs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mirs'] });
      toast.success('MIR updated successfully!');
    },
    onError: (error) => {
      toast.error(`Error updating MIR: ${error.message}`);
    },
  });
};
