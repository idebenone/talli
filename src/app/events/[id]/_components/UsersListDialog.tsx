import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getEventUsers } from "../actions";
import Image from "next/image";

interface UserListDialogProps {
  event_id: string;
  dialogState: boolean;
  setDialogState: () => void;
}

const UserListDialog: React.FC<UserListDialogProps> = ({
  event_id,
  dialogState,
  setDialogState,
}) => {
  const [userList, setUsersList] = useState<any[]>([]);

  async function handleGetEventUsers() {
    try {
      const response = await getEventUsers(event_id);
      setUsersList(response);
      console.log(response);
    } catch (error) {}
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
          {userList.map((user, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <Image
                  height="400"
                  width="400"
                  className="rounded-full h-10 w-10"
                  src={user.users.raw_user_meta_data.picture}
                  alt={user.users.raw_user_meta_data.name}
                />
                <div className="flex flex-col">
                  <p>{user.users.raw_user_meta_data.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.users.raw_user_meta_data.email}
                  </p>
                </div>
              </div>

              <p className="text-xs text-green-400 px-1 py-0.5 border border-green-500 rounded-md">
                {user.user_role}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserListDialog;
