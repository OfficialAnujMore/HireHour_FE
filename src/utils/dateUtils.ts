export const formatDateUS = (date: Date | string): string => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date provided');
  }
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${month}/${day}/${year}`;
};

export const toStartOfDayISOString = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string provided');
  }
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};
