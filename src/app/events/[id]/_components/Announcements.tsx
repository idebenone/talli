/* eslint-disable @next/next/no-img-element */
import { Announcement } from "@/lib/types";
import { convertToTime } from "@/lib/utils";
import { userAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";

interface AnnouncementsProps {
  announcement: Announcement;
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcement }) => {
  const user = useAtomValue(userAtom);

  return (
    <div
      className={`flex flex-col gap-1  ${
        user?.id! === announcement.data.user_id ? "items-end" : ""
      }`}
    >
      <p className="text-[9px] text-muted-foreground">
        {convertToTime(announcement.created_at.toString())}
      </p>

      <div
        className={`flex gap-2 ${
          user?.id! === announcement.data.user_id ? "flex-row-reverse" : ""
        }`}
      >
        <img
          src={announcement.owner.avatar_url}
          alt={announcement.owner.name}
          width="400"
          height="400"
          className="h-8 w-8"
        />

        <div className="flex gap-2">
          {announcement.data.an_content.gif && (
            <img
              src={announcement.data.an_content.gif}
              alt="Gif"
              width="400"
              height="400"
              className=" w-fit h-[100px] object-contain object-center"
            />
          )}

          <span className=" max-w-[300px] bg-gradient-to-b from-muted to-transparent p-2 text-center text-xs tracking-tighter font-semibold text-muted-foreground">
            {announcement.data.an_content.content}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
