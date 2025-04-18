import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://drdwoahsiksqimagdnpn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZHdvYWhzaWtzcWltYWdkbnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODQ1NTIsImV4cCI6MjA2MDU2MDU1Mn0.zrrrvZRRwrwBUnFTXI_s1HBLljWyD5fqL3Rh2386a-o';

export const supabase = createClient(supabaseUrl, supabaseKey);
