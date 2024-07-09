"use client";

import useOnlineStatus from "@/lib/hooks/useOnlineStatus";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OfflinePage() {
  const isOnline = useOnlineStatus();
  const router = useRouter();

  useEffect(() => {
    if (isOnline) {
      router.back();
    }
  }, [isOnline]);

  return (
    <div className="h-full flex justify-center items-center">
      <p>Thambi! You are offline da...</p>
    </div>
  );
}
