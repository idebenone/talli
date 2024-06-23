"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAtomValue } from "jotai";

import { userAtom } from "@/components/UserProfile";
import CreateEvent from "./_components/CreateEvent";
import EventsList from "./_components/EventsList";

import { getEvents } from "./actions";
import { Event } from "@/lib/types";

export default function EventsPage() {
  const user = useAtomValue(userAtom);
  const [events, setEvents] = useState<Event[]>([]);
  const [createEventState, setCreateEventState] = useState<boolean>(false);

  async function handleFetchEvents() {
    try {
      if (user) {
        const response = await getEvents(user?.id);
        setEvents(response!);
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
          <EventsList
            events={events}
            setCreateEventState={setCreateEventState}
          />
        )}

        {createEventState && (
          <CreateEvent setCreateEventState={setCreateEventState} />
        )}
      </div>
    </div>
  );
}
