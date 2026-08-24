import React from 'react';
import { Box, Typography, useTheme, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const LoadBarChart = ({ data = [] }) => {
  const theme = useTheme();
  const validLoads = data.filter((motor) => motor.carga !== null && Number.isFinite(Number(motor.carga)));
  const maximumLoad = validLoads.reduce((maximum, motor) => Math.max(maximum, Number(motor.carga)), 100);
  const yDomainMaximum = Math.max(110, Math.ceil(maximumLoad / 10) * 10);
  const hasOverload = validLoads.some((motor) => Number(motor.carga) > 100);

  const getColor = (percent) => {
    if (percent === null || !Number.isFinite(Number(percent))) return theme.palette.text.disabled;
    if (percent <= 60) return theme.palette.success.main;
    if (percent <= 100) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { nomeCompleto, carga } = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>
            {nomeCompleto}
          </Typography>
          <Typography variant="body2" sx={{ color: getColor(carga), fontWeight: 'bold' }}>
            {carga === null ? 'Leitura indisponível' : `Carga: ${carga}%${carga > 100 ? ' — SOBRECARGA' : ''}`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
          Percentual de Carga dos Motores
        </Typography>
        <Chip
          label={hasOverload ? 'SOBRECARGA' : data.length > 0 ? `${validLoads.length}/${data.length} LEITURAS` : 'SEM DADOS'}
          size="small"
          sx={{
            bgcolor: (hasOverload ? theme.palette.error.main : theme.palette.success.main) + '20',
            color: hasOverload ? theme.palette.error.main : theme.palette.success.main,
            fontWeight: 'bold',
            fontSize: '0.65rem',
            height: 22,
          }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        {data.length === 0 ? (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">Carga dos motores indisponível</Typography>
          </Box>
        ) : <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
            <XAxis
              dataKey="nome"
              tick={{ fill: theme.palette.text.secondary, fontSize: 9 }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={false}
              angle={-18}
              textAnchor="end"
              height={48}
            />
            <YAxis
              domain={[0, yDomainMaximum]}
              tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <ReferenceLine
              y={100}
              stroke={theme.palette.error.main}
              strokeWidth={2}
              strokeDasharray="6 4"
              label={{ value: '100%', position: 'insideTopRight', fill: theme.palette.error.main, fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
            <Bar dataKey="carga" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={true}>
              {data.map((entry, index) => (
                <Cell key={entry.reactKey ?? `cell-${index}`} fill={getColor(entry.carga)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>}
      </Box>
    </Box>
  );
};

export default LoadBarChart;
