import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getEventUsers, removeEventUser } from "../actions";
import Image from "next/image";
import { toast } from "sonner";
import { CircleX } from "lucide-react";
import { useAtomValue } from "jotai";
import { userAtom } from "@/components/UserProfile";

interface UserListDialogProps {
  event_id: string;
  event_owner: string;
  dialogState: boolean;
  setDialogState: () => void;
}

const UserListDialog: React.FC<UserListDialogProps> = ({
  event_id,
  event_owner,
  dialogState,
  setDialogState,
}) => {
  const user = useAtomValue(userAtom);
  const [userList, setUsersList] = useState<any[]>([]);

  async function handleGetEventUsers() {
    try {
      const response = await getEventUsers(event_id);
      setUsersList(response);
    } catch (error) {
      toast.error("Something went wrong. Please try again later");
    }
  }

  async function handleRemoveEventUser(event_user_id: string) {
    try {
      await removeEventUser(event_user_id);
    } catch (error) {
      toast.error("Something went wrong. Please try again later");
    }
  }

  useEffect(() => {
    if (event_id) handleGetEventUsers();
  }, [event_id]);

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Amigos!</DialogTitle>
          <DialogDescription>List of users</DialogDescription>
        </DialogHeader>

        <Input placeholder="Search users" />
        {userList.length === 0 && (
          <div className="flex justify-center items-center">
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {userList.map((_user, index) => (
            <div
              key={index}
              className="relative p-3 flex justify-between items-start cursor-pointer hover:bg-muted rounded-md duration-500 group"
            >
              <div className="flex items-center gap-4">
                <Image
                  height="400"
                  width="400"
                  className="rounded-full h-10 w-10"
                  src={_user.users.raw_user_meta_data.picture}
                  alt={_user.users.raw_user_meta_data.name}
                />
                <div className="flex flex-col">
                  <p>{_user.users.raw_user_meta_data.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {_user.users.raw_user_meta_data.email}
                  </p>
                </div>
              </div>

              <p className="text-xs text-green-400 px-1 py-0.5 border border-green-500 rounded-md">
                {_user.user_role}
              </p>

              {user?.id === event_owner && _user.users.id !== event_owner && (
                <CircleX
                  className="absolute -top-1 -right-1 h-4 w-4 hidden group-hover:block transition-all duration-500 text-muted-foreground hover:text-white"
                  onClick={() => handleRemoveEventUser(_user.event_user_id)}
                />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserListDialog;