import type { Expense } from '../types';

export type ExpenseFilters = {
  from?: string;
  to?: string;
  categoryId?: string;
};

/**
 * Filter expenses by optional date range and category.
 */
export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFilters,
): Expense[] {
  return expenses.filter((e) => {
    const date = new Date(e.date).getTime();
    const okFrom = filters.from
      ? date >= new Date(filters.from).getTime()
      : true;
    const okTo = filters.to ? date <= new Date(filters.to).getTime() : true;
    const okCat = filters.categoryId
      ? e.categoryId === filters.categoryId
      : true;
    return okFrom && okTo && okCat;
  });
}
