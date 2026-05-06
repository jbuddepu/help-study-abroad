import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { grey } from '@mui/material/colors';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { token, loading, error } = useAuthStore((state) => ({
    token: state.token,
    loading: state.loading,
    error: state.error
  }));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token) {
      router.replace('/dashboard');
    }
  }, [router, token]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        await login(username, password);
        router.push('/dashboard');
      } catch (error) {
        // authStore error state drives the error Alert on this page
      }
    },
    [login, password, router, username]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: grey[100],
        px: 2
      }}
    >
      <Paper sx={{ maxWidth: 400, width: '100%', p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
          </Box>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            Admin Login
          </Typography>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
          <Collapse in={Boolean(error)} sx={{ mt: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Collapse>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Test: emilys / emilyspass
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
