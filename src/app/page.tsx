"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Root() {
  const [user, setUser] = useState<User | null>();

  async function getUserSession() {
    const supabase = createClient();
    const response = await supabase.auth.getUser();
    console.log(response.data);
    setUser(response.data.user);
  }

  useEffect(() => {
    getUserSession();
  }, []);

  return (
    <main>
      <div className="h-screen flex justify-center items-center">
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

          {!user && (
            <div className="mt-6 md:mt-12 flex gap-4 animate-fade-in">
              <Link href="/login">
                <Button>Join now</Button>
              </Link>

              <a href="#know_more">
                <Button variant="outline">Know more</Button>
              </a>
            </div>
          )}

          {user && (
            <div className="mt-6 md:mt-12 flex gap-4 animate-fade-in">
              <Link href="/events">
                <Button>Go to events</Button>
              </Link>
            </div>
          )}

          <div className="mt-4 ms-0.5 flex gap-2 animate-fade-in">
            <Linkedin className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary duration-500" />
            <Instagram className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary duration-500" />
            <Facebook className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary duration-500" />
          </div>
        </div>
      </div>

      <div id="know_more" className="h-screen flex justify-center items-center">
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
                Craft epic invites with GIFs and messages that scream <i>YOU</i>
                .
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
    </main>
  );
}
