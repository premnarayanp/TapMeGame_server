import { createClient } from '@supabase/supabase-js';

//const supabaseUrl = 'https://gypigebhozwzeclgtluk.supabase.co'
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey)


