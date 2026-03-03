import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CategoryIcon from '@mui/icons-material/Category';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItem = (to: string, label: string, icon: React.ReactNode) => (
    <ListItemButton
      selected={pathname.startsWith(to)}
      onClick={() => navigate(to)}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );

  const content = (
    <Box sx={{ width: '100%' }}>
      <Toolbar />
      <List>
        {navItem('/expenses', 'Expenses', <ReceiptLongIcon />)}
        {navItem('/categories', 'Categories', <CategoryIcon />)}
        {navItem('/reports', 'Reports', <BarChartIcon />)}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
      ModalProps={{ keepMounted: true }}
    >
      {content}
    </Drawer>
  );
}
