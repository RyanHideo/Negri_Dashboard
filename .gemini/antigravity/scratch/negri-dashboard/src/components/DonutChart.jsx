import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DonutChart = ({ value = 0, maxValue = 100, label = 'CARGA', size = 'medium' }) => {
  const theme = useTheme();
  const numericValue = Number(value);
  const numericMax = Number(maxValue);
  const available = value !== null && Number.isFinite(numericValue) && Number.isFinite(numericMax) && numericMax > 0;
  const percentage = available ? Math.round((numericValue / numericMax) * 100) : null;

  const color = useMemo(() => {
    if (percentage === null) return theme.palette.text.disabled;
    if (percentage <= 60) return theme.palette.success.main;
    if (percentage <= 85) return theme.palette.warning.main;
    return theme.palette.error.main;
  }, [percentage, theme]);

  const data = [
    { name: 'Valor', value: available ? numericValue : 0 },
    { name: 'Restante', value: available ? Math.max(numericMax - numericValue, 0) : 1 },
  ];

  const sizeMap = {
    small: { dim: 90, textVariant: 'subtitle1' },
    medium: { dim: 120, textVariant: 'h5' },
    large: { dim: 160, textVariant: 'h4' },
  };
  const { dim, textVariant } = sizeMap[size] || sizeMap.medium;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content' }}>
      <Box sx={{ width: dim, height: dim, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="68%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              <Cell fill={color} />
              <Cell fill={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography variant={textVariant} sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            {percentage === null ? '—' : `${percentage}%`}
          </Typography>
        </Box>
      </Box>
      {label && (
        <Typography variant="caption" sx={{ mt: 0.5, color: theme.palette.text.secondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default DonutChart;
