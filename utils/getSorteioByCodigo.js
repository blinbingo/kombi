import { supabase } from './client';

export async function getSorteioByCodigo(codigo) {
  const { data, error } = await supabase
    .from('bingo')
    .select('*')
    .eq('codigo', codigo)
    .single();

  if (error) {
    console.error('Erro ao buscar sorteio:', error);
    return null;
  }

  return data;
}
