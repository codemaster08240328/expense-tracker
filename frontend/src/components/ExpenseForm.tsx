import { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import type { Expense } from '../types';

export function ExpenseForm({
  onCreate,
}: {
  onCreate: (e: Omit<Expense, 'id'>) => void;
}) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!description || !amount) return;
        onCreate({
          description,
          amount: Number(amount),
          categoryId: 'General',
          date: new Date().toISOString(),
        });
        setDescription('');
        setAmount('');
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button type="submit" variant="contained">
          Add
        </Button>
      </Stack>
    </form>
  );
}
