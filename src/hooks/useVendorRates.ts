
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VendorRate {
  id: string;
  vendor_id?: string;
  part_id?: string;
  rate: number;
  effective_from: string;
  effective_to?: string;
  is_active?: boolean;
  created_at: string;
  vendors?: {
    name: string;
    vendor_code: string;
  };
  parts?: {
    part_no: string;
    description: string;
  };
}

export const useVendorRates = () => {
  return useQuery({
    queryKey: ['vendor_rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_rates')
        .select(`
          *,
          vendors (name, vendor_code),
          parts (part_no, description)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as VendorRate[];
    },
  });
};

export const useAddVendorRate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rate: Omit<VendorRate, 'id' | 'created_at' | 'vendors' | 'parts'>) => {
      const { data, error } = await supabase
        .from('vendor_rates')
        .insert([rate])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor_rates'] });
      toast.success('Vendor rate added successfully!');
    },
    onError: (error) => {
      toast.error(`Error adding rate: ${error.message}`);
    },
  });
};
