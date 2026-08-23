// ============================================
// Mock Data – Painel de Gestão Negri
// ============================================

// ---------- CCM 1 ----------
export const ccm1Data = {
  id: 'ccm1',
  nome: 'CCM 1',
  status: 'online',
  ultimaAtualizacao: '08:00:00',
  modoOperacao: 'Automático',
  tensaoLL: {
    l1l2: 380.5,
    l2l3: 381.2,
    l3l1: 379.8,
    unidade: 'V',
  },
  tensaoLN: {
    l1n: 220.1,
    l2n: 219.8,
    l3n: 220.4,
    unidade: 'V',
  },
  corrente: {
    i1: 125.3,
    i2: 128.7,
    i3: 126.1,
    unidade: 'A',
  },
  potencia: {
    ativa: 85.2,
    unidade: 'kW',
    status: 'good',
  },
  potenciaAparente: {
    valor: 95.0,
    unidade: 'kVA',
  },
  fatorPotencia: {
    valor: 0.89,
    unidade: 'cos φ',
    status: 'warning',
  },
  frequencia: {
    valor: 60.01,
    unidade: 'Hz',
    status: 'good',
  },
  consumoTotal: {
    valor: 15420,
    unidade: 'kWh',
    status: 'good',
  },
  temperatura: {
    valor: 32.5,
    unidade: '°C',
    status: 'good',
  },
  cargaPercentual: 68,
  capacidade: {
    valor: 95.0,
    total: 200,
    unidade: 'kVA',
  },
  potenciaVSI: {
    potencia1: {
      nome: 'Potência 1',
      valor: 45.8,
      maximo: 100,
      unidade: 'kW',
    },
    potencia2: {
      nome: 'Potência 2',
      valor: 67.3,
      maximo: 100,
      unidade: 'kW',
    },
  },
};

// ---------- CCM 2 ----------
export const ccm2Data = {
  id: 'ccm2',
  nome: 'CCM 2',
  status: 'online',
  ultimaAtualizacao: '08:00:00',
  modoOperacao: 'Automático',
  tensaoLL: {
    l1l2: 381.0,
    l2l3: 380.4,
    l3l1: 381.5,
    unidade: 'V',
  },
  tensaoLN: {
    l1n: 219.9,
    l2n: 220.3,
    l3n: 220.0,
    unidade: 'V',
  },
  corrente: {
    i1: 98.4,
    i2: 101.2,
    i3: 99.7,
    unidade: 'A',
  },
  potencia: {
    ativa: 62.8,
    unidade: 'kW',
    status: 'good',
  },
  potenciaAparente: {
    valor: 70.5,
    unidade: 'kVA',
  },
  fatorPotencia: {
    valor: 0.92,
    unidade: 'cos φ',
    status: 'good',
  },
  frequencia: {
    valor: 60.00,
    unidade: 'Hz',
    status: 'good',
  },
  consumoTotal: {
    valor: 12380,
    unidade: 'kWh',
    status: 'good',
  },
  temperatura: {
    valor: 29.8,
    unidade: '°C',
    status: 'good',
  },
  cargaPercentual: 45,
  capacidade: {
    valor: 70.5,
    total: 200,
    unidade: 'kVA',
  },
  potenciaVSI: {
    potencia1: {
      nome: 'Potência 1',
      valor: 32.5,
      maximo: 100,
      unidade: 'kW',
    },
    potencia2: {
      nome: 'Potência 2',
      valor: 48.2,
      maximo: 100,
      unidade: 'kW',
    },
  },
};

// ---------- Semáforo (CCM 1) ----------
export const semaforoData = {
  estado: 'verde', // 'verde' | 'amarelo' | 'vermelho'
};

// ---------- Contador de Caminhões (CCM 1) ----------
export const truckCounterData = {
  contagem: 12,
  meta: 50,
  ultimoPulso: '07:45:22',
};

// ---------- Motores ----------
const nomes = [
  'Elevador 01 - Moega',
  'Elevador 02 - Silo',
  'Transportador 01',
  'Transportador 02',
  'Rosca Extratora 01',
  'Rosca Extratora 02',
  'Ventilador 01',
  'Ventilador 02',
  'Redler Silo 1',
  'Redler Silo 2',
  'Redler Silo 3',
  'Peneira Rotativa',
  'Secador Principal',
  'Bomba Hidráulica 01',
  'Compressor 01',
  'Exaustor 01',
  'Rosca Varredora 01',
  'Elevador 03 - Armazém',
  'Transportador 03',
  'Bomba Hidráulica 02',
];

const cargasMotores = [68, 54, 72, 46, 63, 81, 59, 74, 0, 0, 61, 48, 76, 57, 69, 83, 0, 0, 0, 0];
const correntesMotores = [18.4, 12.7, 21.2, 9.8, 15.6, 24.1, 13.9, 19.7, 0, 0, 16.8, 11.5, 22.6, 14.3, 17.9, 25.4, 0, 0, 0, 0];

export const motoresData = nomes.map((nome, i) => {
  const status = i < 8 || (i >= 10 && i < 16) ? 'ligado' : i >= 18 ? 'falha' : 'desligado';
  const carga = cargasMotores[i];
  const corrente = correntesMotores[i];
  return {
    id: `M${i + 1}`,
    nome,
    ccm: i < 10 ? 'CCM 1' : 'CCM 2',
    status,
    horimetro: Number((120 + i * 37.5).toFixed(1)),
    corrente,
    cargaEstimada: carga,
    alarme: status === 'falha' ? 'Sobrecarga' : 'OK',
    potenciaNominal: Number((3.5 + (i % 6) * 2.2).toFixed(1)),
  };
});

// ---------- Alarmes ----------
export const alarmesData = [
  { id: 1, tipo: 'falha', mensagem: 'Sobrecarga no Motor M19', timestamp: '07:32:15', ccm: 'CCM 2' },
  { id: 2, tipo: 'falha', mensagem: 'Sobrecarga no Motor M20', timestamp: '07:35:42', ccm: 'CCM 2' },
  { id: 3, tipo: 'warning', mensagem: 'Fator de potência baixo - CCM 1', timestamp: '06:58:10', ccm: 'CCM 1' },
];

// ---------- Dashboard (Resumo geral) ----------
export const dashboardData = {
  eficienciaProdutiva: 72,
  economiasEnergeticas: 88,
  motoresTotal: motoresData.length,
  motoresLigados: motoresData.filter((m) => m.status === 'ligado').length,
  motoresDesligados: motoresData.filter((m) => m.status === 'desligado').length,
  motoresFalha: motoresData.filter((m) => m.status === 'falha').length,
  consumoTotalCCM1: ccm1Data.consumoTotal.valor,
  consumoTotalCCM2: ccm2Data.consumoTotal.valor,
  potenciaAparenteCCM1: ccm1Data.capacidade,
  potenciaAparenteCCM2: ccm2Data.capacidade,
};

// ---------- Carga por Motor (para gráficos de barras) ----------
export const getCargaMotoresByCCM = (ccmName) =>
  motoresData
    .filter((m) => m.ccm === ccmName && m.status === 'ligado')
    .map((m) => ({
      reactKey: `${m.ccm}:${m.nome}`,
      nome: m.nome.length > 18 ? `${m.nome.slice(0, 17)}…` : m.nome,
      nomeCompleto: m.nome,
      carga: m.cargaEstimada,
    }));
