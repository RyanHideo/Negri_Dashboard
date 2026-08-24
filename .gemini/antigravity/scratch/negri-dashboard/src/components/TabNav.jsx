import React from 'react';
import { Tabs, Tab, useTheme, alpha } from '@mui/material';

const TabNav = ({ currentTab, onTabChange }) => {
  const theme = useTheme();

  const tabs = ['CCM', 'Motores'];

  return (
    <Tabs
      value={currentTab}
      onChange={(_, newValue) => onTabChange(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{
        minHeight: 36,
        '& .MuiTabs-indicator': { display: 'none' },
        '& .MuiTabs-flexContainer': { gap: { xs: 0.5, sm: 0.75 } },
        '& .MuiTabs-scrollButtons': {
          color: theme.palette.text.secondary,
          width: 28,
        },
      }}
    >
      {tabs.map((label, idx) => (
        <Tab
          key={label}
          label={label}
          sx={{
            minHeight: 32,
            minWidth: 'auto',
            px: { xs: 1.5, sm: 2 },
            py: 0.5,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            fontWeight: 600,
            borderRadius: 2,
            color: 'text.secondary',
            textTransform: 'none',
            transition: 'all 0.2s ease',
            background: currentTab === idx
              ? alpha(theme.palette.primary.main, 0.15)
              : 'transparent',
            border: currentTab === idx
              ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
              : '1px solid transparent',
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              fontWeight: 700,
            },
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabNav;
