"use client";

import { useState } from "react";
import CreateEvent from "./_components/CreateEvent";
import Events from "./_components/Events";

const demoData = [
  {
    event_id: "asd76a86fa8s768asf876as",
    event_name: "Weekend Party",
    event_description:
      "Banni makkale party madana, kudidu kudidu marali sayana",
  },
  {
    event_id: "as78fas8a575gsaga785sga",
    event_name: "Birthday Party",
    event_description: "Samay Raina's birthday this weekend",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>(demoData);
  const [createEventState, setCreateEventState] = useState<boolean>(false);

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
