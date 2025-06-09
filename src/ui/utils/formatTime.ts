export function formatTime(totalMinutes: number): string {
  if (totalMinutes < 0) {
    return 'Invalid input';
  }
  if (totalMinutes === 0) {
    return '0 minutes';
  }

  const minutesInHour = 60;
  const hoursInDay = 24;

  const days = Math.floor(totalMinutes / (minutesInHour * hoursInDay));
  const remainingMinutesAfterDays = totalMinutes % (minutesInHour * hoursInDay);

  const hours = Math.floor(remainingMinutesAfterDays / minutesInHour);
  const remainingMinutes = remainingMinutesAfterDays % minutesInHour;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} day${days > 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }
  if (remainingMinutes > 0) {
    parts.push(`${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`);
  }

  // This condition addresses cases where totalMinutes > 0,
  // but days, hours, and remainingMinutes are all zero.
  // This should not happen with positive integer inputs if the logic is correct,
  // as totalMinutes = 0 is handled, and any other positive value
  // should yield at least one non-zero part.
  // This is a defensive fallback.
  if (parts.length === 0 && totalMinutes > 0) {
     return `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''}`;
  }

  return parts.join(' ');
}
