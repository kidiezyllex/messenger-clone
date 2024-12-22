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
  const [, name] = text?.match(/"name": "(.*?)"/) || [];
  return name?.split(" ")?.pop();
};
