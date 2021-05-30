import { add, sub } from "date-fns";

export const now = () => {
  return new Date();
};

export const beforeNow = (scale: string, value: number): Date => {
  return sub(now(), { [scale]: value });
};

export const afterNow = (scale: string, value: number): Date => {
  return add(now(), { [scale]: value });
};
