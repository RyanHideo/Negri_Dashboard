import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { glassCardSx, getStatusColor } from '../theme';

const DataCard = ({ title, value, unit, status, subValues, icon: Icon }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...glassCardSx(theme),
        p: { xs: 2, md: 2.5 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontSize: '0.8rem',
          }}
        >
          {Icon && <Icon sx={{ fontSize: 18 }} />}
          {title}
        </Typography>
        {status && (
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: getStatusColor(status, theme),
              boxShadow: `0 0 8px ${alpha(getStatusColor(status, theme), 0.5)}`,
              flexShrink: 0,
            }}
          />
        )}
      </Box>

      <Typography
        variant="h5"
        color="text.primary"
        sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.5rem' }, lineHeight: 1.2 }}
      >
        {value}
        {unit && (
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            {unit}
          </Typography>
        )}
      </Typography>

      {subValues && subValues.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 'auto',
            pt: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
            gap: 1,
          }}
        >
          {subValues.map((sv, idx) => (
            <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                {sv.label}
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {sv.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DataCard;
