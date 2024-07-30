"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";

import { getEvents } from "./actions";
import { Event } from "@/lib/types";
import { userAtom } from "@/utils/atoms";

import { Button } from "@/components/ui/button";
import { Link2, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function EventsPage() {
  const user = useAtomValue(userAtom);
  const [events, setEvents] = useState<Event[]>([]);
  const [isPending, setTransition] = useTransition();

  function handleFetchEvents() {
    if (!user) return;
    setTransition(async () => {
      try {
        const response = await getEvents(user.id);
        setEvents(
          response.data?.map((record) => record.events).flat() as Event[]
        );
      } catch (error) {
        toast.error("Something went wrong. Please try again later");
      }
    });
  }

  function handleCopyEventLink(
    event: React.MouseEvent,
    event_id: string,
    event_name: string
  ) {
    event.preventDefault();
    const data = { event_id, event_name };
    const encoded = btoa(JSON.stringify(data));
    navigator.clipboard
      .writeText(`${location.origin}/invite?code=${encoded}`)
      .then(() => {
        toast.success("Invite link has been copied!");
      })
      .catch(() => {
        toast.error("Failed to copy invite link");
      });
  }

  useEffect(() => {
    if (user) handleFetchEvents();
  }, [user]);

  return (
    <div className="h-full flex justify-center">
      <div className="p-2 w-full lg:w-4/5 xl:w-3/5">
        <div className="py-6 lg:py-12 flex justify-between items-center">
          <p className="text-xl font-semibold">Your Events</p>

          <Link href="/events/new">
            <Button className="flex gap-2 items-center bg-gradient-to-r from-fuchsia-500 to-cyan-500">
              <p>Create</p>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isPending && <Skeleton className="w-full py-36" />}

        {!isPending && events.length > 0 && (
          <div className="flex flex-col gap-2">
            {events.map((event, index) => (
              <Link href={`/events/${event.event_id}`} key={index}>
                <div className="p-4 border cursor-pointer hover:bg-muted transition-all duration-500 group">
                  <div className="flex justify-between items-center">
                    <p>{event.event_name}</p>
                    <Link2
                      className="h-4 w-4 text-muted-foreground cursor-pointer hidden group-hover:block"
                      onClick={(e) =>
                        handleCopyEventLink(e, event.event_id, event.event_name)
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {event.event_description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isPending && events.length === 0 && (
          <div className="py-36 flex justify-center items-center">
            <p className="font-medium text-muted-foreground">No events found</p>
          </div>
        )}
      </div>
    </div>
  );
}
