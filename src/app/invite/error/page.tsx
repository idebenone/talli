import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InviteErrorPage() {
  return (
    <div className="h-full flex flex-col gap-3 justify-center items-center">
      Oh no! Looks like your friend shared an invalid link.
      <Link href="/">
        <Button variant="secondary">Home</Button>
      </Link>
    </div>
  );
}
