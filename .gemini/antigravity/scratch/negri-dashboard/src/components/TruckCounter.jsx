import React from 'react';
import { Box, Typography, LinearProgress, Chip, useTheme } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';

const TruckCounter = ({ contagem = 0, meta = 100, ultimoPulso = '00:00:00' }) => {
  const theme = useTheme();
  const progress = Math.min((contagem / meta) * 100, 100) || 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalShipping sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />
        <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600 }}>
          Caminhões
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Courier New", monospace',
            color: theme.palette.primary.main,
            textShadow: `0 0 15px ${theme.palette.primary.main}40`,
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          {contagem.toString().padStart(3, '0')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            Meta: {meta}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {progress.toFixed(0)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.divider,
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              backgroundColor: progress >= 100 ? theme.palette.success.main : theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      <Chip
        label={`Último: ${ultimoPulso}`}
        size="small"
        variant="outlined"
        sx={{ fontSize: '0.65rem', height: 22, color: 'text.secondary', borderColor: theme.palette.divider }}
      />
    </Box>
  );
};

export default TruckCounter;
