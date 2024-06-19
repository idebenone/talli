import { Button } from "@/components/ui/button";
import { Locate, MapPin, Pin, PlusCircle } from "lucide-react";
import Link from "next/link";

interface EventsProps {
  events: any[];
  setCreateEventState: (state: boolean) => void;
}

const Events: React.FC<EventsProps> = ({ events, setCreateEventState }) => {
  return (
    <>
      <div className="py-6 lg:py-12 flex justify-between items-center">
        <p className="text-xl font-semibold">Your Events</p>
        <Button
          className="flex gap-2 items-center bg-gradient-to-r from-fuchsia-500 to-cyan-500"
          onClick={() => setCreateEventState(true)}
        >
          <p>Create</p>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

      {events.length !== 0 && (
        <div className="flex flex-col gap-2">
          {events.map((event, index) => (
            <Link href={`/events/${event.event_id}`}>
              <div
                key={index}
                className="p-4 border rounded-md cursor-pointer hover:bg-muted transition-all duration-500"
              >
                <div className="flex justify-between items-center">
                  <p className="">{event.event_name}</p>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {event.event_location}
                    </p>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {event.event_description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {events.length === 0 && (
        <div className="py-36 flex justify-center items-center border border-dotted rounded-md">
          <p className="font-medium text-muted-foreground">No events found</p>
        </div>
      )}
    </>
  );
};

export default Events;
