import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, Container, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Calendar from './components/Calendar';
import Spaces from './components/Spaces';
import SpaceDetail from './components/SpaceDetail';

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
  const { isAuthenticated, logout, username } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Календарь', path: '/' },
    { text: 'Пространства', path: '/spaces' },
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
        <>
          <ListItem sx={{ py: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="subtitle1" color="text.primary">{username}</Typography>
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, textDecoration: 'underline', cursor: 'pointer' }}
              onClick={logout}
            >
              Выйти
            </Typography>
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <AppBar position="fixed">
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 2 }}>
                      <Typography variant="subtitle1" color="white" sx={{ fontWeight: 500 }}>{username}</Typography>
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={logout}
                      >
                        Выйти
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Toolbar>
          </AppBar>

          <Box sx={{ height: { xs: 56, sm: 64 } }} />

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
              <Route 
                path="/spaces/:id" 
                element={
                  isAuthenticated ? (
                    <SpaceDetail />
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