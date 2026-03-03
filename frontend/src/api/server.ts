// API client for backend endpoints
import type { Category, Expense, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json();
}

export const serverApi = {
  // Auth
  login: async (email: string, password: string) => {
    return request<{ token: string; user: User }>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  signup: async (displayName: string, email: string, password: string) => {
    return request<{ token: string; user: User }>(`${API_BASE}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ displayName, email, password }),
    });
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    return request<Category[]>(`${API_BASE}/categories`, { method: 'GET' });
  },
  createCategories: async (data: Omit<Category, 'id'>): Promise<Category> => {
    return request<Category>(`${API_BASE}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateCategory: async (
    id: string,
    data: Omit<Category, 'id'>,
  ): Promise<Category> => {
    return request<Category>(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteCategories: async (id: string): Promise<void> => {
    await request<void>(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
  },

  // Expenses
  getExpenses: async (): Promise<Expense[]> => {
    return request<Expense[]>(`${API_BASE}/expenses`, { method: 'GET' });
  },
  createExpense: async (data: Omit<Expense, 'id'>): Promise<Expense> => {
    return request<Expense>(`${API_BASE}/expenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateExpense: async (
    id: string,
    data: Omit<Expense, 'id'>,
  ): Promise<Expense> => {
    return request<Expense>(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteExpense: async (id: string): Promise<void> => {
    await request<void>(`${API_BASE}/expenses/${id}`, { method: 'DELETE' });
  },
};
