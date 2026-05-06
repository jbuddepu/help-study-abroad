import { useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme';
import { useAuthStore } from '../store/authStore';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    useAuthStore.getState().initAuth();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
