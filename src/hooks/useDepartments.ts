
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Department {
  id: string;
  dept_code: string;
  dept_name: string;
  head_of_dept?: string;
  cost_center?: string;
  is_active?: boolean;
  created_at: string;
}

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('dept_name', { ascending: true });
      
      if (error) throw error;
      return data as Department[];
    },
  });
};

export const useAddDepartment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dept: Omit<Department, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('departments')
        .insert([dept])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department added successfully!');
    },
    onError: (error) => {
      toast.error(`Error adding department: ${error.message}`);
    },
  });
};
