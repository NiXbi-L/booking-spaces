import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Calendar from './components/Calendar';
import Spaces from './components/Spaces';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          overflowX: 'hidden',
          width: '100%',
          height: '100%',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Calendar', path: '/' },
    { text: 'Spaces', path: '/spaces' },
  ];

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem 
          button 
          key={item.text} 
          component={Link} 
          to={item.path}
          onClick={() => setDrawerOpen(false)}
          sx={{ py: 2 }}
        >
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      {isAuthenticated && (
        <ListItem button onClick={logout} sx={{ py: 2 }}>
          <ListItemText primary="Logout" />
        </ListItem>
      )}
    </List>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <AppBar position="static">
            <Toolbar>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Booking System
              </Typography>
              {!isMobile && (
                <Box sx={{ display: 'flex' }}>
                  {menuItems.map((item) => (
                    <Typography
                      key={item.text}
                      variant="h6"
                      component={Link}
                      to={item.path}
                      sx={{
                        color: 'white',
                        textDecoration: 'none',
                        mx: 2,
                        cursor: 'pointer',
                      }}
                    >
                      {item.text}
                    </Typography>
                  ))}
                  {isAuthenticated && (
                    <Typography
                      variant="h6"
                      component="div"
                      onClick={logout}
                      sx={{
                        color: 'white',
                        mx: 2,
                        cursor: 'pointer',
                      }}
                    >
                      Logout
                    </Typography>
                  )}
                </Box>
              )}
            </Toolbar>
          </AppBar>

          <Drawer
            variant="temporary"
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 240,
                maxWidth: '100%'
              },
            }}
          >
            {drawer}
          </Drawer>

          <Container 
            component="main" 
            maxWidth={false} 
            sx={{ 
              flexGrow: 1, 
              p: { xs: 1, sm: 2, md: 3 },
              width: '100%',
              overflow: 'hidden'
            }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Calendar />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/auth"
                element={
                  !isAuthenticated ? (
                    <Auth />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route 
                path="/spaces" 
                element={
                  isAuthenticated ? (
                    <Spaces />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                } 
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 