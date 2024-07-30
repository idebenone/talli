import { useEffect, useRef, useState } from "react";
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

  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useRef<boolean>(true);

  const [offset, setOffset] = useState<number>(0);
  const [eventBodyData, setEventBodyData] = useState<any[]>([]);
  const [isLast, setIsLast] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  const handleFetchEventBody = debounce(async () => {
    try {
      const response = await getEventBody(eventId, offset);
      console.log(response.data.reverse());
      if (response.data.length !== 0) {
        setEventBodyData((prev) => {
          const newData = [...response.data, ...prev];
          return newData;
        });
      } else {
        setIsLast(true);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later!");
    }
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
          const newData = [...prev, payload.payload];
          if (isScrolledToBottom.current && containerRef.current) {
            setTimeout(() => {
              containerRef.current!.scrollTop =
                containerRef.current!.scrollHeight;
            }, 0);
          }
          return newData;
        });
      })
      .subscribe();
    return () => {
      channel?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current && isInitialLoad) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [eventBodyData]);

  useEffect(() => {
    if (containerRef.current && isInitialLoad) {
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

  useEffect(() => {
    if (offset === 0 && eventBodyData.length > 0) {
      setIsInitialLoad(false);
    }
  }, [offset, eventBodyData]);

  return (
    <div
      className="overflow-auto h-[calc(100vh-16.5rem)] pr-2 mt-16"
      ref={containerRef}
    >
      <div className="flex flex-col item gap-6">
        {!isLast && (
          <span className="flex justify-center">
            <p
              className="px-3 cursor-pointer text-xs text-muted-foreground border border-muted rounded-xl"
              onClick={() => setOffset(offset + 10)}
            >
              load previous
            </p>
          </span>
        )}
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
    </div>
  );
};

export default EventBody;
