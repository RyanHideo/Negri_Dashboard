const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const CCM1_TAGS_PATH = import.meta.env.VITE_CCM1_TAGS_PATH || '/modbus/ccm1/tags';
const CCM2_TAGS_PATH = import.meta.env.VITE_CCM2_TAGS_PATH?.trim() || null;
const MOTORS_PATH = import.meta.env.VITE_MOTORS_PATH || '/motors/overview';
const TRUCK_FLOW_PATH = import.meta.env.VITE_TRUCK_FLOW_PATH || '/truck-flow';

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
    potencia1: {
      nome: 'Potência 1 VSI',
      valor: null,
      unidade: 'kW',
      maximoKw: null,
      comparativoKva: null,
      maximoComparativoKva: null,
    },
    potencia2: {
      nome: 'Potência 2 VSI',
      valor: null,
      unidade: 'kW',
      maximoKw: null,
      comparativoKva: null,
      maximoComparativoKva: null,
    },
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
  const vsiPower1 = readTag(tags, ['Potencia1Vsi']);
  const vsiPower2 = readTag(tags, ['Potencia2Vsi']);
  const vsiPower1ComparisonKva = readTag(tags, ['Potencia1VsiComparativoKva']);
  const vsiPower2ComparisonKva = readTag(tags, ['Potencia2VsiComparativoKva']);
  const vsiMaximumPowerKw = readTag(tags, ['PotenciaMaximaVsiKw']);
  const vsiMaximumComparisonKva = readTag(tags, ['PotenciaMaximaVsiComparativoKva']);

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
    potenciaVSI: {
      potencia1: {
        nome: 'Potência 1 VSI',
        valor: vsiPower1,
        unidade: 'kW',
        maximoKw: vsiMaximumPowerKw,
        comparativoKva: vsiPower1ComparisonKva,
        maximoComparativoKva: vsiMaximumComparisonKva,
      },
      potencia2: {
        nome: 'Potência 2 VSI',
        valor: vsiPower2,
        unidade: 'kW',
        maximoKw: vsiMaximumPowerKw,
        comparativoKva: vsiPower2ComparisonKva,
        maximoComparativoKva: vsiMaximumComparisonKva,
      },
    },
  };
};

const getMotorStatus = ({ status, current, fault, hasStatus, hasCurrent, hasFault }) => {
  if (hasFault && fault === null) return 'indisponivel';
  if (fault !== null && fault !== 0) return 'falha';
  if (hasStatus) return status === null ? 'indisponivel' : status !== 0 ? 'ligado' : 'desligado';
  if (hasCurrent) return current === null ? 'indisponivel' : current > 0 ? 'ligado' : 'desligado';
  return 'indisponivel';
};

const formatCcmName = (ccm) => {
  const match = String(ccm || '').match(/^ccm\s*(\d+)$/i);
  return match ? `CCM ${match[1]}` : String(ccm || 'CCM').toUpperCase();
};

const inferMotorId = (motor, index) => {
  if (motor?.id) return String(motor.id);

  const tagName = [motor?.statusTagName, motor?.currentTagName, motor?.faultTagName, motor?.hoursTagName]
    .find((candidate) => /^M\d+_/i.test(candidate || ''));
  return tagName?.match(/^(M\d+)_/i)?.[1]?.toUpperCase() || `M${index + 1}`;
};

const mapMotors = (payload) => {
  if (!Array.isArray(payload)) return [];

  return payload.map((motor, index) => {
    const id = inferMotorId(motor, index);
    const current = roundToTwo(motor?.current);
    const hours = roundToTwo(motor?.hours);
    const fault = roundToTwo(motor?.fault);
    const status = roundToTwo(motor?.status);
    const motorStatus = getMotorStatus({
      status,
      current,
      fault,
      hasStatus: Boolean(motor?.statusTagName),
      hasCurrent: Boolean(motor?.currentTagName),
      hasFault: Boolean(motor?.faultTagName),
    });

    return {
      id,
      nome: motor?.name || id,
      ccm: formatCcmName(motor?.ccm),
      status: motorStatus,
      horimetro: hours,
      corrente: current,
      cargaEstimada: null,
      alarme: motorStatus === 'falha'
        ? 'Falha sinalizada pelo CLP'
        : motorStatus === 'indisponivel' ? 'Leitura indisponível' : 'OK',
      potenciaNominal: null,
      categoria: motor?.category || null,
      correnteNominal: roundToTwo(motor?.nominalCurrent),
      possuiInversor: Boolean(motor?.hasInverter),
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
  // Tags do CCM1 e cadastro/leitura dos motores são as fontes obrigatórias.
  const [ccm1Payload, motorsPayload, ccm2Payload, truckFlowPayload] = await Promise.all([
    requestJson(CCM1_TAGS_PATH, signal),
    requestJson(MOTORS_PATH, signal),
    optionalRequest(CCM2_TAGS_PATH, signal),
    optionalRequest(TRUCK_FLOW_PATH, signal),
  ]);

  const ccm1 = mapCcm('ccm1', ccm1Payload);
  const ccm2 = mapCcm('ccm2', ccm2Payload);
  const motors = mapMotors(motorsPayload);
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
  motorsUrl: resolveUrl(MOTORS_PATH),
};
