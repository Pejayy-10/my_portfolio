"use server";

import { supabase } from "@/lib/supabase";

export async function incrementViews() {
  // First get current views
  const { data: currentData } = await supabase
    .from("metrics")
    .select("views")
    .eq("id", 1)
    .single();
    
  if (currentData) {
    await supabase
      .from("metrics")
      .update({ views: currentData.views + 1 })
      .eq("id", 1);
  }
}

export async function getViews() {
  const { data, error } = await supabase
    .from("metrics")
    .select("views")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching views:", error);
    return 51; // Fallback
  }

  return data?.views || 51;
}
