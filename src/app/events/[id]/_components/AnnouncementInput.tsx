import { ChangeEvent, useCallback, useState, useTransition } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms";

import { Button } from "@/components/ui/button";
import { Sticker, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createAnnouncement } from "../../actions";
import Spinner from "@/components/ui/spinner";
import GifPickerDialog from "./GifPickerDialog";
import { TenorImage } from "gif-picker-react";
import Image from "next/image";

interface CreateAnnouncement {
  content: string;
  gif: string;
}

interface AnnouncementInputProps {
  event_id: string;
}

const AnnouncementInput: React.FC<AnnouncementInputProps> = ({ event_id }) => {
  const user = useAtomValue(userAtom);
  const [isPending, setTransition] = useTransition();
  const [an, setAn] = useState<CreateAnnouncement>({ content: "", gif: "" });
  const [gifPickerState, setGifPickerState] = useState<boolean>(false);

  const setContent = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setAn((prev) => ({ ...prev, content: event.target.value }));
  }, []);

  const setGifUrl = useCallback((tenorImage: TenorImage) => {
    setAn((prev) => ({ ...prev, gif: tenorImage.url }));
  }, []);

  function submitAnnouncement() {
    setTransition(async () => {
      try {
        await createAnnouncement({
          event_id,
          user_id: user?.id!,
          an_content: an,
        });
        setAn({ content: "", gif: "" });
      } catch (error) {
        toast.error("Something went wrong. Please try again later!");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 border p-2">
      {an.gif && (
        <span className="relative ">
          <Image
            src={an.gif}
            alt={an.gif}
            height="400"
            width="400"
            className="w-full h-[100px] object-contain object-center"
          />
          <XCircle
            className="w-4 h-4 absolute top-0 right-0 cursor-pointer"
            onClick={() => setAn((prev) => ({ ...prev, gif: "" }))}
          />
        </span>
      )}
      <Textarea
        placeholder="Start typing"
        className="border-none focus-visible:ring-0"
        onChange={setContent}
      />
      <div className="flex gap-2 justify-end">
        <Button size="icon" variant="outline">
          <Sticker
            className="text-muted-foreground"
            onClick={() => setGifPickerState(!gifPickerState)}
          />
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
        setDialogState={() => setGifPickerState(!gifPickerState)}
        gifUrl={setGifUrl}
      />
    </div>
  );
};

export default AnnouncementInput;
