"use client";
import { Separator } from "@/components/ui/separator";

export default function Root() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2 md:gap-4 items-center">
          <p className="font-bold">1</p>
          <Separator className="w-2 md:w-4" />
          <div>
            <p className="tracking-tight text-xl md:text-3xl font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-transparent bg-clip-text">
              Plan . Invite . Vibe
            </p>
            <p className="text-xs font-medium text-muted-foreground max-w-80 md:w-80 mt-2">
              Whether it's a chill hangout or a blowout bash, Talli's got you.
              Craft epic invites with GIFs and messages that scream <i>YOU</i>.
            </p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 items-center">
          <p className="font-bold">2</p>
          <Separator className="w-2 md:w-4" />
          <div>
            <p className="tracking-tight text-xl md:text-3xl font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-transparent bg-clip-text">
              Keep It Poppin’
            </p>
            <p className="text-xs font-medium text-muted-foreground max-w-80 md:w-80 mt-2">
              Create crew polls and curate playlists.
            </p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 items-center">
          <p className="font-bold">3</p>
          <Separator className="w-2 md:w-4" />
          <div>
            <p className="tracking-tight text-xl md:text-3xl font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-transparent bg-clip-text">
              Capture the Chaos
            </p>
            <p className="text-xs font-medium text-muted-foreground max-w-80 md:w-80 mt-2">
              Auto-organized photo albums for easy memories.
            </p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 items-center">
          <p className="font-bold">4</p>
          <Separator className="w-2 md:w-4" />
          <div>
            <p className="tracking-tight text-xl md:text-3xl font-semibold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-transparent bg-clip-text">
              Split & Chill
            </p>
            <p className="text-xs font-medium text-muted-foreground max-w-80 md:w-80 mt-2">
              No Awkward Splits: Talli does the math. Request and get paid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
