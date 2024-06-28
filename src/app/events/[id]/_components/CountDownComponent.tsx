import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { calculateRemainingTime, formatTime } from "@/lib/utils";
import { THEMES } from "@/utils/themes";

interface CountDownComponentProps {
  event_target: string;
  event_theme: string;
}

const CountDownComponent: React.FC<CountDownComponentProps> = ({
  event_target,
  event_theme,
}) => {
  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(event_target)
  );
  const [expand, setExpand] = useState<boolean>(false);
  const [theme, setTheme] = useState<any>();

  useEffect(() => {
    if (remainingTime <= 0) return;

    const intervalId = setInterval(() => {
      setRemainingTime(calculateRemainingTime(event_target));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime, event_target]);

  useEffect(() => {
    setTheme(THEMES.find((theme) => theme.value === event_theme));
  }, [event_theme]);

  return (
    <>
      {event_target && (
        <div
          style={{
            backgroundImage: theme?.bg ? `url(${theme.bg})` : undefined,
          }}
          className={`relative flex flex-col justify-center items-center p-6 group transition-all duration-300 ease-in-out overflow-hidden
            ${theme?.font?.className!}
            ${expand ? "h-32" : "h-16 contrast-75 grayscale"}`}
        >
          <div className="flex gap-2.5 ">
            {Object.entries(formatTime(remainingTime)).map(([key, value]) => (
              <div
                className={`${
                  expand ? "p-2 w-fit" : "border-none w-fit"
                } flex gap-1 justify-center items-baseline transition-all duration-300 ease-in-out`}
                key={key}
              >
                <p
                  className={`${theme?.font_weight} ${
                    expand ? theme?.font_size_expanded! : theme?.font_size!
                  }`}
                >
                  {value < 10 && 0}
                  {value}
                </p>
                <p
                  className={`${theme?.font_weight} text-xs text-muted-foreground`}
                >
                  {key}
                </p>
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
