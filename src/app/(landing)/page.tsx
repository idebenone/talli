"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Root() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col items-end">
        <div className="md:h-6 flex flex-col md:flex-row gap-3 md:gap-6 items-center">
          <p className="tracking-tighter text-6xl font-bold animate-fade-in">
            talli .
          </p>
          <Separator orientation="vertical" className="hidden md:block" />
          <div className="text-center md:text-start animate-fade-in">
            <p className="tracking-tight text-sm font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-transparent bg-clip-text">
              Your ultimate party sidekick
            </p>
            <p className="text-muted-foreground text-xs font-medium animate-pulse">
              Throwing down has never been this easy
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-12 flex gap-4 animate-fade-in">
          <Link href="/about">
            <Button variant="outline">About us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
