import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Paper,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../api/client';
import { useAuthStore } from '../state/authStore';
import { useNavigate, Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await api.login(values.email, values.password);
      login(res.token, {
        id: res.user.id,
        displayName: res.user.displayName,
        email: res.user.email,
      });
      navigate('/expenses', { replace: true });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Login failed. Please try again.';
      setServerError(message);
    }
  };

  return (
    <Container maxWidth="sm" className="min-h-screen flex items-center">
      <Paper className="p-6 w-full">
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} className="mt-2">
            {serverError && <Alert severity="error">{serverError}</Alert>}

            <TextField
              label="Email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>

            <Link to="/signup" className="text-blue-600">
              Create account
            </Link>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
