/**
 * Convert a date string from input (YYYY-MM-DD) to an ISO string at local midnight.
 */
export function localDateToISOString(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map((v) => Number(v));
  const dt = new Date(y, m - 1, d);
  return dt.toISOString();
}
