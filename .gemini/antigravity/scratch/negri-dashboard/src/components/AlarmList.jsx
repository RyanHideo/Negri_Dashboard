import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, useTheme, alpha } from '@mui/material';
import { WarningAmber as WarningAmberIcon, ErrorOutlined as ErrorOutlineIcon, CheckCircleOutlined as CheckCircleOutlineIcon } from '@mui/icons-material';
import { glassCardSx } from '../theme';

const AlarmList = ({ alarms = [] }) => {
  const theme = useTheme();

  return (
    <Box sx={{ ...glassCardSx(theme), display: 'flex', flexDirection: 'column', maxHeight: 300, overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.background.paper, 0.4) }}>
        <Typography variant="h6" color="text.primary" sx={{ fontSize: '1rem' }}>
          Alarmes Ativos
        </Typography>
      </Box>
      
      <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 0 }}>
        {alarms.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, gap: 1 }}>
            <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main, fontSize: 40 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhum alarme ativo.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {alarms.map((alarm, idx) => {
              const isFalha = alarm.tipo === 'falha';
              const colorMain = isFalha ? theme.palette.error.main : theme.palette.warning.main;
              const colorLight = isFalha ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.warning.main, 0.1);

              return (
                <ListItem 
                  key={alarm.id || idx}
                  sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    bgcolor: colorLight,
                    px: 2,
                    py: 1.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {isFalha ? (
                      <ErrorOutlineIcon sx={{ color: colorMain }} />
                    ) : (
                      <WarningAmberIcon sx={{ color: colorMain }} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={alarm.mensagem}
                    secondary={`${alarm.ccm} • ${alarm.timestamp}`}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: 'text.primary' }}
                    secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default AlarmList;
