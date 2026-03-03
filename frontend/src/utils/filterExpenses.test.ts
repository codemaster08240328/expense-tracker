import { describe, it, expect } from 'vitest';
import { filterExpenses } from './filterExpenses';
import type { Expense } from '../types';

const expenses: Expense[] = [
  {
    id: '1',
    amount: 10,
    description: 'a',
    date: '2025-02-01T00:00:00.000Z',
    categoryId: 'c1',
  },
  {
    id: '2',
    amount: 20,
    description: 'b',
    date: '2025-02-15T00:00:00.000Z',
    categoryId: 'c1',
  },
  {
    id: '3',
    amount: 30,
    description: 'c',
    date: '2025-03-10T00:00:00.000Z',
    categoryId: 'c2',
  },
  {
    id: '4',
    amount: 40,
    description: 'd',
    date: '2025-04-01T00:00:00.000Z',
    categoryId: 'c1',
  },
];

describe('filterExpenses', () => {
  it('returns all expenses when no filters', () => {
    const result = filterExpenses(expenses, {});
    expect(result).toHaveLength(4);
  });

  it('filters by from date (inclusive)', () => {
    const result = filterExpenses(expenses, { from: '2025-03-01' });
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['3', '4']);
  });

  it('filters by to date (inclusive)', () => {
    const result = filterExpenses(expenses, { to: '2025-02-28' });
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('filters by categoryId', () => {
    const result = filterExpenses(expenses, { categoryId: 'c2' });
    expect(result).toHaveLength(1);
    expect(result[0].categoryId).toBe('c2');
  });

  it('combines from, to and categoryId', () => {
    const result = filterExpenses(expenses, {
      from: '2025-02-01',
      to: '2025-03-31',
      categoryId: 'c1',
    });
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
  });
});
