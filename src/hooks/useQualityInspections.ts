
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QualityInspection {
  id: string;
  grr_part_id?: string;
  inspector_name: string;
  inspection_date: string;
  test_parameters?: string;
  test_results?: string;
  quality_status?: string;
  remarks?: string;
  created_at: string;
  grr_parts?: {
    challan_qty: number;
    parts?: {
      part_no: string;
      description: string;
    };
    grrs?: {
      grr_no: string;
    };
  };
}

export const useQualityInspections = () => {
  return useQuery({
    queryKey: ['quality_inspections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quality_inspections')
        .select(`
          *,
          grr_parts (
            challan_qty,
            parts (part_no, description),
            grrs (grr_no)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QualityInspection[];
    },
  });
};

export const useAddQualityInspection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (inspection: Omit<QualityInspection, 'id' | 'created_at' | 'grr_parts'>) => {
      const { data, error } = await supabase
        .from('quality_inspections')
        .insert([inspection])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quality_inspections'] });
      toast.success('Quality inspection recorded successfully!');
    },
    onError: (error) => {
      toast.error(`Error recording inspection: ${error.message}`);
    },
  });
};
