"use client";

import { useEffect, useState, useTransition } from "react";

import { getEvent } from "../actions";
import { Event } from "@/lib/types";

import CountDownComponent from "./_components/CountDownComponent";
import EventHeader from "./_components/EventHeader";
import EditEvent from "./_components/EditEvent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventPage({ params }: { params: { id: string } }) {
  const [isPending, startTransition] = useTransition();
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const [editEvent, setEditEvent] = useState<boolean>(false);

  async function getEventDetails() {
    startTransition(async () => {
      try {
        const response = await getEvent(params.id);
        setEventDetails(response![0]);
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }

  useEffect(() => {
    getEventDetails();
  }, []);

  return (
    <div className="h-full flex justify-center">
      <div className="p-2 w-full flex flex-col gap-4 sm:w-3/4 lg:w-2/5">
        {!isPending &&
          (eventDetails ? (
            <>
              <EventHeader
                eventDetails={eventDetails}
                setEditEvent={() => setEditEvent(true)}
              />

              {!editEvent ? (
                <div className="overflow-auto">
                  {eventDetails.event_target && (
                    <CountDownComponent
                      event_target={eventDetails.event_target}
                    />
                  )}
                </div>
              ) : (
                <EditEvent
                  event={eventDetails}
                  setEditEvent={() => {
                    setEditEvent(false);
                    getEventDetails();
                  }}
                />
              )}
            </>
          ) : (
            <div className="h-full flex flex-col gap-4 items-center justify-center">
              <p>You are at the wrong place my guy!</p>
              <Link href="/">
                <Button>Go home</Button>
              </Link>
            </div>
          ))}

        {isPending && (
          <>
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-full w-full" />
          </>
        )}
      </div>
    </div>
  );
}
