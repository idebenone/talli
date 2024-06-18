"use client";

import { useSearchParams } from "next/navigation";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event_id");
  return <>{eventId}</>;
}
