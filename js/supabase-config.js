const SUPABASE_URL = "https://zrptkmjdltqdjzrpogyo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_KcWSkkO1L4z0U6UUfZijyw_KIJ_d5m7";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);