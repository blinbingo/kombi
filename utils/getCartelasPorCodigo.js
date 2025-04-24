
import { supabase } from './client';

export async function getCartelasPorCodigo(codigoSorteio) {
  const { data, error } = await supabase
    .from('cartelas')
    .select('*')
    .eq('codigoSorteio', codigoSorteio);

  if (error) {
    console.error('Erro ao buscar cartelas:', error);
    return [];
  }

  return data;
}
