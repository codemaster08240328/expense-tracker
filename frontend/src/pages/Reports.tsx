import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Papa from 'papaparse';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../api/client';
import CategoryLegend from '../components/chartwidgets/CategoryLegend';
import CustomizedLabel from '../components/chartwidgets/CustomizedLabel';
import { computeByCategory, computeMonthlyTotals } from '../utils/reports';
import type { Category, Expense } from '../types';

const COLORS = [
  '#4f46e5',
  '#22c55e',
  '#f97316',
  '#ef4444',
  '#06b6d4',
  '#a855f7',
];

export default function Reports() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getExpenses().then(setExpenses);
    api.getCategories().then(setCategories);
  }, []);

  const byMonth = useMemo(
    () => computeMonthlyTotals(expenses, new Date().getFullYear()),
    [expenses],
  );

  const byCategory = useMemo(() => {
    const items = computeByCategory(expenses, categories);
    return items.map((item, idx) => ({
      ...item,
      fill: COLORS[idx % COLORS.length],
      color: COLORS[idx % COLORS.length],
    }));
  }, [expenses, categories]);

  const exportCsv = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Box
          component="div"
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Typography variant="h5">Reports</Typography>

          <Button variant="outlined" onClick={exportCsv}>
            Export CSV
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Chart 1: Total by month */}
            <Paper sx={{ p: 2, height: 500 }}>
              <Typography variant="subtitle1" gutterBottom>
                Total spending by month
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={byMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#82ca9d" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Chart 2: Breakdown by category */}
            <Paper sx={{ p: 2, height: 500 }}>
              <Typography variant="subtitle1" gutterBottom>
                Spending breakdown by category
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    labelLine={false}
                    label={CustomizedLabel}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={140}
                  ></Pie>
                  <Legend iconType="circle" />
                  <CategoryLegend data={byCategory} align="center" gap={12} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
