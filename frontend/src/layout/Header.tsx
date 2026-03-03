import { useContext, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../theme/context';
import {
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuthStore } from '../state/authStore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function Header({ onToggle }: { onToggle: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const displayName = useAuthStore((s) => s.displayName) ?? 'User';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, toggle } = useContext(ColorModeContext);

  const title = useMemo(() => {
    if (pathname.startsWith('/expenses')) return 'Expenses';
    if (pathname.startsWith('/categories')) return 'Categories';
    if (pathname.startsWith('/reports')) return 'Reports';
    if (pathname.startsWith('/profile')) return 'Profile';
    return 'Dashboard';
  }, [pathname]);

  return (
    <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <IconButton color="inherit" onClick={toggle} sx={{ mr: 1 }}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <IconButton
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Avatar />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem disabled>Signed in as {displayName}</MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate('/profile');
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
