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

export function convertToTime(isoString: string) {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  const readableDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return readableDate;
}

export function formatNumberToIndianSystem(figure: number) {
  if (isNaN(figure) || !isFinite(figure)) return '0';
  const roundedFigure = parseFloat(figure.toFixed(2));
  let numberString = roundedFigure.toString();
  const [integerPart, decimalPart] = numberString.split('.');
  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);
  const formattedIntegerPart = otherDigits
    ? otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThreeDigits
    : lastThreeDigits;
  return decimalPart ? formattedIntegerPart + '.' + decimalPart : formattedIntegerPart;
}

