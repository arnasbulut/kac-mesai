export type TimeUnit = 'hour' | 'day' | 'week' | 'month';

export const TIME_UNITS: { value: TimeUnit; labelKey: string }[] = [
  { value: 'hour', labelKey: 'hour' },
  { value: 'day', labelKey: 'day' },
  { value: 'week', labelKey: 'week' },
  { value: 'month', labelKey: 'month' },
];

export const convertHoursToUnit = (hours: number, unit: TimeUnit): number => {
  switch (unit) {
    case 'hour':
      return hours;
    case 'day':
      return hours / 8; // 8 hours per day
    case 'week':
      return hours / 40; // 40 hours per week
    case 'month':
      return hours / (40 * 4.33); // 40 hours per week * 4.33 weeks per month
    default:
      return hours;
  }
};

export const getPluralUnit = (value: number, unit: TimeUnit): string => {
  if (value === 1) {
    return unit;
  }
  return unit + 's';
};
