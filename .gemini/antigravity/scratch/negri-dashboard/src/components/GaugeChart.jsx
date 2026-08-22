import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GaugeChart = ({ value = 0, total = 100, unit = 'kVA', label = 'Potência Aparente' }) => {
  const theme = useTheme();
  const numericValue = Number(value);
  const numericTotal = Number(total);
  const available = value !== null && total !== null && Number.isFinite(numericValue) && Number.isFinite(numericTotal) && numericTotal > 0;
  const percentage = available ? Math.round((numericValue / numericTotal) * 100) : null;

  const color = useMemo(() => {
    if (percentage === null) return theme.palette.text.disabled;
    if (percentage <= 60) return theme.palette.success.main;
    if (percentage <= 85) return theme.palette.warning.main;
    return theme.palette.error.main;
  }, [percentage, theme]);

  const data = [
    { name: 'Atual', value: available ? numericValue : 0 },
    { name: 'Restante', value: available ? Math.max(numericTotal - numericValue, 0) : 1 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>
      <Box sx={{ width: '100%', maxWidth: 400, aspectRatio: '2 / 1', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="95%"
              startAngle={180}
              endAngle={0}
              innerRadius="58%"
              outerRadius="92%"
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              <Cell fill={color} />
              <Cell fill={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, lineHeight: 1 }}>
          {available ? value : '—'}{' '}
          <Typography component="span" variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
            {unit}
          </Typography>
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
          {percentage === null ? 'Capacidade indisponível' : `${percentage}% da capacidade`}
        </Typography>
      </Box>
    </Box>
  );
};

export default GaugeChart;
