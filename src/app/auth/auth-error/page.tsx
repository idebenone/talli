import Link from "next/link";

export default function AuthError() {
  return (
    <div className="h-full flex flex-col gap-2 justify-center items-center">
      Oopsie, there was an error while authentication.
      <Link href="/login" className="text-blue-500">
        Try Again
      </Link>
    </div>
  );
}
