"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";

import { addInvitedUser } from "./actions";
import { userAtom } from "@/components/UserProfile";
import { toast } from "sonner";

export default function InvitePage() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const searchParams = useSearchParams();
  const eventId = searchParams.get("code");

  async function handleAddUser() {
    try {
      if (eventId) {
        await addInvitedUser({
          event_id: atob(eventId),
          user_id: user?.id,
          user_role: "user",
        });

        toast.success("Yay! You are a part of the cult now.");
      }
    } catch (error) {
      router.push("/invite/error");
    }
  }

  useEffect(() => {
    if (user && eventId) handleAddUser();
  }, [user, eventId]);

  return (
    <div className="h-full flex justify-center items-center">
      Verifying the invite link
    </div>
  );
}
