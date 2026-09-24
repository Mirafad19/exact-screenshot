import { supabase } from "@/integrations/supabase/client";

export async function ensureProfile(userId: string, displayName = "") {
  const { error } = await supabase.from("profiles").upsert({ user_id: userId, display_name: displayName }, { onConflict: "user_id" });
  if (error) throw error;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("display_name").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data?.display_name ?? "";
}