import { useEffect, useState, useTransition } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms";

import { getEventBody } from "../../actions";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import Announcements from "./Announcements";
import SplitComponent from "./SplitComponent";

interface EventBodyProps {
  eventId: string;
}

const EventBody: React.FC<EventBodyProps> = ({ eventId }) => {
  const user = useAtomValue(userAtom);
  const [isPending, setTransition] = useTransition();
  const [eventBodyData, setEventBodyData] = useState<any[]>([]);

  function handleFetchEventBody() {
    setTransition(async () => {
      try {
        const response = await getEventBody(eventId);
        console.log(response);
        const data = response.data[0];

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

        const combinedData = [...announcements, ...polls, ...splits].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );

        setEventBodyData(combinedData);
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }

  useEffect(() => {
    handleFetchEventBody();
  }, []);

  return (
    <>
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
    </>
  );
};

export default EventBody;
