import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import { createClient } from "@/utils/supabase/client";
import { userAtom } from "@/utils/atoms";
import useOnlineStatus from "@/lib/hooks/useOnlineStatus";

const useUserSession = () => {
  const setUser = useSetAtom<any>(userAtom);
  const router = useRouter();
  const isOnline = useOnlineStatus();

  useEffect(() => {
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

    getUserSession();
  }, [isOnline, router, setUser]);

  const updateUser = (newUser: any) => {
    setUser(newUser);
  };

  return { updateUser };
};

export default useUserSession;
