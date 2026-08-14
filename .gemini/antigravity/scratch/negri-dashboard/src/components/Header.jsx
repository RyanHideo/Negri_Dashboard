import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme, alpha } from '@mui/material';
import ThemeToggle from './ThemeToggle';
import TabNav from './TabNav';

const Header = ({ currentTab, onTabChange, darkMode, onToggleTheme }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: { xs: 48, md: 52 },
          px: { xs: 1, sm: 2 },
          gap: { xs: 0.5, sm: 1.5 },
        }}
      >
        {/* Sinapse Logo + Negri */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Box
            component="img"
            src="/sinapse-logo.png"
            alt="Sinapse Soluções"
            sx={{
              height: { xs: 38, sm: 44 },
              objectFit: 'contain',
              filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
            }}
          />
          <Box
            sx={{
              width: '1px',
              height: 24,
              bgcolor: theme.palette.divider,
              display: { xs: 'none', sm: 'block' },
            }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/logo.jpg"
              alt="Grupo Negri"
              sx={{
                height: 30,
                width: 30,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                display: { xs: 'none', md: 'block' },
                color: 'text.primary',
                whiteSpace: 'nowrap',
                fontSize: '0.8rem',
              }}
            >
              Painel de Gestão • Negri
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'center' },
            overflowX: 'auto',
            mx: { xs: 0.5, sm: 1 },
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          <TabNav currentTab={currentTab} onTabChange={onTabChange} />
        </Box>

        {/* Theme Toggle */}
        <Box sx={{ flexShrink: 0 }}>
          <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
