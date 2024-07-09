"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

import { useAtomValue } from "jotai";
import { userAtom } from "@/utils/atoms";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Spinner from "./ui/spinner";

export default function Hero() {
  const user = useAtomValue(userAtom);
  const [isPending, setTransition] = useTransition();
  const [loading, setLoading] = useState<boolean>(true);

  function GoogleOAuth() {
    setTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=/events`,
        },
      });
    });
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return !loading ? (
    <div className="h-full w-full px-4">
      {!user && (
        <div className="flex justify-end">
          <Button onClick={GoogleOAuth}>
            {isPending ? (
              <div className="flex items-center gap-3">
                <p>In progress</p>
                <Spinner color="" />
              </div>
            ) : (
              <p>Continue with Google</p>
            )}
          </Button>
        </div>
      )}

      <div className="h-full flex justify-center items-center">
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
              <Link href="/about">
                <Button variant="outline">About us</Button>
              </Link>
            </div>
          )}

          {user && (
            <div className="mt-6 md:mt-12 flex gap-4 animate-fade-in">
              <Link href="/events">
                <Button>Go to events</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">About us</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full w-full flex justify-center items-center">
      <Spinner />
    </div>
  );
}
