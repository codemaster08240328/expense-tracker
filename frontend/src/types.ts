export type Expense = {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  monthlyBudget?: number;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
};
