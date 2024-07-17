"use client";

import { useEffect, useState, useTransition } from "react";
import { useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";

import { userAtom } from "@/utils/atoms";
import useUserSession from "@/lib/hooks/useUserSession";
import { createClient } from "@/utils/supabase/client";

import { Skeleton } from "../ui/skeleton";
import Spinner from "../ui/spinner";
import { toast } from "sonner";

import { NavItems } from "./nav-items";
import { UserNavItems } from "./user-nav-items";
import { UserProfile } from "./user-profile";
import { SignInButton } from "./signin-button";

export default function Nav() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const pathname = usePathname();
  const { updateUser } = useUserSession();
  const [isPending, setTransition] = useTransition();
  const [userLoading, setUserTransition] = useTransition();

  const [signinLoading, setSigninLoading] = useState<boolean>(false);

  async function GoogleOAuth() {
    try {
      setSigninLoading(true);
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=/events`,
        },
      });
    } catch (error) {
      setSigninLoading(false);
    }
  }

  function SignOut() {
    setTransition(async () => {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
        toast.success("Successfully logged out");
        router.push("/");
        updateUser(null);
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }

  useEffect(() => {
    setUserTransition(() => {});
  }, [user]);

  return (
    <div className="absolute w-full bottom-2">
      <div className="flex justify-center">
        <div className="p-2 backdrop-blur-sm flex justify-between items-center w-full sm:w-3/4 lg:w-2/5 border">
          {!userLoading ? (
            <>
              <div className="flex gap-3">
                <NavItems pathname={pathname} />
                <UserNavItems pathname={pathname} />
              </div>
              {!isPending ? (
                !user ? (
                  <SignInButton onClick={GoogleOAuth} loading={signinLoading} />
                ) : (
                  <UserProfile user={user} onSignOut={SignOut} />
                )
              ) : (
                <Spinner />
              )}
            </>
          ) : (
            <Skeleton className="w-full h-8" />
          )}
        </div>
      </div>
    </div>
  );
}
