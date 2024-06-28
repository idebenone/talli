import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animated-background bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
