import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Paper, Typography } from '@mui/material';
import type { Category, Expense } from '../types';

export function ExpensesListView({
  expenses,
  categories,
  onEdit,
  onDelete,
}: {
  expenses: Expense[];
  categories: Category[];
  onEdit: (e: Expense) => void;
  onDelete: (e: Expense) => void;
}) {
  const formatDate = (iso: string) => {
    // Prefer the stored ISO date's YYYY-MM-DD part to avoid timezone conversion issues
    if (!iso) return '';
    const datePart = iso.slice(0, 10);
    // Optionally convert to localized format:
    const [y, m, d] = datePart.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString();
  };
  return (
    <Paper sx={{ p: 2 }}>
      {expenses.map((e) => {
        const categoryName = categories.find(
          (c) => c.id === e.categoryId,
        )?.name;
        return (
          <div
            key={e.id}
            className="flex justify-between items-center py-2 border-b"
          >
            <div>
              <div className="font-medium">
                {categoryName} · {formatDate(e.date)}
              </div>
              <div className="text-sm text-gray-500">{e.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <Typography fontWeight={600}>${e.amount.toFixed(2)}</Typography>
              <IconButton size="small" onClick={() => onEdit(e)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(e)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        );
      })}
      {expenses.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
          No expenses match the selected filters.
        </Typography>
      )}
    </Paper>
  );
}
