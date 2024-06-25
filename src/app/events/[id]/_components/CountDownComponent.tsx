import { CountDown } from "@/lib/types";
import React, { useState, useEffect } from "react";

interface CountDownComponentProps {
  countdown: CountDown;
}

const CountDownComponent: React.FC<CountDownComponentProps> = ({
  countdown,
}) => {
  const calculateRemainingTime = (targetDate: string): number => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.floor((target - now) / 1000));
  };

  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(countdown.cd_target)
  );

  useEffect(() => {
    if (remainingTime <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setRemainingTime(calculateRemainingTime(countdown.cd_target));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime]);

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

  return (
    <div className="flex flex-col justify-center items-center border p-6">
      <p className="text-center">{countdown.cd_title}</p>
      <p className="text-center text-muted-foreground">
        {countdown.cd_description}
      </p>

      <div className="flex gap-2 mt-4">
        {Object.entries(formatTime(remainingTime)).map(([key, value]) => (
          <div
            className="animate-in border border-muted p-2 w-20 flex gap-2 justify-center items-baseline"
            key={key}
          >
            <p className="text-lg">
              {value < 10 && 0}
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{key}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountDownComponent;
