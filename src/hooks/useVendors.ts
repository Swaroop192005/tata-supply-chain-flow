
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Vendor {
  id: string;
  vendor_code: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  payment_terms?: string;
  rating?: number;
  status?: string;
  created_at: string;
  updated_at: string;
}

export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Vendor[];
    },
  });
};

export const useAddVendor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendor])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success('Vendor added successfully!');
    },
    onError: (error) => {
      toast.error(`Error adding vendor: ${error.message}`);
    },
  });
};
