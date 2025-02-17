import { format, isValid, parseISO } from "date-fns";

export const formateDate = (date) => {
  if (!date) return "";


  const parsedDate = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(parsedDate)) {
    return "Invalid Date";
  }

  return format(parsedDate, "MMM dd, yyyy"); // Example: "Jan 30, 2025"
};
