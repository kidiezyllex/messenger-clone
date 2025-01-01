import { format } from "date-fns";
// Linear interpolation
export function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

// Get distance between two points
export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function formatDate(date: Date | undefined) {
  if (!date) return "";
  return format(date, "dd/MM/yyyy");
}

export function formatDate2(date: Date | undefined) {
  if (!date) return "";
  return format(date, "h:mm a dd/MM/yyyy");
}

export function formatDate3(date: Date | undefined) {
  if (!date) return "";
  return format(date, "h:mm a");
}

export const getLastName = (text: string) => {
  const lastName = text.split(" ");
  return lastName[lastName.length - 1];
};

export const isWithinTwoMinutes = (
  a: string | Date,
  b: string | Date
): boolean => {
  const timeA = new Date(a).getTime();
  const timeB = new Date(b).getTime();
  const diff = Math.abs(timeA - timeB);
  return diff < 30 * 1000;
};

export const renderBackgroundTheme = (theme: any) => {
  const themes: { [key: string]: string } = {
    red: "bg-neutral-950 dark:bg-neutral-950",
    rose: "bg-stone-900 dark:bg-stone-900",
    blue: "bg-slate-950 dark:bg-slate-950",
    green: "bg-stone-900 dark:bg-stone-900",
    violet: "bg-gray-950 dark:bg-gray-950",
    orange: "bg-stone-950 dark:bg-stone-950",
    yellow: "bg-stone-950 dark:bg-stone-950",
  };
  return themes[theme] || "";
};
