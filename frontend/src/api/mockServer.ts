import type { Category, Expense } from '../types';

type User = { id: string; displayName: string; email: string };

const token = 'mock-jwt-token';

let gcrypto: Crypto | undefined;
if (typeof globalThis !== 'undefined' && 'crypto' in globalThis) {
  gcrypto = (globalThis as unknown as { crypto?: Crypto }).crypto;
}
const uuid = () =>
  gcrypto && typeof gcrypto.randomUUID === 'function'
    ? gcrypto.randomUUID()
    : Math.random().toString(36).slice(2, 9);

let users: User[] = [
  { id: 'u1', displayName: 'Alex', email: 'alex@example.com' },
];

let expenses: Expense[] = [
  {
    id: '1',
    amount: 12.5,
    categoryId: '1',
    description: 'Lunch',
    date: new Date().toISOString(),
  },
];

let categories: Category[] = [
  {
    id: '1',
    name: 'Food',
    monthlyBudget: 500,
  },
  {
    id: '2',
    name: 'Travel',
    monthlyBudget: 150,
  },
];

export const mockApi = {
  login: async (email: string): Promise<{ token: string; user: User }> => {
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error('Invalid email or password');
    return { token, user };
  },
  signup: async (
    displayName: string,
    email: string,
  ): Promise<{ token: string; user: User }> => {
    if (users.some((u) => u.email === email)) {
      throw new Error('An account with this email already exists');
    }
    const user: User = { id: uuid(), displayName, email };
    users = [...users, user];
    return { token, user };
  },
  getCategories: async (): Promise<Category[]> => {
    await new Promise((r) => setTimeout(r, 300));
    return [...categories];
  },
  createCategories: async (data: Omit<Category, 'id'>): Promise<Category> => {
    await new Promise((r) => setTimeout(r, 150));
    const newCategory: Category = {
      ...data,
      id: uuid(),
      monthlyBudget: data.monthlyBudget ?? 0,
    };
    categories = [...categories, newCategory];
    return newCategory;
  },
  updateCategory: async (
    id: string,
    data: Omit<Category, 'id'>,
  ): Promise<Category> => {
    await new Promise((r) => setTimeout(r, 150));
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    const updated: Category = { ...categories[index], ...data, id };
    categories[index] = updated;
    return updated;
  },
  deleteCategories: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 150));
    categories = categories.filter((e) => e.id !== id);
  },
  getExpenses: async (): Promise<Expense[]> => {
    await new Promise((r) => setTimeout(r, 300));
    return [...expenses];
  },
  updateExpense: async (
    id: string,
    data: Omit<Expense, 'id'>,
  ): Promise<Expense> => {
    await new Promise((r) => setTimeout(r, 150));
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Expense not found');

    const updated: Expense = { ...data, id };
    expenses[index] = updated;

    return updated;
  },
  createExpense: async (data: Omit<Expense, 'id'>): Promise<Expense> => {
    await new Promise((r) => setTimeout(r, 150));
    const newExpense: Expense = { ...data, id: uuid() };
    expenses = [...expenses, newExpense];
    return newExpense;
  },
  deleteExpense: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 150));
    expenses = expenses.filter((e) => e.id !== id);
  },
};
