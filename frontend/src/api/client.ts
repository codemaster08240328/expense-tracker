import type { Expense } from '../types';
import { serverApi } from './server';

export const api = {
  login: serverApi.login,
  signup: serverApi.signup,
  getCategories: serverApi.getCategories,
  createCategories: serverApi.createCategories,
  updateCategory: (id: string, data: Omit<import('../types').Category, 'id'>) =>
    serverApi.updateCategory(id, data),
  deleteCategories: serverApi.deleteCategories,
  getExpenses: serverApi.getExpenses,
  updateExpense: (id: string, data: Omit<Expense, 'id'>) =>
    serverApi.updateExpense(id, data),
  createExpense: serverApi.createExpense,
  deleteExpense: serverApi.deleteExpense,
};
