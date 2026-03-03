import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import type { Category, Expense } from '../../../types';
import { ExpenseDialogHeader, ExpenseDialogBudget } from '.';

const schema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const n = Number(val);
      return !Number.isNaN(n) && n > 0;
    }, 'Amount must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
});

type FormValues = z.infer<typeof schema>;
export type ExpenseDialogValues = FormValues;

export function ExpenseDialog({
  open,
  title = '',
  submitLabel = 'Save',
  initialValues,
  categories,
  expenses,
  onClose,
  onSave,
}: {
  open: boolean;
  title?: string;
  submitLabel?: string;
  initialValues?: Partial<{
    description: string;
    amount: string;
    categoryId: string;
    date: string;
  }>;
  categories: Category[];
  expenses?: Expense[];
  onClose: () => void;
  onSave: (values: FormValues) => Promise<void> | void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    if (open) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayInput = `${yyyy}-${mm}-${dd}`;

      reset({
        description: initialValues?.description ?? '',
        amount: initialValues?.amount ?? '',
        categoryId: initialValues?.categoryId ?? '',
        date: initialValues?.date ?? todayInput,
      });
    }
  }, [open, initialValues, reset]);

  const [serverError, setServerError] = React.useState<string | null>(null);

  const watchedCategory = useWatch({ control, name: 'categoryId' }) as
    | string
    | undefined;
  const watchedDate = useWatch({ control, name: 'date' }) as string | undefined;
  const watchedAmount = useWatch({ control, name: 'amount' }) as
    | string
    | undefined;

  const budgetStatus = React.useMemo(() => {
    const catId = watchedCategory || initialValues?.categoryId;
    const dateStr = watchedDate || initialValues?.date;
    if (!catId || !dateStr || !expenses) return null;

    const [y, m] = dateStr.split('-').map(Number);
    const spent = expenses
      .filter((e) => e.categoryId === catId)
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === y && d.getMonth() + 1 === m;
      })
      .reduce((s, e) => s + e.amount, 0);

    const cat = categories.find((c) => c.id === catId);
    const budget = cat?.monthlyBudget ?? 0;
    const currentRemaining = budget - spent;

    // compute projected values based on watchedAmount
    const newAmountNum = watchedAmount ? Number(watchedAmount) : undefined;
    let projectedSpent = spent;
    if (typeof newAmountNum === 'number' && !Number.isNaN(newAmountNum)) {
      const initialAmt = initialValues?.amount
        ? Number(initialValues.amount)
        : 0;
      // if editing (initial amount present), replace initial amount; otherwise add
      if (initialValues?.amount) {
        projectedSpent = spent - initialAmt + newAmountNum;
      } else {
        projectedSpent = spent + newAmountNum;
      }
    }

    const projectedRemaining = budget - projectedSpent;

    return {
      budget,
      spent,
      remaining: currentRemaining,
      projectedSpent,
      projectedRemaining,
    };
  }, [
    watchedCategory,
    watchedDate,
    watchedAmount,
    initialValues,
    expenses,
    categories,
  ]);

  const submit = async (values: FormValues) => {
    setServerError(null);
    try {
      await onSave(values);
      reset();
      onClose();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setServerError(message || 'Failed to save expense.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(submit)} noValidate>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {serverError && <Alert severity="error">{serverError}</Alert>}

            {/* Header (Category + Date) */}
            <ExpenseDialogHeader
              control={control}
              register={register}
              errors={errors}
              categories={categories}
              initialValues={initialValues}
            />

            {/* Budget status (shows after category/date selection) */}
            <ExpenseDialogBudget budgetStatus={budgetStatus} />

            {/* Second row: Amount */}
            <TextField
              label="Amount"
              type="number"
              {...register('amount')}
              error={!!errors.amount}
              helperText={errors.amount?.message as unknown as string}
              inputProps={{ min: 0, step: '0.01' }}
            />

            {/* Third row: Description (multiline) */}
            <TextField
              label="Description"
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message as unknown as string}
              multiline
              minRows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
