import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import DataCard from '../components/DataCard';

const QuadroPage = () => {
  const placeholderCards = [
    { title: 'Tensão', value: '---', unit: 'V' },
    { title: 'Corrente', value: '---', unit: 'A' },
    { title: 'Potência', value: '---', unit: 'kW' },
    { title: 'Fator de Potência (FP)', value: '---', unit: '' },
    { title: 'Temperatura', value: '---', unit: '°C' },
    { title: 'Status Disjuntor 1', value: '---', unit: '' },
    { title: 'Status Disjuntor 2', value: '---', unit: '' },
    { title: 'Consumo', value: '---', unit: 'kWh' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: { xs: 1, md: 1.5, lg: 2 },
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" color="text.primary" fontWeight="bold">
          Quadro Auxiliar
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visão geral dos parâmetros do quadro auxiliar.
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Os dados do quadro auxiliar estão sendo configurados e estarão disponíveis em breve.
      </Alert>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {placeholderCards.map((card, index) => (
          <DataCard
            key={index}
            title={card.title}
            value={card.value}
            unit={card.unit}
          />
        ))}
      </Box>
    </Box>
  );
};

export default QuadroPage;
