// src/utils/position.utils.ts
export const calculatePosition = (date: Date, startDate: Date, pixelsPerDay: number): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((date.getTime() - startDate.getTime()) / msPerDay * pixelsPerDay);
};

export const calculateDuration = (startDate: Date, endDate: Date, pixelsPerDay: number): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = (endDate.getTime() - startDate.getTime()) / msPerDay;
  return Math.max(1, Math.round(days * pixelsPerDay));
};

export const calculateDateFromPosition = (position: number, startDate: Date, pixelsPerDay: number): Date => {
  const days = position / pixelsPerDay;
  const result = new Date(startDate);
  result.setDate(result.getDate() + Math.round(days));
  return result;
};


export const generateTimeScale = (startDate: Date, endDate: Date, viewMode: 'day' | 'week' | 'month') => {
  const scale: { label: string; date: Date }[] = [];
  const date = new Date(startDate);
  while (date <= endDate) {
    let label = '';
    if (viewMode === 'day') label = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    if (viewMode === 'week') label = `W${getWeekNumber(date)}`;
    if (viewMode === 'month') label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    scale.push({ label, date: new Date(date) });
    date.setDate(date.getDate() + (viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30));
  }
  return scale;
};

const getWeekNumber = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor((date.getTime() - firstDay.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};
