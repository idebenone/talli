"use client";

import { useEffect, useState, useTransition } from "react";
import { useAtomValue } from "jotai";

import { getEvent } from "../actions";
import { userAtom } from "@/utils/atoms";
import { Event } from "@/lib/types";

import CountDownComponent from "./_components/CountDownComponent";
import EditEvent from "./_components/EditEvent";
import EventHeader from "./_components/EventHeader";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import AnnouncementInput from "./_components/AnnouncementInput";
import EventBody from "./_components/EventBody";

export default function EventPage({ params }: { params: { id: string } }) {
  const user = useAtomValue(userAtom);
  const [isPending, startTransition] = useTransition();
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const [editEvent, setEditEvent] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<boolean>(false);

  async function getEventDetails() {
    startTransition(async () => {
      try {
        const response = await getEvent(params.id, user?.id!);
        setEventDetails(
          response.data?.map((record) => record.events).flat()[0]
        );
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }

  useEffect(() => {
    if (params.id && user?.id) getEventDetails();
  }, [params.id, user?.id]);

  return (
    <div className="h-full flex justify-center">
      <div className="p-2 w-full flex flex-col gap-4 sm:w-3/4 lg:w-2/5">
        {!isPending && eventDetails && (
          <>
            <EventHeader
              eventDetails={eventDetails}
              setEditEvent={() => setEditEvent(true)}
              setAnnouncement={() => setAnnouncement(!announcement)}
            />

            {!editEvent ? (
              <div className="overflow-auto pr-2 pb-16">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 sticky top-0 bg-background z-10">
                    {eventDetails.event_owner === user?.id && announcement && (
                      <AnnouncementInput
                        event_id={eventDetails.event_id}
                        setAnnouncement={() => setAnnouncement(!announcement)}
                      />
                    )}
                    {eventDetails.event_target && (
                      <CountDownComponent
                        event_target={eventDetails.event_target}
                        event_theme={eventDetails.event_theme}
                      />
                    )}
                  </div>

                  <EventBody eventId={eventDetails.event_id} />
                </div>
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
        )}

        {isPending && (
          <>
            <Skeleton className="h-[100px] w-full" />
          </>
        )}
      </div>
    </div>
  );
}
