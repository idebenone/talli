import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateRemainingTime(targetDate: string): number {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  return Math.max(0, Math.floor((target - now) / 1000));
}

export function formatTime(totalSeconds: number) {
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