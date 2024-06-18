"use client";

import {
  BadgeIndianRupee,
  BarChart,
  CirclePlus,
  Hourglass,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Event({ params }: { params: { slug: string } }) {
  return (
    <div className="h-full flex justify-center">
      <div className="p-2 w-full sm:w-3/4 lg:w-2/5">
        <div
          id="header"
          className="py-4 px-6 flex justify-between items-center border border-dotted rounded-md"
        >
          <p className="">Event Name</p>

          <div className="flex gap-4 items-center">
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
            <User className="w-4 h-4 cursor-pointer" />
          </div>
        </div>
        <div className="overflow-auto"></div>
      </div>
    </div>
  );
}