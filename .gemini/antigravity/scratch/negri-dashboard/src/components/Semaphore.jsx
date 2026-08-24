import React from 'react';
import { Box } from '@mui/material';

const Semaphore = ({ estado = 'desligado' }) => {
  // estado: 'verde', 'vermelho' ou 'desligado'
  const colors = {
    vermelho: '#ef4444',
    verde: '#06d6a0',
  };

  const getStyle = (lightColor, active) => ({
    width: { xs: 30, sm: 40 },
    height: { xs: 30, sm: 40 },
    borderRadius: '50%',
    backgroundColor: active ? colors[lightColor] : '#2c3343',
    boxShadow: active ? `0 0 15px ${colors[lightColor]}, inset 0 0 10px rgba(255,255,255,0.5)` : 'inset 0 2px 4px rgba(0,0,0,0.5)',
    transition: 'all 0.3s ease',
    animation: active ? `pulse-${lightColor} 2s infinite` : 'none',
    opacity: active ? 1 : 0.3,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        p: 2,
        backgroundColor: '#1a1f2e',
        borderRadius: 4,
        border: '2px solid #2a3142',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5), inset 0 0 15px rgba(0,0,0,0.7)',
        width: 'fit-content',
        '@keyframes pulse-vermelho': {
          '0%': { boxShadow: `0 0 15px ${colors.vermelho}` },
          '50%': { boxShadow: `0 0 25px ${colors.vermelho}, 0 0 10px ${colors.vermelho}` },
          '100%': { boxShadow: `0 0 15px ${colors.vermelho}` },
        },
        '@keyframes pulse-verde': {
          '0%': { boxShadow: `0 0 15px ${colors.verde}` },
          '50%': { boxShadow: `0 0 25px ${colors.verde}, 0 0 10px ${colors.verde}` },
          '100%': { boxShadow: `0 0 15px ${colors.verde}` },
        },
      }}
    >
      <Box sx={getStyle('vermelho', estado === 'vermelho')} />
      <Box sx={getStyle('verde', estado === 'verde')} />
    </Box>
  );
};

export default Semaphore;
