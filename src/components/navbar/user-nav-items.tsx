import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export const UserNavItems = ({ pathname }: { pathname: string }) => {
  const user = useAtomValue(userAtom);

  if (!user) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={`p-2 border border-muted h-8 hover:bg-muted transition-all duration-500 ${
            pathname.includes("events") ? "bg-red-700" : ""
          }`}
        >
          <Link href="/events">
            <CalendarCheck className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p className="capitalize">Events</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
