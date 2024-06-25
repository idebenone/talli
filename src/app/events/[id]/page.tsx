"use client";

import { useEffect, useState } from "react";

import { getEvent } from "../actions";
import { CountDown, Event } from "@/lib/types";

import CountDownComponent from "./_components/CountDownComponent";
import EventHeader from "./_components/EventHeader";

export default function EventPage({ params }: { params: { id: string } }) {
  const [eventDetails, setEventDetails] = useState<Event | null>();
  const [countDownDetails, setCountDownDetails] = useState<CountDown>();

  async function getEventDetails() {
    const response = await getEvent(params.id);
    console.log(response);
    setEventDetails(response![0]);
    setCountDownDetails(response![0].countdown![0]);
  }

  useEffect(() => {
    getEventDetails();
  }, []);

  return (
    <div className="h-full flex justify-center">
      {eventDetails && (
        <div className="p-2 w-full sm:w-3/4 lg:w-2/5">
          <EventHeader eventDetails={eventDetails} />
          <div className="overflow-auto">
            {countDownDetails && (
              <CountDownComponent countdown={countDownDetails} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
