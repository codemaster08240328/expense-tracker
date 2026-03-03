import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Category, Expense } from '../types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');

  useEffect(() => {
    api.getCategories().then(setCategories);
    api.getExpenses().then(setExpenses);
  }, []);

  const addCategory = async () => {
    if (!newName) return;
    const created = await api.createCategories({
      name: newName,
      monthlyBudget: Number(newBudget) || 0,
    });
    setCategories((s) => [...s, created]);
    setNewName('');
    setNewBudget('');
  };

  const updateCategory = async (id: string, monthlyBudget: number) => {
    const updated = await api.updateCategory(id, {
      name: categories.find((c) => c.id === id)?.name ?? '',
      monthlyBudget,
    });
    setCategories((s) => s.map((c) => (c.id === id ? updated : c)));
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const spentThisMonth = (categoryId: string) => {
    return expenses
      .filter((e) => e.categoryId === categoryId)
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((s, e) => s + e.amount, 0);
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Typography variant="h5">Categories & Budgets</Typography>

        <Paper className="p-3">
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              label="Category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <TextField
              size="small"
              label="Monthly budget"
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
            />
            <Button variant="contained" onClick={addCategory}>
              Add
            </Button>
          </Stack>
        </Paper>

        <Paper className="p-3">
          {categories.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Typography color="text.secondary">
                No categories yet. Add your first category using the form above.
              </Typography>
            </div>
          ) : (
            <>
              {categories.map((c) => {
                const spent = spentThisMonth(c.id);
                const remaining = (c.monthlyBudget ?? 0) - spent;
                return (
                  <div
                    key={c.id}
                    className="flex justify-between py-2 border-b"
                  >
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-gray-500">
                        Budget: ${(c.monthlyBudget ?? 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm" style={{ textAlign: 'right' }}>
                      <div>Spent: ${spent.toFixed(2)}</div>
                      <div style={{ color: remaining < 0 ? 'red' : 'inherit' }}>
                        Remaining: ${remaining.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <TextField
                        size="small"
                        label="Update budget"
                        type="number"
                        defaultValue={c.monthlyBudget ?? 0}
                        onBlur={(e) =>
                          updateCategory(c.id, Number(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
