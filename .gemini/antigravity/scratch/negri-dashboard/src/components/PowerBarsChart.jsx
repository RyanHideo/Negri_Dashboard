import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const PowerBarsChart = ({ potenciaVSI = {} }) => {
  const theme = useTheme();

  const { potencia1 = {}, potencia2 = {} } = potenciaVSI;
  const data = [potencia1, potencia2]
    .filter((power) => (
      power.valor !== null
      && power.valor !== undefined
      && Number.isFinite(Number(power.valor))
      && Number.isFinite(Number(power.maximoKw))
      && Number(power.maximoKw) > 0
      && Number.isFinite(Number(power.comparativoKva))
      && Number.isFinite(Number(power.maximoComparativoKva))
      && Number(power.maximoComparativoKva) > 0
    ))
    .map((power, index) => {
      const valor = Number(power.valor);
      const limiteKw = Number(power.maximoKw);
      const comparativoKva = Number(power.comparativoKva);
      const maximoComparativoKva = Number(power.maximoComparativoKva);
      return {
        nome: power.nome || `Potência ${index + 1} VSI`,
        valor,
        unidade: power.unidade || 'kW',
        limiteKw,
        comparativoKva,
        maximoComparativoKva,
        percentual: Math.round((comparativoKva / maximoComparativoKva) * 100),
      };
    });
  const hasData = data.length > 0;
  const vsiLimitKw = data[0]?.limiteKw ?? 150;
  const greatestPower = data.reduce((greatest, power) => Math.max(greatest, power.valor), vsiLimitKw);
  const xDomainMaximum = Math.max(vsiLimitKw, Math.ceil(greatestPower / 25) * 25);

  const getColor = (percentual) => {
    if (percentual <= 60) return theme.palette.success.main;
    if (percentual <= 85) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const {
        nome,
        valor,
        unidade,
        limiteKw,
        comparativoKva,
        maximoComparativoKva,
        percentual,
      } = payload[0].payload;
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
            Potência: {valor.toFixed(1)} {unidade}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            Comparativo: {comparativoKva.toFixed(1)} / {maximoComparativoKva.toFixed(1)} kVA
          </Typography>
          <Typography variant="body2" sx={{ color: getColor(percentual), fontWeight: 'bold', mt: 0.5 }}>
            {percentual}%{valor > limiteKw ? ' — SOBRECARGA' : ''}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: '0.95rem' }}>
          Potências do VSI (kW)
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          100% = {vsiLimitKw.toLocaleString('pt-BR')} kW • comparativo em kVA
        </Typography>
      </Box>
      
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
              domain={[0, xDomainMaximum]}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={false}
              tickFormatter={(v) => `${v} kW`}
            />
            <YAxis
              dataKey="nome"
              type="category"
              tick={{ fill: theme.palette.text.secondary, fontSize: 13, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              minTickGap={0}
              width={105}
            />
            <ReferenceLine
              x={vsiLimitKw}
              stroke={theme.palette.error.main}
              strokeWidth={2}
              strokeDasharray="5 4"
              label={{ value: '100%', position: 'insideTopRight', fill: theme.palette.error.main, fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
            <Bar dataKey="valor" radius={[0, 6, 6, 0]} maxBarSize={45} isAnimationActive={true}>
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
