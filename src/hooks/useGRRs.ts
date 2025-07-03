
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GRR {
  id: string;
  grr_no: string;
  challan_date: string;
  transporter_name: string;
  po_reference: string;
  vendor_id?: string;
  status?: string;
  total_value?: number;
  remarks?: string;
  created_at: string;
  updated_at: string;
  vendors?: {
    name: string;
  };
  grr_parts?: Array<{
    challan_qty: number;
    accepted_qty?: number;
    rejected_qty?: number;
    parts?: {
      part_no: string;
      description: string;
    };
  }>;
}

export const useGRRs = () => {
  return useQuery({
    queryKey: ['grrs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grrs')
        .select(`
          *,
          vendors (name),
          grr_parts (
            challan_qty,
            accepted_qty,
            rejected_qty,
            parts (part_no, description)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GRR[];
    },
  });
};

export const useAddGRR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (grr: Omit<GRR, 'id' | 'created_at' | 'updated_at' | 'vendors' | 'grr_parts'>) => {
      const { data, error } = await supabase
        .from('grrs')
        .insert([grr])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grrs'] });
      toast.success('GRR created successfully!');
    },
    onError: (error) => {
      toast.error(`Error creating GRR: ${error.message}`);
    },
  });
};
