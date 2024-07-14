import { useState } from "react";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

import { LogOut, Settings } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Spinner from "../ui/spinner";

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onSignOut,
}) => {
  const [signoutConfirm, setSignoutConfirm] = useState(false);

  return (
    <Popover>
      <PopoverTrigger>
        <Image
          src={user.user_metadata.avatar_url}
          alt="profile_pic"
          className="h-8 w-8 cursor-pointer"
          height="400"
          width="400"
        />
      </PopoverTrigger>
      <PopoverContent className="w-40 flex flex-col gap-1.5 p-1">
        <div className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500">
          <Settings className="h-4 w-4" />
          <p>Settings</p>
        </div>
        <div
          className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-red-800 bg-destructive duration-500"
          onClick={() => setSignoutConfirm(!signoutConfirm)}
        >
          <LogOut className="h-4 w-4" />
          <p>Logout</p>
        </div>
      </PopoverContent>
      <AlertDialog
        open={signoutConfirm}
        onOpenChange={() => setSignoutConfirm(!signoutConfirm)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onSignOut}>
              <div className="flex items-center gap-3">
                <p>In progress</p>
                <Spinner />
              </div>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Popover>
  );
};
