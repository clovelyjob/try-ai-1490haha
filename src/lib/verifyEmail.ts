import { supabase } from "@/integrations/supabase/client";

export async function verifyEmailExists(email: string): Promise<{ valid: boolean; reason?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("verify-email", {
      body: { email },
    });

    if (error) {
      console.error("Email verification error:", error);
      return { valid: true }; // Fail open
    }

    return data as { valid: boolean; reason?: string };
  } catch {
    return { valid: true }; // Fail open
  }
}
