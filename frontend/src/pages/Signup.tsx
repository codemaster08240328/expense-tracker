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

const schema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Display name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function Signup() {
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
      const res = await api.signup(
        values.displayName,
        values.email,
        values.password,
      );
      login(res.token, {
        id: res.user.id,
        displayName: res.user.displayName,
        email: res.user.email,
      });
      navigate('/expenses', { replace: true });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Signup failed. Please try again.';
      setServerError(message);
    }
  };

  return (
    <Container maxWidth="sm" className="min-h-screen flex items-center">
      <Paper className="p-6 w-full">
        <Typography variant="h5">Create account</Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} className="mt-2">
            {serverError && <Alert severity="error">{serverError}</Alert>}

            <TextField
              label="Display name"
              {...register('displayName')}
              error={!!errors.displayName}
              helperText={errors.displayName?.message}
            />
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
            <TextField
              label="Confirm password"
              type="password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Sign up'}
            </Button>

            <Link to="/login" className="text-blue-600">
              Back to login
            </Link>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
