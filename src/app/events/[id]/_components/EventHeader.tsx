"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";

import { deleteEvent } from "../../actions";
import { userAtom } from "@/utils/atoms";
import { Event } from "@/lib/types";

import {
  BadgeIndianRupee,
  BarChart,
  ChevronLeft,
  CirclePlus,
  EllipsisVertical,
  Link as LucideLink,
  SquareChevronUp,
  Trash,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import UserListDialog from "./UsersListDialog";
import CreatePollDialog from "./CreatePollDialog";
import CreateSplitDialog from "./CreateSplitDialog";

interface EventHeaderProps {
  eventDetails: Event | null;
  setEditEvent: () => void;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  eventDetails,
  setEditEvent,
}) => {
  const user = useAtomValue(userAtom);
  const router = useRouter();

  const [userListDialogState, setUserListDialogState] =
    useState<boolean>(false);
  const [createPollDialogState, setCreatePollDialogState] =
    useState<boolean>(false);
  const [createSplitDialogState, setCreateSplitDialogState] =
    useState<boolean>(false);

  function handleCopyEventLink(event: React.MouseEvent, event_id: string) {
    event.preventDefault();
    const encoded = btoa(event_id);
    navigator.clipboard.writeText(`${location.origin}/invite?code=${encoded}`);
    toast.success("Invite link has been copied!");
  }

  async function handleDeleteEvent() {
    try {
      if (eventDetails) {
        await deleteEvent(eventDetails.event_id);
        toast.success("Event has been deleted!");
        router.push("/events");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later");
    }
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
                <PopoverContent className="w-40 flex flex-col gap-1.5 p-1">
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
                      setCreateSplitDialogState(!createSplitDialogState)
                    }
                  >
                    <BadgeIndianRupee className="h-4 w-4" />
                    <p>Split</p>
                  </div>

                  <div></div>
                </PopoverContent>
              </Popover>

              <User
                className="w-4 h-4 cursor-pointer"
                onClick={() => setUserListDialogState(!userListDialogState)}
              />

              {user?.id === eventDetails.event_owner && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <div
                          className="flex items-center gap-2"
                          onClick={setEditEvent}
                        >
                          <SquareChevronUp className="mb-0.5 h-4 w-4" />
                          <p>Update</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <div
                          className="flex items-center gap-2 text-red-600"
                          onClick={handleDeleteEvent}
                        >
                          <Trash className="mb-1 h-4 w-4" />
                          <p>Delete</p>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>

          <UserListDialog
            event_id={eventDetails?.event_id}
            event_owner={eventDetails?.event_owner}
            dialogState={userListDialogState}
            setDialogState={() => setUserListDialogState(!userListDialogState)}
          />

          <CreatePollDialog
            event_id={eventDetails?.event_id}
            dialogState={createPollDialogState}
            setDialogState={() =>
              setCreatePollDialogState(!createPollDialogState)
            }
          />

          <CreateSplitDialog
            event_id={eventDetails?.event_id}
            dialogState={createSplitDialogState}
            setDialogState={() =>
              setCreateSplitDialogState(!createSplitDialogState)
            }
          />
        </>
      )}
    </>
  );
};

export default EventHeader;
