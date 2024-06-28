"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

import { addInvitedUser } from "./actions";
import { userAtom } from "@/components/UserProfile";
import { toast } from "sonner";

export default function InvitePage() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const searchParams = useSearchParams();
  const eventId = searchParams.get("code");

  const handleAddUser = useCallback(
    debounce(async () => {
      try {
        if (eventId && user) {
          await addInvitedUser({
            event_id: atob(eventId),
            user_id: user.id,
            user_role: "user",
          });

          toast.success("Yay! You are a part of the cult now.");
        }
      } catch (error) {
        router.push("/invite/error");
      }
    }, 5000),
    [eventId, user, router]
  );

  useEffect(() => {
    if (user && eventId) handleAddUser();
    return () => {
      handleAddUser.cancel();
    };
  }, [user, eventId, handleAddUser]);

  return (
    <div className="h-full flex justify-center items-center">
      Verifying the invite link
    </div>
  );
}
