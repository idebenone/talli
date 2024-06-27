"use client";

import Spinner from "@/components/spinner";

export default function Loading() {
  return (
    <div className="h-full flex justify-center items-center">
      <Spinner />
    </div>
  );
}
