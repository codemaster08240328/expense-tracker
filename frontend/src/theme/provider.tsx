import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { ColorModeContext } from './context';

type Mode = 'light' | 'dark';

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Mode) || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                background: { default: '#0b1220', paper: '#0f172a' },
              }
            : {
                background: { default: '#f8fafc', paper: '#ffffff' },
              }),
        },
        shape: { borderRadius: 10 },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider
      value={{
        mode,
        toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
