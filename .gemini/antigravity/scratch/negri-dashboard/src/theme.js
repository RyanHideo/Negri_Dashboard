import { createTheme, alpha } from '@mui/material/styles';

const sharedTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 600 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  subtitle1: { fontWeight: 500 },
  subtitle2: { fontWeight: 500 },
  button: { fontWeight: 600, textTransform: 'none' },
};

const sharedComponents = (mode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        minHeight: '100dvh',
      },
      '*': {
        boxSizing: 'border-box',
      },
      '::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
        borderRadius: '3px',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
});

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          primary: { main: '#06d6a0', light: '#33e0b3', dark: '#04a57c' },
          secondary: { main: '#00b4d8', light: '#33c3e0', dark: '#008ca8' },
          warning: { main: '#f59e0b', light: '#f7b13c', dark: '#c07c09' },
          error: { main: '#ef4444', light: '#f26969', dark: '#bf3636' },
          info: { main: '#6366f1', light: '#8284f4', dark: '#4f52c1' },
          success: { main: '#06d6a0' },
          background: {
            default: '#0a0e1a',
            paper: '#0f172a',
          },
          text: {
            primary: '#e2e8f0',
            secondary: '#94a3b8',
            disabled: '#475569',
          },
          divider: 'rgba(148, 163, 184, 0.12)',
          card: {
            background: 'rgba(15, 23, 42, 0.7)',
            border: 'rgba(148, 163, 184, 0.1)',
            hover: 'rgba(15, 23, 42, 0.85)',
          },
        }
      : {
          primary: { main: '#059669', light: '#06d6a0', dark: '#047857' },
          secondary: { main: '#0284c7', light: '#00b4d8', dark: '#0369a1' },
          warning: { main: '#d97706', light: '#f59e0b', dark: '#b45309' },
          error: { main: '#dc2626', light: '#ef4444', dark: '#b91c1c' },
          info: { main: '#4f46e5', light: '#6366f1', dark: '#4338ca' },
          success: { main: '#059669' },
          background: {
            default: '#f0f4f8',
            paper: '#ffffff',
          },
          text: {
            primary: '#1e293b',
            secondary: '#475569',
            disabled: '#94a3b8',
          },
          divider: 'rgba(0, 0, 0, 0.08)',
          card: {
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'rgba(0, 0, 0, 0.06)',
            hover: 'rgba(255, 255, 255, 0.95)',
          },
        }),
  },
  typography: sharedTypography,
  shape: { borderRadius: 12 },
  components: sharedComponents(mode),
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));

// Glass card style helper
export const glassCardSx = (theme) => ({
  background: theme.palette.card.background,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${theme.palette.card.border}`,
  borderRadius: 2,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: theme.palette.card.hover,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
  },
});

// Status color helper
export const getStatusColor = (status, theme) => {
  switch (status) {
    case 'on':
    case 'ligado':
    case 'good':
      return theme.palette.primary.main;
    case 'off':
    case 'desligado':
      return theme.palette.text.disabled;
    case 'alarm':
    case 'falha':
    case 'bad':
      return theme.palette.error.main;
    case 'warning':
    case 'atenção':
    case 'unavailable':
    case 'indisponivel':
      return theme.palette.warning.main;
    default:
      return theme.palette.text.secondary;
  }
};
