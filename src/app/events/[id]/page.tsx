"use client";

import {
  BadgeIndianRupee,
  BarChart,
  ChevronLeft,
  CirclePlus,
  Hourglass,
  Link as LucideLink,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getEvent } from "./actions";
import UserListDialog from "./_components/UsersListDialog";
import Link from "next/link";
import { toast } from "sonner";

export default function Event({ params }: { params: { id: string } }) {
  const [eventDetails, setEventDetails] = useState<any>();
  const [userListDialogState, setUserListDialogState] =
    useState<boolean>(false);

  function handleCopyEventLink(event: React.MouseEvent, event_id: string) {
    event.preventDefault();
    const encoded = btoa(event_id);
    navigator.clipboard.writeText(`${location.origin}/invite?code=${encoded}`);
    toast.success("Invite link has been copied!");
  }

  async function getEventDetails() {
    try {
      const response = await getEvent(params.id);
      setEventDetails(response![0]);
    } catch (error) {}
  }

  useEffect(() => {
    getEventDetails();
  }, []);

  return (
    <div className="h-full flex justify-center">
      <div className="p-2 w-full sm:w-3/4 lg:w-2/5">
        <div id="header" className="py-4 flex justify-between items-start">
          <div className="flex gap-4">
            <Link href="/events">
              <ChevronLeft className="h-5 w-5 mt-3 cursor-pointer" />
            </Link>
            <div className="flex flex-col">
              <p className="text-4xl font-semibold">
                {eventDetails?.event_name}
              </p>
              <p className="mt-4 italic text-xs text-muted-foreground">
                {eventDetails?.event_description}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center mt-3">
            <LucideLink
              className="w-4 h-4 cursor-pointer"
              onClick={(_event) =>
                handleCopyEventLink(_event, eventDetails?.event_id)
              }
            />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <CirclePlus className="w-4 h-4 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <p>Poll</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Hourglass className="h-4 w-4" />
                  <p>Countdown</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <BadgeIndianRupee className="h-4 w-4" />
                  <p>Payment</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <User
              className="w-4 h-4 cursor-pointer"
              onClick={() => setUserListDialogState(!userListDialogState)}
            />
          </div>
        </div>

        <div className="overflow-auto"></div>

        <UserListDialog
          event_id={eventDetails?.event_id}
          event_owner={eventDetails?.event_owner}
          dialogState={userListDialogState}
          setDialogState={() => setUserListDialogState(!userListDialogState)}
        />
      </div>
    </div>
  );
}
