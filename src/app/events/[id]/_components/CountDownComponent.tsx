import React, { useState, useEffect } from "react";
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
          onClick={() => setExpand(!expand)}
          style={{
            backgroundImage: theme?.bg ? `url(${theme.bg})` : undefined,
          }}
          className={`absolute w-full flex flex-col justify-center items-center p-2 md:p-6 group transition-all duration-300 ease-in-out overflow-hidden bg-cover cursor-pointer
            ${theme?.font?.className!}
            ${expand ? "h-32" : "h-16 contrast-100 grayscale"}`}
        >
          <div className="flex gap-2.5">
            {Object.entries(formatTime(remainingTime)).map(([key, value]) => (
              <div
                className={`${
                  expand ? "p-1 md:p-2 w-fit" : "border-none w-fit"
                } flex gap-1 justify-center items-baseline transition-all duration-300 ease-in-out`}
                key={key}
              >
                <p
                  className={`transition-all duration-500 ${
                    theme?.font_weight
                  } ${
                    expand
                      ? `text-xl md:${theme?.font_size_expanded!}`
                      : theme?.font_size!
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
        </div>
      )}
    </>
  );
};

export default CountDownComponent;
