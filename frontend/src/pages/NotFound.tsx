import { Container, Paper, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}
    >
      <Paper sx={{ p: 4, width: '100%', textAlign: 'center' }}>
        <Stack spacing={2}>
          <Typography variant="h4">404</Typography>
          <Typography variant="h6">Page not found</Typography>
          <Typography color="text.secondary">
            The page you’re looking for doesn’t exist or has been moved.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/expenses')}>
            Go to Expenses
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
