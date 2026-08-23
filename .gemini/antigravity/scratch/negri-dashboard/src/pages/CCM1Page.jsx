import React, { useRef } from 'react';
import { Box, Typography, Chip, useTheme, IconButton, alpha } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { ccm1Data } from '../data/mockData';
import { glassCardSx } from '../theme';
import DataCard from '../components/DataCard';
import LoadBarChart from '../components/LoadBarChart';
import LoadChart from '../components/LoadChart';
import PowerBarsChart from '../components/PowerBarsChart';
import useCcm1Data from '../hooks/useCcm1Data';

export default function CCM1Page() {
  const theme = useTheme();
  const { power, motorLoads, loading, powerError } = useCcm1Data();
  const multimedidorRef = useRef(null);
  const topoRef = useRef(null);

  const scrollToMultimedidor = () => {
    multimedidorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTopo = () => {
    topoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.text.primary, 0.15), borderRadius: 3 },
      }}
    >
      {/* ═══════════════ TELA 1: VISÃO OPERACIONAL ═══════════════ */}
      <Box
        ref={topoRef}
        sx={{
          minHeight: { xs: 'auto', md: 'calc(100vh - 56px)' },
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 1.5, md: 2 },
          gap: 2,
        }}
      >
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
            {ccm1Data.nome}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip label="Status: online" color="success" size="small" variant="outlined" />
            <Chip label={ccm1Data.modoOperacao} color="info" size="small" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              Atualizado: {ccm1Data.ultimaAtualizacao}
            </Typography>
          </Box>
        </Box>

        {/* Conteúdo principal - sem semáforo/contador, gráficos maiores */}
        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(6, minmax(0, 1fr))' },
            gridTemplateRows: { xs: 'auto', md: 'minmax(0, 0.9fr) minmax(0, 1.1fr)' },
            gap: 2,
            minHeight: 0,
          }}
        >
          {/* Power Bars - Potências do VSI */}
          <Box
            sx={{
              ...glassCardSx(theme),
              p: 3,
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'flex-start',
              gridColumn: { xs: 'auto', md: 'span 2' },
              minHeight: { xs: 250, md: 0 },
            }}
          >
            <PowerBarsChart potenciaVSI={ccm1Data.potenciaVSI} />
          </Box>

          <Box
            sx={{
              ...glassCardSx(theme),
              p: 2,
              gridColumn: { xs: 'auto', md: 'span 4' },
              minHeight: { xs: 280, md: 0 },
            }}
          >
            <LoadBarChart data={motorLoads} />
          </Box>

          {[
            { title: 'Carga do Trafo Principal', data: power.mainTransformer, capacityKva: 500 },
            { title: 'Carga do Trafo VSI', data: power.vsiTransformer, capacityKva: 300 },
            { title: 'Carga Geral', data: power.general, capacityKva: 800 },
          ].map(({ title, data, capacityKva }) => (
            <Box key={title} sx={{ ...glassCardSx(theme), p: 2, gridColumn: { xs: 'auto', md: 'span 2' }, minHeight: { xs: 260, md: 0 } }}>
              <LoadChart title={title} data={data} maxValue={capacityKva} capacityKva={capacityKva} loading={loading} error={powerError} />
            </Box>
          ))}
        </Box>

        {/* Botão para ir ao multimedidor */}
        <Box
          onClick={scrollToMultimedidor}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            py: 1,
            opacity: 0.6,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 1 },
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Dados do Multimedidor
          </Typography>
          <KeyboardArrowDown sx={{ color: 'text.secondary', fontSize: 28, animation: 'bounce 2s infinite' }} />
          <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }`}</style>
        </Box>
      </Box>

      {/* ═══════════════ TELA 2: DADOS DO MULTIMEDIDOR ═══════════════ */}
      <Box
        ref={multimedidorRef}
        sx={{
          minHeight: { xs: 'auto', md: 'calc(100vh - 56px)' },
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 1.5, md: 2 },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
              Multimedidor — {ccm1Data.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Medições elétricas em tempo real
            </Typography>
          </Box>
          <IconButton onClick={scrollToTopo} sx={{ color: 'text.secondary' }}>
            <KeyboardArrowUp />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2,
            alignContent: 'start',
          }}
        >
          <DataCard
            title="Tensão L-L"
            value={`${ccm1Data.tensaoLL.l1l2} ${ccm1Data.tensaoLL.unidade}`}
            subValues={[
              { label: 'L1-L2', value: ccm1Data.tensaoLL.l1l2 },
              { label: 'L2-L3', value: ccm1Data.tensaoLL.l2l3 },
              { label: 'L3-L1', value: ccm1Data.tensaoLL.l3l1 },
            ]}
          />
          <DataCard
            title="Tensão L-N"
            value={`${ccm1Data.tensaoLN.l1n} ${ccm1Data.tensaoLN.unidade}`}
            subValues={[
              { label: 'L1-N', value: ccm1Data.tensaoLN.l1n },
              { label: 'L2-N', value: ccm1Data.tensaoLN.l2n },
              { label: 'L3-N', value: ccm1Data.tensaoLN.l3n },
            ]}
          />
          <DataCard
            title="Corrente"
            value={`${ccm1Data.corrente.i1} ${ccm1Data.corrente.unidade}`}
            subValues={[
              { label: 'I1', value: ccm1Data.corrente.i1 },
              { label: 'I2', value: ccm1Data.corrente.i2 },
              { label: 'I3', value: ccm1Data.corrente.i3 },
            ]}
          />
          <DataCard
            title="Potência Ativa"
            value={`${ccm1Data.potencia.ativa} ${ccm1Data.potencia.unidade}`}
            status={ccm1Data.potencia.status}
          />
          <DataCard
            title="Fator de Potência"
            value={`${ccm1Data.fatorPotencia.valor} ${ccm1Data.fatorPotencia.unidade}`}
            status={ccm1Data.fatorPotencia.status}
          />
          <DataCard
            title="Frequência"
            value={`${ccm1Data.frequencia.valor} ${ccm1Data.frequencia.unidade}`}
            status={ccm1Data.frequencia.status}
          />
          <DataCard
            title="Consumo Total"
            value={`${ccm1Data.consumoTotal.valor} ${ccm1Data.consumoTotal.unidade}`}
            status={ccm1Data.consumoTotal.status}
          />
          <DataCard
            title="Temperatura"
            value={`${ccm1Data.temperatura.valor} ${ccm1Data.temperatura.unidade}`}
            status={ccm1Data.temperatura.status}
          />
        </Box>

        {/* Footer Sinapse */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            py: 1.5,
            opacity: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Desenvolvido por
          </Typography>
          <Box
            component="img"
            src="/sinapse-logo.png"
            alt="Sinapse Soluções"
            sx={{
              height: 32,
              objectFit: 'contain',
              filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
