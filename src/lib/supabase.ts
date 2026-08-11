import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan variables de entorno de Supabase. Creá un archivo .env.local en la raíz del " +
      "proyecto (podés copiar .env.example) y completá NEXT_PUBLIC_SUPABASE_URL y " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY con las credenciales del proyecto de Supabase.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
