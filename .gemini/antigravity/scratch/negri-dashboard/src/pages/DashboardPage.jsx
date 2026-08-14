import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { dashboardData, ccm1Data, ccm2Data, alarmesData } from '../data/mockData';
import DonutChart from '../components/DonutChart';
import GaugeChart from '../components/GaugeChart';
import AlarmList from '../components/AlarmList';
import DataCard from '../components/DataCard';
import { glassCardSx } from '../theme';

const DashboardPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: { xs: 'auto', md: 'auto 1fr auto' },
        gap: 2,
        height: { xs: 'auto', md: '100%' },
        p: { xs: 1, md: 1.5, lg: 2 },
        overflowY: { xs: 'auto', md: 'hidden' },
      }}
    >
      {/* Row 1: 3 cards side by side */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <Box sx={{ ...glassCardSx(theme), p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <DonutChart value={dashboardData.eficienciaProdutiva} label="Eficiência Produtiva" />
        </Box>
        <Box sx={{ ...glassCardSx(theme), p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>Status dos Motores</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main">{dashboardData.motoresLigados}</Typography>
              <Typography variant="body2" color="text.secondary">Ligados</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" color="text.disabled">{dashboardData.motoresDesligados}</Typography>
              <Typography variant="body2" color="text.secondary">Desligados</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" color="error.main">{dashboardData.motoresFalha}</Typography>
              <Typography variant="body2" color="text.secondary">Falha</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ height: '100%' }}>
          <AlarmList alarms={alarmesData} />
        </Box>
      </Box>

      {/* Row 2: 2 GaugeCharts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          alignItems: 'center',
          minHeight: { md: 250 },
        }}
      >
        <Box sx={{ ...glassCardSx(theme), p: 2, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <GaugeChart
            value={ccm1Data.potenciaAparente.valor}
            total={ccm1Data.capacidade.total}
            label="CCM 1 - Potência Aparente"
            unit={ccm1Data.potenciaAparente.unidade}
          />
        </Box>
        <Box sx={{ ...glassCardSx(theme), p: 2, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <GaugeChart
            value={ccm2Data.potenciaAparente.valor}
            total={ccm2Data.capacidade.total}
            label="CCM 2 - Potência Aparente"
            unit={ccm2Data.potenciaAparente.unidade}
          />
        </Box>
      </Box>

      {/* Row 3: 2 cards (Consumo Total, Temperatura) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <DataCard
          title="Consumo Total"
          value={dashboardData.consumoTotalCCM1 + dashboardData.consumoTotalCCM2}
          unit="kWh"
          subValues={[
            { label: 'CCM 1', value: `${dashboardData.consumoTotalCCM1} kWh` },
            { label: 'CCM 2', value: `${dashboardData.consumoTotalCCM2} kWh` }
          ]}
        />
        <DataCard
          title="Temperatura Média"
          value={((ccm1Data.temperatura.valor + ccm2Data.temperatura.valor) / 2).toFixed(1)}
          unit="°C"
          subValues={[
            { label: 'CCM 1', value: `${ccm1Data.temperatura.valor} °C` },
            { label: 'CCM 2', value: `${ccm2Data.temperatura.valor} °C` }
          ]}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;
