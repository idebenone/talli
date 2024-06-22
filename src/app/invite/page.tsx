"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAtomValue } from "jotai";

import { addInvitedUser } from "./actions";
import { userAtom } from "@/components/UserProfile";

export default function InvitePage() {
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
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (user) handleAddUser();
  }, [user, eventId]);
  return <>{atob(eventId!)}</>;
}
