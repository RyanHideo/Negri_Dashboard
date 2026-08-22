import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { glassCardSx, getStatusColor } from '../theme';

const MotorCard = ({ motor, onClick }) => {
  const theme = useTheme();
  const statusColor = getStatusColor(motor?.status?.toLowerCase() || 'desligado', theme);

  return (
    <Box 
      onClick={() => onClick && onClick(motor)}
      sx={{ 
        ...glassCardSx(theme),
        p: 2,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          ...glassCardSx(theme)['&:hover'],
          transform: 'scale(1.02)',
          border: `1px solid ${statusColor}`,
          boxShadow: `0 8px 32px ${alpha(statusColor, 0.15)}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              backgroundColor: statusColor,
              boxShadow: `0 0 8px ${statusColor}`
            }} 
          />
          <Box 
            sx={{ 
              px: 1, 
              py: 0.25, 
              borderRadius: 1, 
              backgroundColor: alpha(theme.palette.text.primary, 0.1),
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {motor?.id || 'M-'}
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {motor?.ccm || 'CCM-'}
        </Typography>
      </Box>

      <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 700, noWrap: true }}>
        {motor?.nome || 'Motor Desconhecido'}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Status</Typography>
          <Typography variant="body2" sx={{ color: statusColor, fontWeight: 600, textTransform: 'capitalize' }}>
            {motor?.status || 'Desligado'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Horímetro</Typography>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
            {motor?.horimetro ?? '—'} h
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Corrente</Typography>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
            {motor?.corrente ?? '—'} A
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Carga</Typography>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
            {motor?.cargaEstimada === null || motor?.cargaEstimada === undefined ? '—' : `${motor.cargaEstimada}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MotorCard;
