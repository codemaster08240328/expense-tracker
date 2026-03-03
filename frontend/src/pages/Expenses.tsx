import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import {
  ExpenseDialog,
  type ExpenseDialogValues,
} from '../components/dialogs/expense-dialog/ExpenseDialog';
import { ExpensesFilters } from '../components/ExpensesFilters';
import { ExpensesListView } from '../components/ExpensesListView';
import type { Category, Expense } from '../types';
import { filterExpenses } from '../utils/filterExpenses';
import { localDateToISOString } from '../utils/date';

// Page-level state and handlers only — dialogs handle form state internally
export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [toEdit, setToEdit] = useState<Expense | null>(null);
  const [toDelete, setToDelete] = useState<Expense | null>(null);

  // Filters
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const filtered = useMemo(
    () =>
      filterExpenses(expenses, {
        from: from || undefined,
        to: to || undefined,
        categoryId: categoryFilter || undefined,
      }),
    [expenses, from, to, categoryFilter],
  );

  const createExpense = async (values: ExpenseDialogValues) => {
    try {
      const created = await api.createExpense({
        description: values.description.trim(),
        amount: Number(values.amount),
        categoryId: values.categoryId.trim(),
        date: localDateToISOString(values.date as string),
      });
      setExpenses((prev) => [...prev, created]);
      setOpenCreate(false);
    } catch {
      // handled by dialog
    }
  };

  const updateExpense = async (values: ExpenseDialogValues) => {
    if (!toEdit) return;

    try {
      const updated = await api.updateExpense(toEdit.id, {
        description: values.description.trim(),
        amount: Number(values.amount),
        categoryId: values.categoryId,
        date: localDateToISOString(values.date as string),
      });

      setExpenses((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e)),
      );

      setToEdit(null);
      setOpenEdit(false);
    } catch {
      // handled by dialog
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.deleteExpense(toDelete.id);
      setExpenses((prev) => prev.filter((e) => e.id !== toDelete.id));
      setToDelete(null);
    } catch {
      // handled by dialog
    }
  };

  const openEditDialog = (e: Expense) => {
    setToEdit(e);
    setOpenEdit(true);
  };

  useEffect(() => {
    api.getCategories().then(setCategories);
    api.getExpenses().then(setExpenses);
  }, []);

  return (
    <Container maxWidth="lg">
      <Stack spacing={2}>
        <Typography variant="h5">Expenses</Typography>

        <ExpensesFilters
          from={from}
          to={to}
          categoryFilter={categoryFilter}
          categories={categories}
          onFromChange={setFrom}
          onToChange={setTo}
          onCategoryChange={setCategoryFilter}
          onClear={() => {
            setFrom('');
            setTo('');
            setCategoryFilter('');
          }}
          onAdd={() => setOpenCreate(true)}
        />

        <ExpensesListView
          expenses={filtered}
          categories={categories}
          onEdit={(e) => openEditDialog(e)}
          onDelete={(e) => setToDelete(e)}
        />
      </Stack>

      <ExpenseDialog
        open={openCreate}
        title="Add expense"
        submitLabel="Add"
        categories={categories}
        expenses={expenses}
        onClose={() => setOpenCreate(false)}
        onSave={createExpense}
      />

      <ExpenseDialog
        open={openEdit}
        title="Edit expense"
        submitLabel="Save"
        categories={categories}
        initialValues={
          toEdit
            ? {
                description: toEdit.description,
                amount: String(toEdit.amount),
                categoryId: toEdit.categoryId,
                date: toEdit.date.slice(0, 10),
              }
            : undefined
        }
        expenses={expenses}
        onClose={() => setOpenEdit(false)}
        onSave={updateExpense}
      />

      {/* Delete confirmation */}
      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete expense?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{toDelete?.description}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
