import React from 'react';
import { IconButton } from '@mui/material';
import { LightMode as LightModeIcon, DarkMode as DarkModeIcon } from '@mui/icons-material';

const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <IconButton 
      onClick={onToggle}
      color="inherit"
      sx={{
        transition: 'transform 0.5s ease',
        transform: darkMode ? 'rotate(-180deg)' : 'rotate(0deg)',
        color: darkMode ? 'warning.light' : 'primary.dark',
      }}
      aria-label="Alternar tema"
    >
      {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default ThemeToggle;
