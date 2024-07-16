import { Announcement } from "@/lib/types";
import Image from "next/image";

interface AnnouncementsProps {
  announcement: Announcement;
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcement }) => {
  return (
    <div className="p-4 flex flex-col gap-3 justify-center">
      {/* {announcement.an_content.gif && (
        <Image
          src={announcement.an_content.gif}
          alt="Gif"
          width="400"
          height="400"
          className="w-full h-[100px] object-contain object-center"
        />
      )}
      <p className="text-center text-xs tracking-tighter font-semibold text-muted-foreground">
        {announcement.an_content.content}
      </p> */}
    </div>
  );
};

export default Announcements;
