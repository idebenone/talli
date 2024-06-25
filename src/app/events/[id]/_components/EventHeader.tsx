"use client";

import { useState } from "react";
import Link from "next/link";

import { Event } from "@/lib/types";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import UserListDialog from "./UsersListDialog";
import CreateCountDownDialog from "./CreateCountDownDialog";
import CreatePollDialog from "./CreatePollDialog";

interface EventHeaderProps {
  eventDetails: Event | null;
}

const EventHeader: React.FC<EventHeaderProps> = ({ eventDetails }) => {
  const [userListDialogState, setUserListDialogState] =
    useState<boolean>(false);
  const [createCountDownDialogState, setCreatCountDownDialogState] =
    useState<boolean>(false);
  const [createPollDialogState, setCreatePollDialogState] =
    useState<boolean>(false);

  function handleCopyEventLink(event: React.MouseEvent, event_id: string) {
    event.preventDefault();
    const encoded = btoa(event_id);
    navigator.clipboard.writeText(`${location.origin}/invite?code=${encoded}`);
    toast.success("Invite link has been copied!");
  }

  return (
    <>
      {eventDetails && (
        <>
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
              <Popover>
                <PopoverTrigger>
                  <CirclePlus className="w-4 h-4 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-1.5">
                  <div
                    className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                    onClick={() =>
                      setCreatePollDialogState(!createPollDialogState)
                    }
                  >
                    <BarChart className="h-4 w-4" />
                    <p>Poll</p>
                  </div>
                  <div
                    className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                    onClick={() =>
                      setCreatCountDownDialogState(!createCountDownDialogState)
                    }
                  >
                    <Hourglass className="h-4 w-4" />
                    <p>Countdown</p>
                  </div>
                  <div className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500">
                    <BadgeIndianRupee className="h-4 w-4" />
                    <p>Payment</p>
                  </div>
                </PopoverContent>
              </Popover>

              <User
                className="w-4 h-4 cursor-pointer"
                onClick={() => setUserListDialogState(!userListDialogState)}
              />
            </div>
          </div>

          <UserListDialog
            event_id={eventDetails?.event_id}
            event_owner={eventDetails?.event_owner}
            dialogState={userListDialogState}
            setDialogState={() => setUserListDialogState(!userListDialogState)}
          />

          <CreateCountDownDialog
            event_id={eventDetails?.event_id}
            dialogState={createCountDownDialogState}
            setDialogState={() =>
              setCreatCountDownDialogState(!createCountDownDialogState)
            }
          />

          <CreatePollDialog
            event_id={eventDetails?.event_id}
            dialogState={createPollDialogState}
            setDialogState={() =>
              setCreatePollDialogState(!createPollDialogState)
            }
          />
        </>
      )}
    </>
  );
};

export default EventHeader;
