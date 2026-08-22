import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PowerBarsChart = ({ potenciaVSI = {} }) => {
  const theme = useTheme();

  const { potencia1 = {}, potencia2 = {} } = potenciaVSI;
  const hasData = [potencia1.valor, potencia2.valor].some(
    (value) => value !== null && value !== undefined && Number.isFinite(Number(value)),
  );

  // Preparar dados para o gráfico (formato horizontal)
  const data = [
    {
      nome: potencia1.nome || 'Potência 1',
      valor: Number(potencia1.valor) || 0,
      maximo: Number(potencia1.maximo) || 100,
      percentual: Math.round((Number(potencia1.valor) || 0) / (Number(potencia1.maximo) || 100) * 100),
    },
    {
      nome: potencia2.nome || 'Potência 2',
      valor: Number(potencia2.valor) || 0,
      maximo: Number(potencia2.maximo) || 100,
      percentual: Math.round((Number(potencia2.valor) || 0) / (Number(potencia2.maximo) || 100) * 100),
    },
  ];

  const getColor = (percentual) => {
    if (percentual <= 60) return theme.palette.success.main;
    if (percentual <= 85) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { nome, valor, maximo, percentual } = payload[0].payload;
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
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
            {nome}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {valor.toFixed(1)} / {maximo} {potencia1.unidade || 'kW'}
          </Typography>
          <Typography variant="body2" sx={{ color: getColor(percentual), fontWeight: 'bold', mt: 0.5 }}>
            {percentual}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-between' }}>
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: '0.95rem' }}>
        Potências do VSI
      </Typography>
      
      <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
        {!hasData ? (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">Potências do VSI indisponíveis</Typography>
          </Box>
        ) : <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 5, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.divider} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              dataKey="nome"
              type="category"
              tick={{ fill: theme.palette.text.secondary, fontSize: 13, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={105}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
            <Bar dataKey="percentual" radius={[0, 6, 6, 0]} maxBarSize={45} isAnimationActive={true}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.percentual)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>}
      </Box>
    </Box>
  );
};

export default PowerBarsChart;
