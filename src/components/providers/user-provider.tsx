"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import { createClient } from "@/utils/supabase/client";
import { userAtom } from "@/utils/atoms";
import useOnlineStatus from "@/lib/hooks/useOnlineStatus";

export default function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const setUser = useSetAtom<any>(userAtom);

  async function getUserSession() {
    if (isOnline) {
      try {
        const supabase = createClient();
        const response = await supabase.auth.getUser();
        if (!response.data.user) {
          router.replace("/");
        } else {
          setUser(response.data.user);
        }
      } catch (error) {
        router.replace("/");
      }
    } else {
      router.push("/offline");
    }
  }

  useEffect(() => {
    getUserSession();
  }, [isOnline]);

  return <>{children}</>;
}
