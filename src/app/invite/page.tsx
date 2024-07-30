"use client";

import { useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";

import { addInvitedUser } from "./actions";
import { toast } from "sonner";
import { userAtom } from "@/utils/atoms";
import { Button } from "@/components/ui/button";

export default function InvitePage() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  async function handleAddUser() {
    try {
      if (code && user) {
        await addInvitedUser({
          event_id: JSON.parse(atob(code)).event_id,
          user_id: user.id,
          user_role: "user",
        });

        toast.success("Yay! You are a part of the cult now.");
      }
    } catch (error) {
      router.push("/invite/error");
    }
  }

  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <p className="text-muted-foreground text-xs">You are about to join</p>
        <p className="text-5xl font-bold">
          {JSON.parse(atob(code!)).event_name}
        </p>
        <div className="mt-4 flex gap-4 justify-center">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleAddUser}>Join</Button>
        </div>
      </div>
    </div>
  );
}
