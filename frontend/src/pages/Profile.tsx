import { Container, Paper, Typography, Stack } from '@mui/material';
import { useAuthStore } from '../state/authStore';

export default function Profile() {
  const { displayName, email } = useAuthStore();

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4 }}>
        <Stack spacing={1}>
          <Typography variant="h6">Profile</Typography>
          <Typography>
            <strong>Display name:</strong> {displayName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {email}
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
