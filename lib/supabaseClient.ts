import { createClient } from "@supabase/supabase-js";

// 브라우저(클라이언트) 전용 anon key 클라이언트 — RLS가 적용되며, 서명된 업로드 URL로
// Storage에 이미지를 직접 업로드할 때만 사용할 것. service role key와 절대 혼용하지 말 것
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
