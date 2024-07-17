import { useMemo } from "react";

import { Home, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export const NavItems = ({ pathname }: { pathname: string }) => {
  const navItems = useMemo(
    () => [
      { to: "/", title: "home", icon: <Home className="h-4 w-4" /> },
      { to: "/about", title: "about", icon: <Info className="h-4 w-4" /> },
    ],
    []
  );

  return (
    <div className="flex gap-3">
      {navItems.map((item, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger
              className={`p-2 border border-muted h-8 hover:bg-muted transition-all duration-500 ${
                pathname === item.to ? "bg-red-700" : ""
              }`}
            >
              <Link href={item.to}>{item.icon}</Link>
            </TooltipTrigger>
            <TooltipContent>
              <p className="capitalize">{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
