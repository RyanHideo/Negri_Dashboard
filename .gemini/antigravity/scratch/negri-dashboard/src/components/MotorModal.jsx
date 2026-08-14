import React from 'react';
import { Dialog, Box, Typography, IconButton, useTheme, alpha } from '@mui/material';
import { Close } from '@mui/icons-material';
import { getStatusColor } from '../theme';
import DonutChart from './DonutChart';

const MotorModal = ({ motor, open, onClose }) => {
  const theme = useTheme();
  
  if (!motor) return null;

  const statusColor = getStatusColor(motor.status?.toLowerCase() || 'desligado', theme);
  const alarmeColor = motor.alarme && motor.alarme !== 'OK' ? theme.palette.error.main : theme.palette.success.main;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backgroundImage: 'none',
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: alpha('#000', 0.8),
            backdropFilter: 'blur(4px)',
          }
        }
      }}
    >
      <Box
        sx={{
          background: theme.palette.card.background,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${theme.palette.card.border}`,
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          position: 'relative',
        }}
      >
        <IconButton 
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 16, 
            top: 16,
            color: 'text.secondary',
            '&:hover': { color: 'text.primary', backgroundColor: alpha(theme.palette.text.primary, 0.1) }
          }}
        >
          <Close />
        </IconButton>

        <Typography variant="h5" color="text.primary" sx={{ mb: 4, pr: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box 
            component="span" 
            sx={{ 
              px: 1.5, 
              py: 0.5, 
              borderRadius: 1, 
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              color: theme.palette.primary.main,
              fontSize: '1rem',
              fontWeight: 700
            }}
          >
            {motor.id}
          </Box>
          {motor.nome}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 250 }}>
            <DonutChart 
              value={motor.cargaEstimada || 0} 
              label="Carga"
            />
          </Box>
          
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
            <Box>
              <Typography variant="overline" color="text.secondary">Status</Typography>
              <Typography variant="h6" sx={{ color: statusColor, textTransform: 'uppercase', fontWeight: 700 }}>
                {motor.status || 'Desligado'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="overline" color="text.secondary">Horímetro</Typography>
              <Typography variant="h6" color="text.primary">
                {motor.horimetro || 0} h
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="overline" color="text.secondary">Corrente</Typography>
              <Typography variant="h6" color="text.primary">
                {motor.corrente || 0} A
              </Typography>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">Alarme</Typography>
              <Typography variant="h6" sx={{ color: alarmeColor, fontWeight: 700 }}>
                {motor.alarme || 'OK'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">CCM</Typography>
              <Typography variant="h6" color="text.primary">
                {motor.ccm || '-'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.disabled" align="center" sx={{ whiteSpace: 'pre-line' }}>
          {'Percentual de carga e corrente em tempo real.\nValores baseados nas leituras de corrente do CLP e nos limites definidos no backend.'}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default MotorModal;
