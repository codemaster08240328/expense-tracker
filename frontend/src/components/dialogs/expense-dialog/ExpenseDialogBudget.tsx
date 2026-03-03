import { Box, Typography } from '@mui/material';

export default function ExpenseDialogBudget({
  budgetStatus,
}: {
  budgetStatus: null | {
    budget: number;
    spent: number;
    remaining: number;
    projectedSpent?: number;
    projectedRemaining?: number;
  };
}) {
  if (!budgetStatus) return null;
  const hasProjection =
    typeof budgetStatus.projectedSpent === 'number' &&
    typeof budgetStatus.projectedRemaining === 'number';
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        bgcolor: (t) =>
          t.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(0,0,0,0.02)',
      }}
    >
      <Typography variant="body2">
        Budget: ${budgetStatus.budget.toFixed(2)}
      </Typography>
      <Typography variant="body2">
        Spent: ${budgetStatus.spent.toFixed(2)}
        {hasProjection &&
          budgetStatus.projectedSpent !== budgetStatus.spent && (
            <span>
              {' '}
              &nbsp;→&nbsp; ${budgetStatus.projectedSpent!.toFixed(2)}
            </span>
          )}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color:
            hasProjection && budgetStatus.projectedRemaining! < 0
              ? 'red'
              : budgetStatus.remaining < 0
              ? 'red'
              : 'inherit',
        }}
      >
        Remaining: ${budgetStatus.remaining.toFixed(2)}
        {hasProjection &&
          budgetStatus.projectedRemaining !== budgetStatus.remaining && (
            <span>
              {' '}
              &nbsp;→&nbsp; ${budgetStatus.projectedRemaining!.toFixed(2)}
            </span>
          )}
      </Typography>
    </Box>
  );
}
