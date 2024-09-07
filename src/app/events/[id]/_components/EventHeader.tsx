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
  Megaphone,
  SquareChevronUp,
  Trash,
  User,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import UserListDialog from "./UsersListDialog";
import CreatePollDialog from "./CreatePollDialog";
import CreateSplitDialog from "./CreateSplitDialog";
import { Separator } from "@/components/ui/separator";

interface EventHeaderProps {
  eventDetails: Event | null;
  setEditEvent: () => void;
  setAnnouncement: () => void;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  eventDetails,
  setEditEvent,
  setAnnouncement,
}) => {
  const user = useAtomValue(userAtom);
  const router = useRouter();

  const [userListDialogState, setUserListDialogState] =
    useState<boolean>(false);
  const [createPollDialogState, setCreatePollDialogState] =
    useState<boolean>(false);
  const [createSplitDialogState, setCreateSplitDialogState] =
    useState<boolean>(false);
  const [deleteEventAlertState, setDeleteEventAlertState] =
    useState<boolean>(false);

  function handleCopyEventLink(
    event: React.MouseEvent,
    event_id: string,
    event_name: string
  ) {
    event.preventDefault();
    const data = { event_id, event_name };
    const encoded = btoa(JSON.stringify(data));
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(`${location.origin}/invite?code=${encoded}`)
        .then(() => {
          toast.success("Invite link has been copied!");
        })
        .catch(() => {
          toast.error("Failed to copy invite link");
        });
    }
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
          <div
            id="header"
            className="py-1 md:py-4 flex justify-between items-start"
          >
            <div className="flex gap-2 md:gap-4">
              <Link href="/events">
                <ChevronLeft className="h-5 w-5 mt-1 md:mt-3 cursor-pointer" />
              </Link>
              <div className="flex flex-col md:gap-4">
                <p className="text-xl md:text-4xl font-semibold">
                  {eventDetails?.event_name}
                </p>
                <p className="italic text-[10px] md:text-xs text-muted-foreground">
                  {eventDetails?.event_description}
                </p>
              </div>
            </div>

            <div className="ps-7 mt-3 hidden gap-4 items-center sm:flex">
              <LucideLink
                className="w-4 h-4 cursor-pointer"
                onClick={(_event) =>
                  handleCopyEventLink(
                    _event,
                    eventDetails?.event_id,
                    eventDetails?.event_name
                  )
                }
              />

              {user?.id === eventDetails.event_owner && (
                <Megaphone
                  className="w-4 h-4 cursor-pointer"
                  onClick={setAnnouncement}
                />
              )}

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
                </PopoverContent>
              </Popover>

              <User
                className="w-4 h-4 cursor-pointer"
                onClick={() => setUserListDialogState(!userListDialogState)}
              />

              {user?.id === eventDetails.event_owner && (
                <>
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisVertical className="h-4 w-4 cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-40 flex flex-col gap-1.5 p-1">
                      <div
                        className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                        onClick={setEditEvent}
                      >
                        <SquareChevronUp className="mb-0.5 h-4 w-4" />
                        <p>Update</p>
                      </div>

                      <div
                        className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                        onClick={() =>
                          setDeleteEventAlertState(!deleteEventAlertState)
                        }
                      >
                        <Trash className="mb-1 h-4 w-4" />
                        <p>Delete</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </div>

            <div className="block sm:hidden">
              <Popover>
                <PopoverTrigger>
                  <EllipsisVertical className="w-4 h-4 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="w-56 flex flex-col gap-1.5 p-1">
                  <div
                    className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                    onClick={(_event) =>
                      handleCopyEventLink(
                        _event,
                        eventDetails?.event_id,
                        eventDetails?.event_name
                      )
                    }
                  >
                    <LucideLink className="w-3 h-3" />
                    <p className="text-xs">Copy invite link</p>
                  </div>

                  <div
                    className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                    onClick={() => setUserListDialogState(!userListDialogState)}
                  >
                    <User className="w-3 h-3" />
                    <p className="text-xs">Users</p>
                  </div>

                  <Separator />

                  <div
                    className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                    onClick={() =>
                      setCreatePollDialogState(!createPollDialogState)
                    }
                  >
                    <BarChart className="w-3 h-3" />
                    <p className="text-xs">Create poll</p>
                  </div>

                  <div
                    className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                    onClick={() =>
                      setCreateSplitDialogState(!createSplitDialogState)
                    }
                  >
                    <BadgeIndianRupee className="w-3 h-3" />
                    <p className="text-xs">Create split</p>
                  </div>

                  <Separator />

                  {user?.id === eventDetails.event_owner && (
                    <div
                      className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                      onClick={setAnnouncement}
                    >
                      <Megaphone className="w-3 h-3" />
                      <p className="text-xs">Create announcement</p>
                    </div>
                  )}

                  {user?.id === eventDetails.event_owner && (
                    <div
                      className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                      onClick={setEditEvent}
                    >
                      <SquareChevronUp className="mb-0.5 w-3 h-3" />
                      <p className="text-xs">Update event</p>
                    </div>
                  )}

                  {user?.id === eventDetails.event_owner && (
                    <div
                      className="px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-muted duration-500"
                      onClick={() =>
                        setDeleteEventAlertState(!deleteEventAlertState)
                      }
                    >
                      <Trash className="mb-1 w-3 h-3" />
                      <p className="text-xs">Delete event</p>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
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

          <AlertDialog
            open={deleteEventAlertState}
            onOpenChange={() =>
              setDeleteEventAlertState(!deleteEventAlertState)
            }
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your event and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteEvent}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
};

export default EventHeader;
