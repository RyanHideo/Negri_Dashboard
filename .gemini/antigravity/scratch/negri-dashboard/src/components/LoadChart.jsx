import React from 'react';
import { Alert, Box, Chip, CircularProgress, Typography, useTheme } from '@mui/material';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleTimeString('pt-BR');
};

export default function LoadChart({
  title,
  data = [],
  unit = 'kVA',
  maxValue,
  capacityKva,
  overloadThresholdKva,
  loading = false,
  error = null,
}) {
  const theme = useTheme();
  const chartData = data.map((point) => ({ ...point, time: formatTime(point.timestamp) }));
  const greatestValue = chartData.reduce((greatest, point) => Math.max(greatest, Number(point.value) || 0), 0);
  const dynamicMaximum = maxValue
    ? Math.max(maxValue, Math.ceil(greatestValue / 50) * 50)
    : 'auto';
  const isOverloaded = Boolean(overloadThresholdKva)
    && chartData.some((point) => Number(point.value) > overloadThresholdKva);
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: { xs: 220, md: 0 }, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {capacityKva && <Chip label={`ESCALA ${capacityKva} kVA`} size="small" color="info" variant="outlined" sx={{ height: 20, fontSize: '0.6rem' }} />}
          {overloadThresholdKva && <Chip label={`100% = ${overloadThresholdKva} kVA`} size="small" color="warning" variant="outlined" sx={{ height: 20, fontSize: '0.6rem' }} />}
          {isOverloaded && <Chip label="SOBRECARGA" size="small" color="error" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 700 }} />}
        </Box>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
      {loading ? <Box sx={{ flex: 1, display: 'grid', placeItems: 'center' }}><CircularProgress size={28} /></Box>
        : chartData.length === 0 ? <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', textAlign: 'center', px: 2 }}><Typography color="text.secondary" variant="body2">Sem leituras válidas disponíveis</Typography></Box>
          : <Box sx={{ flex: 1, minHeight: 0 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 16, right: 18, left: 0, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} /><XAxis dataKey="time" tick={{ fill: theme.palette.text.secondary, fontSize: 10 }} tickLine={false} /><YAxis domain={maxValue ? [0, dynamicMaximum] : ['auto', 'auto']} tick={{ fill: theme.palette.text.secondary, fontSize: 10 }} tickLine={false} unit={unit} width={58} />{overloadThresholdKva && <ReferenceLine y={overloadThresholdKva} stroke={theme.palette.error.main} strokeWidth={2} strokeDasharray="6 4" label={{ value: '100%', position: 'insideTopRight', fill: theme.palette.error.main, fontSize: 11 }} />}<Tooltip formatter={(value) => [`${Number(value).toLocaleString('pt-BR')} ${unit}${Number(value) > overloadThresholdKva ? ' — SOBRECARGA' : ''}`, title]} /><Line type="monotone" dataKey="value" stroke={isOverloaded ? theme.palette.error.main : theme.palette.primary.main} strokeWidth={2} dot={false} connectNulls={false} /></LineChart></ResponsiveContainer></Box>}
    </Box>
  );
}
