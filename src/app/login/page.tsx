"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  async function GoogleOAuth() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/events`,
      },
    });
  }

  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col gap-3">
        <p className="tracking-tighter text-5xl font-bold text-center mb-4">
          talli .
        </p>
        <Button onClick={GoogleOAuth}>Continue with Google</Button>
      </div>
    </div>
  );
}
