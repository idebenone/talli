import { useEffect, useRef, useState, useTransition } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { EventChannelAtom, userAtom } from "@/utils/atoms";

import { getEventBody } from "../../actions";
import { createClient } from "@/utils/supabase/client";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import Announcements from "./Announcements";
import SplitComponent from "./SplitComponent";

interface EventBodyProps {
  eventId: string;
}

const transformEventData = (data: any) => {
  const announcements = data.announcements
    ? data.announcements.map((item: any) => ({
        ...item.announcement,
        owner: item.owner[0],
        type: "announcement",
        createdAt: new Date(item.announcement.created_at),
      }))
    : [];

  const polls = data.polls
    ? data.polls.map((item: any) => ({
        ...item.poll,
        choices: item.choices,
        type: "poll",
        createdAt: new Date(item.poll.created_at),
      }))
    : [];

  const splits = data.splits
    ? data.splits.map((item: any) => ({
        ...item.split,
        owner: item.owner[0],
        split_users: item.split_users,
        type: "split",
        createdAt: new Date(item.split.created_at),
      }))
    : [];

  return [...announcements, ...polls, ...splits].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
};

const EventBody: React.FC<EventBodyProps> = ({ eventId }) => {
  const channel = useAtomValue(EventChannelAtom);
  const user = useAtomValue(userAtom);

  const setChannel = useSetAtom(EventChannelAtom);

  const [isPending, setTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useRef<boolean>(true);

  const [eventBodyData, setEventBodyData] = useState<any[]>([]);

  function handleFetchEventBody() {
    setTransition(async () => {
      try {
        const response = await getEventBody(eventId);
        const data = response.data[0];
        const combinedData = transformEventData(data);
        setEventBodyData(combinedData);
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }

  useEffect(() => {
    handleFetchEventBody();
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
        setEventBodyData((prev) => [...prev, payload.payload]);
      })
      .subscribe();
    return () => {
      channel?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (containerRef.current && isScrolledToBottom.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [eventBodyData]);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new MutationObserver(() => {
        containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
        isScrolledToBottom.current = true;
      });

      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div
      className="overflow-auto h-[calc(100vh-17rem)] pr-2"
      ref={containerRef}
    >
      {!isPending ? (
        <div className="flex flex-col gap-6">
          {eventBodyData.map((event, index) => (
            <div key={index}>
              {event.type === "announcement" && (
                <Announcements announcement={event} />
              )}

              <div
                className={`flex ${
                  user?.id! === event.split_owner
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {event.type === "split" && <SplitComponent split={event} />}
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
