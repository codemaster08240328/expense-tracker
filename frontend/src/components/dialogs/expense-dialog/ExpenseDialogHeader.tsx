import { MenuItem, Stack, TextField } from '@mui/material';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { Category } from '../../../types';
import type { ExpenseFormValues } from '../../../types/expenseForm';

export default function ExpenseDialogHeader({
  control,
  register,
  errors,
  categories,
  initialValues,
}: {
  control: Control<ExpenseFormValues>;
  register: UseFormRegister<ExpenseFormValues>;
  errors: Partial<FieldErrors<ExpenseFormValues>>;
  categories: Category[];
  initialValues?: Partial<Pick<ExpenseFormValues, 'categoryId' | 'date'>>;
}) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Controller
        name="categoryId"
        control={control}
        defaultValue={initialValues?.categoryId ?? ''}
        render={({ field }) => (
          <TextField
            select
            label="Category"
            {...field}
            error={!!errors.categoryId}
            helperText={errors.categoryId?.message as unknown as string}
            sx={{ flex: 1 }}
            autoFocus
          >
            <MenuItem value="">Select category</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <TextField
        label="Date"
        type="date"
        {...register('date')}
        error={!!errors.date}
        helperText={errors.date?.message as unknown as string}
        InputLabelProps={{ shrink: true }}
      />
    </Stack>
  );
}
