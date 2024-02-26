import { format } from 'date-fns';

export const dateFormats = {
  // Jan 13, 2024
  cardDate: 'MMM dd, yyyy',
  // 2024-02-26
  isoDate: 'yyyy-MM-dd',
} as const;

export const formatDate = (date: Date): string => format(date, dateFormats.cardDate);
export const formatDateIso = (date: Date): string => format(date, dateFormats.isoDate);
