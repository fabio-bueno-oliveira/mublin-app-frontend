import { supabase } from '../lib/supabaseClient';

export async function fetchProjectRoles() {
  const { data, error } = await supabase
    .from('roles')
    .select('id, description_ptbr')
    .eq('applies_to_a_project', true);

  if (error) throw error;

  return data;
}
