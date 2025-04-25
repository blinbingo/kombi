// /utils/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Usa as variáveis de ambiente do projeto
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cria a instância do supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
