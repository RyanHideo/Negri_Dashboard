const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const CCM1_TAGS_PATH = import.meta.env.VITE_CCM1_TAGS_PATH || '/modbus/ccm1/tags';
const CCM2_TAGS_PATH = import.meta.env.VITE_CCM2_TAGS_PATH?.trim() || null;
const TRUCK_FLOW_PATH = import.meta.env.VITE_TRUCK_FLOW_PATH || '/truck-flow';

const MOTOR_NAMES = [
  '200 HP',
  'CT Túnel 0200-CT-01',
  'Peneira Vibratória Scalp',
  'Peneira Vibratória 02',
  'Peneira Vibratória 01',
  'CT Britador',
  'Britador HP300',
  'Retorno Cone 01',
  'Sem informação',
  'CT Nova CT4 - PL2',
  'Sem informação',
  'Sem informação',
  'Sirene',
  'CT2 Inf. Cones',
  'CT7 Pedra 1',
  'Sem informação',
  'CT6 Desc. VSI',
  'CT8 Pedra 0',
  'CT9 Pedrisco',
  'CT10 Bica Corrida',
  'CT16 Pedra 2',
  'CT11 Pó 1',
  'CT12 Pó 2',
  'CT13 Rejeito',
  'Sem informação',
  'Sem informação',
  "Bomba d'água",
  'CT15 Ret. Cone 2',
  'Sem informação',
  'Unidade Hidráulica VSI',
  'Sem informação',
  'Sem informação',
  'Sem informação',
  'Sem informação',
  'Bomba Pressão Água',
  'Mesa Vibratória Antigo',
  'Mesa Vibratória Túnel',
  'Sem informação',
  'VSI',
  'Sem informação',
];

