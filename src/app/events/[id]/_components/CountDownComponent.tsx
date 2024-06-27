import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect } from "react";

interface CountDownComponentProps {
  event_target: string;
}

const CountDownComponent: React.FC<CountDownComponentProps> = ({
  event_target,
}) => {
  const calculateRemainingTime = (targetDate: string): number => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.floor((target - now) / 1000));
  };

  const [expand, setExpand] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(event_target)
  );

  const formatTime = (totalSeconds: number) => {
    const d = Math.floor(totalSeconds / (24 * 60 * 60));
    totalSeconds %= 24 * 60 * 60;
    const hr = Math.floor(totalSeconds / (60 * 60));
    totalSeconds %= 60 * 60;
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;

    return {
      d,
      hr,
      min,
      sec,
    };
  };

  useEffect(() => {
    if (remainingTime <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setRemainingTime(calculateRemainingTime(event_target));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime, event_target]);

  return (
    <>
      {event_target && (
        <div
          className={`relative flex flex-col justify-center items-center p-6 group transition-all duration-300 ease-in-out overflow-hidden ${
            expand ? "border h-32" : "border border-background h-16"
          }`}
        >
          <div className="flex gap-2 ">
            {Object.entries(formatTime(remainingTime)).map(([key, value]) => (
              <div
                className={`${
                  expand ? "p-2 border border-muted w-20" : "border-none w-12"
                } flex gap-1 justify-center items-baseline transition-all duration-300 ease-in-out`}
                key={key}
              >
                <p className={`text-lg ${expand ? "" : "text-base"}`}>
                  {value < 10 && 0}
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{key}</p>
              </div>
            ))}
          </div>

          {expand ? (
            <ChevronUp
              onClick={() => setExpand(false)}
              className="absolute right-4 top-14 h-4 w-4 cursor-pointer text-muted-foreground hidden group-hover:block"
            />
          ) : (
            <ChevronDown
              onClick={() => setExpand(true)}
              className="absolute right-2 w-4 h-4 cursor-pointer text-muted-foreground "
            />
          )}
        </div>
      )}
    </>
  );
};

export default CountDownComponent;
