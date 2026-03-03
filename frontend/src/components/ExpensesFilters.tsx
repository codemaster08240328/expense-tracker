import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import type { Theme } from '@mui/material';
import type { Category } from '../types';

export function ExpensesFilters({
  from,
  to,
  categoryFilter,
  categories,
  onFromChange,
  onToChange,
  onCategoryChange,
  onClear,
  onAdd,
}: {
  from: string;
  to: string;
  categoryFilter: string;
  categories: Category[];
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onClear: () => void;
  onAdd: () => void;
}) {
  const dateSx = {
    // Brighten native calendar icon in dark mode (WebKit browsers)
    "& input[type='date']::-webkit-calendar-picker-indicator": {
      filter: (theme: Theme) =>
        theme.palette.mode === 'dark' ? 'invert(1) brightness(2)' : 'none',
      opacity: 0.95,
    },
    // Ensure input text follows theme
    '& .MuiInputBase-input': {
      color: (theme: Theme) => theme.palette.text.primary,
    },
  } as const;

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            label="From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            sx={dateSx}
          />
          <TextField
            size="small"
            label="To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            sx={dateSx}
          />
          <TextField
            size="small"
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" onClick={onClear}>
            Clear
          </Button>
        </Box>
        <Box>
          <Button variant="contained" onClick={onAdd}>
            Add Expense
          </Button>
        </Box>
      </Box>
    </Stack>
  );
}
