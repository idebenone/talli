import { ChangeEvent, useCallback, useState, useTransition } from "react";
import { useAtomValue } from "jotai";
import { EventChannelAtom, userAtom } from "@/utils/atoms";

import { Button } from "@/components/ui/button";
import { Sticker, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createAnnouncement } from "../../actions";
import Spinner from "@/components/ui/spinner";
import GifPickerDialog from "./GifPickerDialog";
import { TenorImage } from "gif-picker-react";
import Image from "next/image";
import { Announcement } from "@/lib/types";

interface CreateAnnouncement {
  content: string;
  gif: string;
}

interface AnnouncementInputProps {
  event_id: string;
  setAnnouncement: () => void;
}

const AnnouncementInput: React.FC<AnnouncementInputProps> = ({
  event_id,
  setAnnouncement,
}) => {
  const channel = useAtomValue(EventChannelAtom);
  const user = useAtomValue(userAtom);

  const [isPending, startTransition] = useTransition();

  const [an, setAn] = useState<CreateAnnouncement>({ content: "", gif: "" });
  const [gifPickerState, setGifPickerState] = useState<boolean>(false);

  const setContent = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setAn((prev) => ({ ...prev, content: event.target.value }));
  }, []);

  const setGifUrl = useCallback((tenorImage: TenorImage) => {
    setAn((prev) => ({ ...prev, gif: tenorImage.url }));
  }, []);

  const clearGif = useCallback(() => {
    setAn((prev) => ({ ...prev, gif: "" }));
  }, []);

  const handleGifPickerToggle = useCallback(() => {
    setGifPickerState((prev) => !prev);
  }, []);

  const handleAnnouncementClose = useCallback(() => {
    setAnnouncement();
  }, [setAnnouncement]);

  const submitAnnouncement = useCallback(() => {
    startTransition(async () => {
      try {
        const response = await createAnnouncement({
          event_id,
          user_id: user?.id!,
          an_content: an,
        });
        setAn({ content: "", gif: "" });
        toast.success("They know what you wanna know!");
        broadcastAnnouncement(response.data);
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }, [an, event_id, user?.id]);

  function broadcastAnnouncement(data: Announcement) {
    if (channel) {
      channel.send({
        type: "broadcast",
        event: "notifications",
        payload: {
          ...data,
          type: "announcement",
          owner: {
            name: user?.user_metadata.full_name,
            avatar_url: user?.user_metadata.avatar_url,
          },
          createdAt: new Date(data.created_at),
        },
      });
    }
  }

  return (
    <div className="flex flex-col gap-2 absolute top-0 w-full z-50 bg-background pb-2">
      <div id="announcement_input" className="flex gap-2 border p-2 relative">
        {an.gif && (
          <span className="relative">
            <Image
              src={an.gif}
              alt={an.gif}
              height="400"
              width="400"
              className="w-[200px] h-full object-contain object-center p-1"
            />
            <div className="p-1 bg-destructive absolute -top-1 -right-1 cursor-pointer flex justify-center">
              <X className="w-3 h-3" onClick={clearGif} />
            </div>
          </span>
        )}

        <Textarea
          placeholder="Start typing"
          className="border-none focus-visible:ring-0 flex-1"
          onChange={setContent}
          value={an.content}
        />

        <div className="p-1 bg-destructive absolute top-0 right-0 cursor-pointer flex justify-center">
          <X className="w-3 h-3" onClick={handleAnnouncementClose} />
        </div>
      </div>

      <div id="announcement_footer" className="flex gap-2 justify-end">
        <Button size="icon" variant="outline" onClick={handleGifPickerToggle}>
          <Sticker className="text-muted-foreground" />
        </Button>
        <Button onClick={submitAnnouncement} disabled={isPending}>
          {isPending ? (
            <div className="flex items-center gap-3">
              <p>Sending</p>
              <Spinner />
            </div>
          ) : (
            <p>Send</p>
          )}
        </Button>
      </div>

      <GifPickerDialog
        dialogState={gifPickerState}
        setDialogState={handleGifPickerToggle}
        gifUrl={setGifUrl}
      />
    </div>
  );
};

export default AnnouncementInput;
