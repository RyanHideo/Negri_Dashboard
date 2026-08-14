import { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createAppTheme } from './theme';

import Header from './components/Header';
import CCM1Page from './pages/CCM1Page';
import CCM2Page from './pages/CCM2Page';
import QuadroPage from './pages/QuadroPage';
import MotoresPage from './pages/MotoresPage';

const TAB_LABELS = ['CCM 1', 'CCM 2', 'Quadro', 'Motores'];

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  // Persist theme preference
  useState(() => {
    const saved = localStorage.getItem('negri-theme');
    if (saved !== null) {
      setDarkMode(saved === 'dark');
    }
  }, []);

  const theme = useMemo(
    () => createAppTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('negri-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
  };

  const renderPage = () => {
    switch (currentTab) {
      case 0:
        return <CCM1Page />;
      case 1:
        return <CCM2Page />;
      case 2:
        return <QuadroPage />;
      case 3:
        return <MotoresPage />;
      default:
        return <CCM1Page />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          width: '100vw',
          overflow: 'hidden',
          bgcolor: 'background.default',
          transition: 'background-color 0.4s ease',
        }}
      >
        <Header
          currentTab={currentTab}
          onTabChange={handleTabChange}
          darkMode={darkMode}
          onToggleTheme={handleToggleTheme}
          tabLabels={TAB_LABELS}
        />
        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderPage()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
