import { useState, useMemo } from 'react';
import { Alert, Box, Button, CssBaseline, LinearProgress, ThemeProvider } from '@mui/material';
import { createAppTheme } from './theme';

import Header from './components/Header';
import CCM1Page from './pages/CCM1Page';
import CCM2Page from './pages/CCM2Page';
import MotoresPage from './pages/MotoresPage';
import { DataProvider, useDashboardData } from './data/DataContext';

const TAB_LABELS = ['CCM 1', 'CCM 2', 'Motores'];

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

  const { data, error, loading, lastSuccessfulAt, refresh } = useDashboardData();

  const renderPage = () => {
    switch (currentTab) {
      case 0:
        return <CCM1Page data={data} />;
      case 1:
        return <CCM2Page data={data} />;
      case 2:
        return <MotoresPage data={data} />;
      default:
        return <CCM1Page data={data} />;
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
        {loading && <LinearProgress sx={{ flexShrink: 0 }} />}
        {error && (
          <Alert
            severity="warning"
            action={(
              <Button color="inherit" size="small" onClick={refresh}>
                Tentar agora
              </Button>
            )}
            sx={{ borderRadius: 0, flexShrink: 0 }}
          >
            API do CCM1 indisponível. O painel continuará aberto e tentará novamente automaticamente.
            {lastSuccessfulAt && ` Última leitura válida: ${lastSuccessfulAt.toLocaleTimeString('pt-BR')}.`}
          </Alert>
        )}
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

function AppWithData() {
  return <DataProvider><App /></DataProvider>;
}

export default AppWithData;
