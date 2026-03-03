import { describe, it, expect } from 'vitest';
import { computeMonthlyTotals, computeByCategory } from './reports';
import type { Category, Expense } from '../types';

describe('computeMonthlyTotals', () => {
  it('returns 12 months with zero totals when no expenses', () => {
    const result = computeMonthlyTotals([], 2025);
    expect(result).toHaveLength(12);
    expect(result.every((m) => m.total === 0)).toBe(true);
    expect(result[0].month).toBe('Jan');
    expect(result[11].month).toBe('Dec');
  });

  it('aggregates expenses by month for the given year', () => {
    // Use noon UTC so getMonth() is consistent across timezones
    const expenses: Expense[] = [
      {
        id: '1',
        amount: 100,
        description: 'a',
        date: '2025-01-15T12:00:00.000Z',
        categoryId: 'c1',
      },
      {
        id: '2',
        amount: 50,
        description: 'b',
        date: '2025-01-20T12:00:00.000Z',
        categoryId: 'c1',
      },
      {
        id: '3',
        amount: 200,
        description: 'c',
        date: '2025-03-01T12:00:00.000Z',
        categoryId: 'c1',
      },
    ];
    const result = computeMonthlyTotals(expenses, 2025);
    expect(result[0].total).toBe(150);
    expect(result[2].total).toBe(200);
    expect(result[1].total).toBe(0);
  });

  it('ignores expenses from other years', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        amount: 100,
        description: 'a',
        date: '2024-06-01T00:00:00.000Z',
        categoryId: 'c1',
      },
    ];
    const result = computeMonthlyTotals(expenses, 2025);
    expect(result.every((m) => m.total === 0)).toBe(true);
  });
});

describe('computeByCategory', () => {
  const categories: Category[] = [
    { id: 'c1', name: 'Food' },
    { id: 'c2', name: 'Transport' },
  ];

  it('returns empty array when no expenses', () => {
    const result = computeByCategory([], categories);
    expect(result).toEqual([]);
  });

  it('aggregates by category and resolves names', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        amount: 30,
        description: 'a',
        date: '2025-01-01T00:00:00.000Z',
        categoryId: 'c1',
      },
      {
        id: '2',
        amount: 20,
        description: 'b',
        date: '2025-01-02T00:00:00.000Z',
        categoryId: 'c1',
      },
      {
        id: '3',
        amount: 50,
        description: 'c',
        date: '2025-01-03T00:00:00.000Z',
        categoryId: 'c2',
      },
    ];
    const result = computeByCategory(expenses, categories);
    expect(result).toHaveLength(2);
    const food = result.find((r) => r.name === 'Food');
    const transport = result.find((r) => r.name === 'Transport');
    expect(food?.value).toBe(50);
    expect(transport?.value).toBe(50);
  });

  it('uses "Unknown" for missing category id', () => {
    const expenses: Expense[] = [
      {
        id: '1',
        amount: 10,
        description: 'a',
        date: '2025-01-01T00:00:00.000Z',
        categoryId: 'c99',
      },
    ];
    const result = computeByCategory(expenses, categories);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Unknown');
    expect(result[0].value).toBe(10);
  });
});
