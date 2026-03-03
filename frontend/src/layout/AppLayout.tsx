import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const drawerWidth = 240;

export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header onToggle={() => setOpen((v) => !v)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 8,
          ml: !isMobile && open ? `${drawerWidth}px` : 0,
          transition: (t) => t.transitions.create('margin'),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