const resolveUrl = (path) => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const requestJson = async (path, signal) => {
  const response = await fetch(resolveUrl(path), {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error(`API respondeu com HTTP ${response.status}`);
  return response.json();
};

const unwrapTags = (payload) => {
  const tags = payload?.tags || payload;
  if (!tags || typeof tags !== 'object' || Array.isArray(tags)) {
    throw new Error('Formato das tags diferente do esperado');
  }
  return tags;
};

const roundToTwo = (value) => {
  if (value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : null;
};

const readTag = (tags, names) => {
  const tagName = names.find((name) => Object.prototype.hasOwnProperty.call(tags, name));
  if (!tagName) return null;

  const reading = tags[tagName];
  if (reading && typeof reading === 'object' && !Array.isArray(reading)) {
    if (reading.quality && String(reading.quality).toUpperCase() !== 'GOOD') return null;
    return roundToTwo(reading.value);
  }

  return roundToTwo(reading);
};

const normalizeTimestamp = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(String(timestamp).replace(/(\.\d{3})\d+Z$/, '$1Z'));
  return Number.isNaN(date.getTime()) ? null : date;
};

const getLatestTimestamp = (tags) => Object.values(tags).reduce((latest, reading) => {
  const current = normalizeTimestamp(reading?.ts);
  return current && (!latest || current > latest) ? current : latest;
}, null);

const formatTime = (date) => date?.toLocaleTimeString('pt-BR') || '--:--:--';

const createEmptyCcm = (id) => ({
  id,
  nome: id.toUpperCase().replace('CCM', 'CCM '),
  status: 'offline',
  ultimaAtualizacao: '--:--:--',
  modoOperacao: 'Sem dados',
  tensaoLL: { l1l2: null, l2l3: null, l3l1: null, unidade: 'V' },
  tensaoLN: { l1n: null, l2n: null, l3n: null, unidade: 'V' },
  corrente: { i1: null, i2: null, i3: null, unidade: 'A' },
  potencia: { ativa: null, unidade: 'kW', status: 'unavailable' },
  potenciaAparente: { valor: null, unidade: 'kVA' },
  fatorPotencia: { valor: null, unidade: 'cos φ', status: 'unavailable' },
  frequencia: { valor: null, unidade: 'Hz', status: 'unavailable' },
  consumoTotal: { valor: null, unidade: 'kWh', status: 'unavailable' },
  temperatura: { valor: null, unidade: '°C', status: 'unavailable' },
  cargaPercentual: null,
  capacidade: { valor: null, total: null, unidade: 'kVA' },
  potenciaVSI: {
    potencia1: { nome: 'Potência 1', valor: null, maximo: null, unidade: 'kW' },
    potencia2: { nome: 'Potência 2', valor: null, maximo: null, unidade: 'kW' },
  },
});

const readingStatus = (value) => value === null ? 'unavailable' : 'good';

const mapCcm = (id, payload) => {
  if (!payload) return createEmptyCcm(id);

  const tags = unwrapTags(payload);
  const base = createEmptyCcm(id);
  const activePower = readTag(tags, ['KW']);
  const powerFactor = readTag(tags, ['FP']);
  const rawFrequency = readTag(tags, ['FREQUENCIA']);
  // O registrador do CLP informa décimos de hertz: 600 representa 60,0 Hz.
  const frequency = rawFrequency === null ? null : roundToTwo(rawFrequency * 0.1);
  const consumption = readTag(tags, ['CONSUMO']);

  return {
    ...base,
    status: 'online',
    ultimaAtualizacao: formatTime(getLatestTimestamp(tags)),
    modoOperacao: 'Dados do CLP',
    tensaoLL: {
      ...base.tensaoLL,
      l1l2: readTag(tags, ['V1-V2']),
      l2l3: readTag(tags, ['V2-V3']),
      l3l1: readTag(tags, ['V1-V3']),
    },
    tensaoLN: {
      ...base.tensaoLN,
      l1n: readTag(tags, ['V1-N']),
      l2n: readTag(tags, ['V2-N']),
      l3n: readTag(tags, ['V3-N']),
    },
    corrente: {
      ...base.corrente,
      i1: readTag(tags, ['A1']),
      i2: readTag(tags, ['A2']),
      i3: readTag(tags, ['A3']),
    },
    potencia: { ativa: activePower, unidade: 'kW', status: readingStatus(activePower) },
    fatorPotencia: { valor: powerFactor, unidade: 'cos φ', status: readingStatus(powerFactor) },
    frequencia: { valor: frequency, unidade: 'Hz', status: readingStatus(frequency) },
    consumoTotal: { valor: consumption, unidade: 'kWh', status: readingStatus(consumption) },
  };
};

const getMotorDefinition = (index) => {
  const number = index + 1;
  const id = `M${number}`;

  if (number <= 11) return { id, currentTag: `${id}_A`, faultTag: `${id}_F`, hoursTag: `${id}_H` };
  if (number <= 38) return { id, statusTag: `${id}_S`, faultTag: `${id}_F`, hoursTag: `${id}_H` };
  if (number === 39) {
    return {
      id,
      statusTag: `${id}_S`,
      currentTag: `${id}_A`,
      faultTag: `${id}_F`,
      hoursTag: `${id}_H`,
    };
  }
  return { id, currentTag: `${id}_A` };
};

const getMotorStatus = ({ status, current, fault, hasStatus, hasCurrent, hasFault }) => {
  if (hasFault && fault === null) return 'indisponivel';
  if (fault !== null && fault !== 0) return 'falha';
  if (hasStatus) return status === null ? 'indisponivel' : status !== 0 ? 'ligado' : 'desligado';
  if (hasCurrent) return current === null ? 'indisponivel' : current > 0 ? 'ligado' : 'desligado';
  return 'indisponivel';
};

const mapMotorsFromTags = (payload, ccmName) => {
  if (!payload) return [];
  const tags = unwrapTags(payload);

  return MOTOR_NAMES.map((name, index) => {
    const definition = getMotorDefinition(index);
    const current = definition.currentTag ? readTag(tags, [definition.currentTag]) : null;
    const hours = definition.hoursTag ? readTag(tags, [definition.hoursTag]) : null;
    const fault = definition.faultTag ? readTag(tags, [definition.faultTag]) : 0;
    const status = definition.statusTag ? readTag(tags, [definition.statusTag]) : null;
    const motorStatus = getMotorStatus({
      status,
      current,
      fault,
      hasStatus: Boolean(definition.statusTag),
      hasCurrent: Boolean(definition.currentTag),
      hasFault: Boolean(definition.faultTag),
    });

    return {
      id: definition.id,
      nome: name,
      ccm: ccmName,
      status: motorStatus,
      horimetro: hours,
      corrente: current,
      cargaEstimada: null,
      alarme: motorStatus === 'falha'
        ? 'Falha sinalizada pelo CLP'
        : motorStatus === 'indisponivel' ? 'Leitura indisponível' : 'OK',
      potenciaNominal: null,
    };
  });
};

const buildDashboard = (ccm1, ccm2, motors) => ({
  eficienciaProdutiva: null,
  economiasEnergeticas: null,
  motoresTotal: motors.length,
  motoresLigados: motors.filter((motor) => motor.status === 'ligado').length,
  motoresDesligados: motors.filter((motor) => motor.status === 'desligado').length,
  motoresFalha: motors.filter((motor) => motor.status === 'falha').length,
  motoresIndisponiveis: motors.filter((motor) => motor.status === 'indisponivel').length,
  consumoTotalCCM1: ccm1.consumoTotal.valor,
  consumoTotalCCM2: ccm2.consumoTotal.valor,
  potenciaAparenteCCM1: ccm1.capacidade,
  potenciaAparenteCCM2: ccm2.capacidade,
});

const mapTruckFlow = (payload) => {
  if (!payload) {
    return {
      semaforo: { estado: 'desligado' },
      truckCounter: { contagem: null, meta: null, ultimoPulso: '--:--:--' },
    };
  }

  const statusMap = { GREEN: 'verde', RED: 'vermelho', OFF: 'desligado', UNKNOWN: 'desligado' };
  const rawStatus = String(payload.status || 'UNKNOWN').toUpperCase();

  return {
    semaforo: { estado: statusMap[rawStatus] || 'desligado' },
    truckCounter: {
      contagem: roundToTwo(payload.truckCount),
      meta: null,
      ultimoPulso: formatTime(normalizeTimestamp(payload.updatedAt)),
    },
  };
};

export const createEmptyDashboardData = () => {
  const ccm1 = createEmptyCcm('ccm1');
  const ccm2 = createEmptyCcm('ccm2');
  const motors = [];

  return {
    ccm1,
    ccm2,
    motores: motors,
    dashboard: buildDashboard(ccm1, ccm2, motors),
    semaforo: { estado: 'desligado' },
    truckCounter: { contagem: null, meta: null, ultimoPulso: '--:--:--' },
    alarmes: [],
  };
};

const optionalRequest = async (path, signal) => {
  if (!path) return null;
  try {
    return await requestJson(path, signal);
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    return null;
  }
};

export const loadDashboardData = async (signal) => {
  // CCM1 é a única fonte obrigatória. As demais nunca impedem o painel de abrir.
  const ccm1Payload = await requestJson(CCM1_TAGS_PATH, signal);
  const [ccm2Payload, truckFlowPayload] = await Promise.all([
    optionalRequest(CCM2_TAGS_PATH, signal),
    optionalRequest(TRUCK_FLOW_PATH, signal),
  ]);

  const ccm1 = mapCcm('ccm1', ccm1Payload);
  const ccm2 = mapCcm('ccm2', ccm2Payload);
  const motors = [
    ...mapMotorsFromTags(ccm1Payload, 'CCM 1'),
    ...mapMotorsFromTags(ccm2Payload, 'CCM 2'),
  ];
  const truckFlow = mapTruckFlow(truckFlowPayload);

  return {
    ccm1,
    ccm2,
    motores: motors,
    dashboard: buildDashboard(ccm1, ccm2, motors),
    ...truckFlow,
    alarmes: motors
      .filter((motor) => motor.status === 'falha')
      .map((motor, index) => ({
        id: index + 1,
        tipo: 'falha',
        mensagem: `${motor.alarme}: ${motor.nome}`,
        timestamp: ccm1.ultimaAtualizacao,
        ccm: motor.ccm,
      })),
  };
};

export const apiConfig = {
  ccm1TagsUrl: resolveUrl(CCM1_TAGS_PATH),
  ccm2TagsUrl: CCM2_TAGS_PATH ? resolveUrl(CCM2_TAGS_PATH) : null,
};
