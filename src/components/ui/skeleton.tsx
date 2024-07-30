import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animated-background bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
