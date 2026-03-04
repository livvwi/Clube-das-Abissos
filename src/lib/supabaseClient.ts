import { createClient } from "@supabase/supabase-js";

declare var process: any;

// @ts-ignore - Handle mixed environment properties properly
const getEnvVar = (viteKey: string, nextKey: string, craKey: string) => {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
        return import.meta.env[viteKey];
    }
    if (typeof process !== 'undefined' && process.env) {
        if (process.env[nextKey]) return process.env[nextKey];
        if (process.env[craKey]) return process.env[craKey];
        if (process.env[viteKey]) return process.env[viteKey];
    }
    return undefined;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'REACT_APP_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'REACT_APP_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "Supabase env vars missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel."
    );
}

export const supabase = createClient(
    supabaseUrl || "https://placeholder-url.supabase.co",
    supabaseAnonKey || "placeholder-anon-key"
);
