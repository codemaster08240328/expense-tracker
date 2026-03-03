import type { Category, Expense } from '../types';

export type MonthlyTotal = { month: string; total: number };

/**
 * Compute total spending per month for the given year.
 */
export function computeMonthlyTotals(
  expenses: Expense[],
  year: number,
): MonthlyTotal[] {
  const monthlyTotals = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(year, i).toLocaleString('default', { month: 'short' }),
    total: 0,
  }));

  expenses.forEach((e) => {
    const date = new Date(e.date);
    if (date.getFullYear() === year) {
      const monthIndex = date.getMonth();
      monthlyTotals[monthIndex].total += e.amount;
    }
  });

  return monthlyTotals;
}

export type CategoryTotal = { name: string; value: number };

/**
 * Aggregate expenses by category; names resolved from categories list.
 */
export function computeByCategory(
  expenses: Expense[],
  categories: Category[],
): CategoryTotal[] {
  const map = new Map<string, number>();
  expenses.forEach((e) => {
    map.set(e.categoryId, (map.get(e.categoryId) || 0) + e.amount);
  });
  return Array.from(map.entries()).map(([categoryId, value]) => ({
    name: categories.find((c) => c.id === categoryId)?.name ?? 'Unknown',
    value,
  }));
}
