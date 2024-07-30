import GifPicker, { TenorImage } from "gif-picker-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GifPickerDialogProps {
  dialogState: boolean;
  setDialogState: () => void;
  gifUrl: (url: TenorImage) => void;
}

const GifPickerDialog: React.FC<GifPickerDialogProps> = ({
  dialogState,
  setDialogState,
  gifUrl,
}) => {
  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>GIF's</DialogTitle>
          <DialogDescription>
            Come on, don&lsquo;t be shy, pick your gif!
          </DialogDescription>
          <GifPicker
            onGifClick={gifUrl}
            width="100%"
            tenorApiKey={process.env.NEXT_PUBLIC_TENOR_API_KEY!}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GifPickerDialog;
