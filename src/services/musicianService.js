import { supabase } from '../lib/supabaseClient';

export async function getTrendingMusicians(limit = 3) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, 
        full_name, 
        username, 
        avatar, 
        profile_roles!inner (
          main_activity,
          roles (
            name_ptbr
          )
        )
      `)
      // Filtramos para trazer apenas o papel marcado como atividade principal
      .eq('profile_roles.main_activity', true) 
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    // Mapeamento dos dados para o formato que o componente MusicianMiniCard espera
    const formattedData = data.map(profile => ({
      id: profile.id,
      name: profile.full_name,
      username: profile.username,
      avatar: profile.avatar,
      mainRole: profile.profile_roles?.[0]?.roles?.name_ptbr || 'Músico'
    }));

    // Randomização para manter o feed dinâmico
    const shuffled = [...formattedData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
    
  } catch (error) {
    console.error('Erro ao buscar trending musicians:', error);
    return [];
  }
}