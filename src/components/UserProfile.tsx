"use client";

import { atom, useSetAtom } from "jotai";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export const userAtom = atom<User | null>(null);

export default function UserProfile() {
  const setUser = useSetAtom<any>(userAtom);

  async function getUserSession() {
    const supabase = createClient();
    const response = await supabase.auth.getUser();
    setUser(response.data.user);
  }

  useEffect(() => {
    getUserSession();
  }, []);

  return <></>;
}
