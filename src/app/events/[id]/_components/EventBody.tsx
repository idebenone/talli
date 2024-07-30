import { useEffect, useRef, useState, useTransition } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { EventChannelAtom, userAtom } from "@/utils/atoms";
import { debounce } from "lodash";

import { getEventBody } from "../../actions";
import { createClient } from "@/utils/supabase/client";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import Announcements from "./Announcements";
import SplitComponent from "./SplitComponent";
import PollComponent from "./PollComponent";

interface EventBodyProps {
  eventId: string;
}

const EventBody: React.FC<EventBodyProps> = ({ eventId }) => {
  const channel = useAtomValue(EventChannelAtom);
  const user = useAtomValue(userAtom);

  const setChannel = useSetAtom(EventChannelAtom);

  const [isPending, setTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useRef<boolean>(true);

  const [offset, setOffset] = useState<number>(0);
  const [eventBodyData, setEventBodyData] = useState<any[]>([]);

  const handleFetchEventBody = debounce(() => {
    setTransition(async () => {
      try {
        const response = await getEventBody(eventId, offset);
        console.log(response.data.reverse());
        setEventBodyData((prev) => {
          const newData = [...response.data, ...prev];
          return newData;
        });
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }, 1000);

  useEffect(() => {
    handleFetchEventBody();
  }, [offset]);

  useEffect(() => {
    const supabase = createClient();
    const _channel = supabase.channel(eventId, {
      config: {
        broadcast: {
          self: true,
        },
      },
    });
    setChannel(_channel);
    _channel
      .on("broadcast", { event: "notifications" }, (payload) => {
        setEventBodyData((prev) => {
          return [...prev, payload.payload];
        });
      })
      .subscribe();
    return () => {
      channel?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [eventBodyData]);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new MutationObserver(() => {
        if (isScrolledToBottom.current) {
          containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
        }
      });

      observer.observe(containerRef.current, {
        childList: true,
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div
      className="overflow-auto h-[calc(100vh-16.5rem)] pr-2 mt-16"
      ref={containerRef}
    >
      {!isPending ? (
        <div className="flex flex-col gap-6">
          <p
            className="text-center cursor-pointer text-xs text-muted-foreground"
            onClick={() => setOffset(offset + 10)}
          >
            load previous
          </p>
          {eventBodyData.map((event, index) => (
            <div key={index}>
              <div
                className={`flex ${
                  user?.id! === event.data.user_id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {event.type === "announcement" && (
                  <Announcements announcement={event} />
                )}
              </div>
              <div
                className={`flex ${
                  user?.id! === event.data.split_owner
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {event.type === "split" && <SplitComponent split={event} />}
              </div>
              <div
                className={`flex ${
                  user?.id! === event.data.poll_owner
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {event.type === "poll" && <PollComponent poll={event} />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Skeleton className="h-[500px] w-full" />
      )}
    </div>
  );
};

export default EventBody;
