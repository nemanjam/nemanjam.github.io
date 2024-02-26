import { format } from 'date-fns';

export const dateFormat = 'MMM dd, yyyy' as const;

export const formatDate = (date: Date): string => format(date, dateFormat);
