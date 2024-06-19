"use client";

import { useEffect, useState } from "react";
import Events from "./_components/Events";
import axios from "axios";
import { toast } from "sonner";
import { useAtomValue } from "jotai";

import CreateEvent from "./_components/CreateEvent";
import { userAtom } from "@/components/UserProfile";

export default function EventsPage() {
  const user = useAtomValue(userAtom);
  const [events, setEvents] = useState<any[]>([]);
  const [createEventState, setCreateEventState] = useState<boolean>(false);

  async function handleFetchEvents() {
    try {
      if (user) {
        const response = await axios.get(`/api/events?id=${user?.id}`);
        setEvents(response.data);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later");
    }
  }
  useEffect(() => {
    handleFetchEvents();
  }, [user]);

  return (
    <div className="h-full flex justify-center">
      <div className="p-2 w-full sm:w-3/4 lg:w-2/5">
        {!createEventState && (
          <Events events={events} setCreateEventState={setCreateEventState} />
        )}

        {createEventState && (
          <CreateEvent setCreateEventState={setCreateEventState} />
        )}
      </div>
    </div>
  );
}
