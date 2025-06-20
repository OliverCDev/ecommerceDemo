
import { supabase } from '@/lib/supabaseClient';
import { handleSupabaseError } from '@/contexts/data/utils';

export const fetchCustomersFromSupabase = async (profile, toast) => {
  if (profile?.role !== 'admin') {
    return [];
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('full_name', { ascending: true });
  if (error) {
    handleSupabaseError(error, "No se pudieron cargar los clientes", toast);
    return [];
  }
  return data.map(c => ({
    id: c.id,
    name: c.full_name,
    email: c.email,
    createdAt: c.created_at,
  }));
};
