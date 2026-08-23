import React, { useRef } from 'react';
import { Box, Typography, Chip, useTheme, IconButton, alpha } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { glassCardSx } from '../theme';
import Semaphore from '../components/Semaphore';
import TruckCounter from '../components/TruckCounter';
import DataCard from '../components/DataCard';
import GaugeChart from '../components/GaugeChart';
import LoadBarChart from '../components/LoadBarChart';

const displayValue = (value) => value ?? '—';
const displayMeasurement = (value, unit) => value === null || value === undefined ? '—' : `${value} ${unit}`;

export default function CCM2Page({ data }) {
  const theme = useTheme();
  const { ccm2: ccm2Data, semaforo: semaforoData, truckCounter: truckCounterData, motores } = data;
  const cargas = motores
    .filter((motor) => motor.ccm === 'CCM 2' && motor.status === 'ligado')
    .map((motor) => ({ nome: motor.id, nomeCompleto: motor.nome, carga: motor.cargaEstimada }));
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
            {ccm2Data.nome}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={`Status: ${ccm2Data.status === 'online' ? 'online' : 'sem conexão'}`}
              color={ccm2Data.status === 'online' ? 'success' : 'warning'}
              size="small"
              variant="outlined"
            />
            <Chip label={ccm2Data.modoOperacao} color="info" size="small" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              Atualizado: {ccm2Data.ultimaAtualizacao}
            </Typography>
          </Box>
        </Box>

        {/* Conteúdo principal */}
        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '200px 1fr 1fr 1fr' },
            gridTemplateRows: { xs: 'auto', md: '1fr 1fr' },
            gap: 2,
            minHeight: 0,
          }}
        >
          {/* Semáforo */}
          <Box
            sx={{
              ...glassCardSx(theme),
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gridRow: { md: '1' },
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, fontWeight: 600, textTransform: 'uppercase' }}>
              Semáforo
            </Typography>
            <Semaphore estado={semaforoData.estado} />
          </Box>

          {/* TruckCounter */}
          <Box
            sx={{
              ...glassCardSx(theme),
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gridRow: { md: '2' },
            }}
          >
            <TruckCounter contagem={truckCounterData.contagem} meta={truckCounterData.meta} ultimoPulso={truckCounterData.ultimoPulso} />
          </Box>

          {/* Resumo operacional */}
          <Box
            sx={{
              ...glassCardSx(theme),
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1.5,
              gridColumn: { md: 'span 2' },
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
              Resumo
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">Potência</Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                {ccm2Data.potencia.ativa} {ccm2Data.potencia.unidade}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">Fator de Potência</Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                {ccm2Data.fatorPotencia.valor}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">Temperatura</Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                {ccm2Data.temperatura.valor} {ccm2Data.temperatura.unidade}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">Consumo</Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                {ccm2Data.consumoTotal.valor} {ccm2Data.consumoTotal.unidade}
              </Typography>
            </Box>
          </Box>

          {/* Gauge - Capacidade */}
          <Box
            sx={{
              ...glassCardSx(theme),
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GaugeChart
              value={ccm2Data.capacidade.valor}
              total={ccm2Data.capacidade.total}
              label="Capacidade"
              unit={ccm2Data.capacidade.unidade}
            />
          </Box>

          {/* Gráfico de barras - Carga dos Motores */}
          <Box
            sx={{
              ...glassCardSx(theme),
              p: 2,
              gridColumn: { sm: '1 / -1', md: '2 / -1' },
              minHeight: { xs: 250, md: 0 },
            }}
          >
            <LoadBarChart data={cargas} />
          </Box>
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
        {/* Header da seção */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
              Multimedidor — {ccm2Data.nome}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Medições elétricas em tempo real
            </Typography>
          </Box>
          <IconButton onClick={scrollToTopo} sx={{ color: 'text.secondary' }}>
            <KeyboardArrowUp />
          </IconButton>
        </Box>

        {/* Grid de dados */}
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
            value={displayMeasurement(ccm2Data.tensaoLL.l1l2, ccm2Data.tensaoLL.unidade)}
            subValues={[
              { label: 'L1-L2', value: displayValue(ccm2Data.tensaoLL.l1l2) },
              { label: 'L2-L3', value: displayValue(ccm2Data.tensaoLL.l2l3) },
              { label: 'L3-L1', value: displayValue(ccm2Data.tensaoLL.l3l1) },
            ]}
          />
          <DataCard
            title="Tensão L-N"
            value={displayMeasurement(ccm2Data.tensaoLN.l1n, ccm2Data.tensaoLN.unidade)}
            subValues={[
              { label: 'L1-N', value: displayValue(ccm2Data.tensaoLN.l1n) },
              { label: 'L2-N', value: displayValue(ccm2Data.tensaoLN.l2n) },
              { label: 'L3-N', value: displayValue(ccm2Data.tensaoLN.l3n) },
            ]}
          />
          <DataCard
            title="Corrente"
            value={displayMeasurement(ccm2Data.corrente.i1, ccm2Data.corrente.unidade)}
            subValues={[
              { label: 'I1', value: displayValue(ccm2Data.corrente.i1) },
              { label: 'I2', value: displayValue(ccm2Data.corrente.i2) },
              { label: 'I3', value: displayValue(ccm2Data.corrente.i3) },
            ]}
          />
          <DataCard
            title="Potência Ativa"
            value={displayMeasurement(ccm2Data.potencia.ativa, ccm2Data.potencia.unidade)}
            status={ccm2Data.potencia.status}
          />
          <DataCard
            title="Fator de Potência"
            value={displayMeasurement(ccm2Data.fatorPotencia.valor, ccm2Data.fatorPotencia.unidade)}
            status={ccm2Data.fatorPotencia.status}
          />
          <DataCard
            title="Frequência"
            value={displayMeasurement(ccm2Data.frequencia.valor, ccm2Data.frequencia.unidade)}
            status={ccm2Data.frequencia.status}
          />
          <DataCard
            title="Consumo Total"
            value={displayMeasurement(ccm2Data.consumoTotal.valor, ccm2Data.consumoTotal.unidade)}
            status={ccm2Data.consumoTotal.status}
          />
          <DataCard
            title="Temperatura"
            value={displayMeasurement(ccm2Data.temperatura.valor, ccm2Data.temperatura.unidade)}
            status={ccm2Data.temperatura.status}
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
