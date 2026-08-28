export const CCM1_POWER_TAGS = Object.freeze({
  mainTransformer: 'KW',
  vsiTransformer: 'PotenciaTrafoVsiKva',
  general: 'PotenciaGeralKva',
});

const isGoodReading = (reading) =>
  String(reading?.quality ?? '').toUpperCase() === 'GOOD'
  && Number.isFinite(Number(reading?.value))
  && Boolean(reading?.ts);

function findTag(snapshot, tagName) {
  if (!tagName) return null;
  const tags = Array.isArray(snapshot) ? snapshot : snapshot?.tags;
  if (Array.isArray(tags)) return tags.find((tag) => tag?.name === tagName) ?? null;
  return tags?.[tagName] ?? snapshot?.[tagName] ?? null;
}

function toPowerPoint(reading) {
  if (!isGoodReading(reading)) return null;
  return { timestamp: reading.ts, value: Number(reading.value), quality: reading.quality };
}

export function mapCcm1PowerSnapshot(snapshot) {
  const mainReading = snapshot?.mainTransformer ?? findTag(snapshot, CCM1_POWER_TAGS.mainTransformer);
  const vsiReading = snapshot?.vsiTransformer ?? findTag(snapshot, CCM1_POWER_TAGS.vsiTransformer);
  const generalReading = snapshot?.general ?? findTag(snapshot, CCM1_POWER_TAGS.general);
  return {
    mainTransformer: toPowerPoint(mainReading),
    vsiTransformer: toPowerPoint(vsiReading),
    general: toPowerPoint(generalReading),
  };
}

function normalizePowerHistorySeries(series) {
  if (!Array.isArray(series)) return [];
  return series
    .flatMap((reading) => {
      const timestamp = reading?.timestamp ?? reading?.ts;
      const value = Number(reading?.value);
      const quality = String(reading?.quality ?? '').toUpperCase();
      if (!timestamp || quality !== 'GOOD' || !Number.isFinite(value)) return [];
      return [{ timestamp, value, quality }];
    })
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(-10);
}

export function mapCcm1PowerHistory(payload) {
  return {
    mainTransformer: normalizePowerHistorySeries(payload?.mainTransformer),
    vsiTransformer: normalizePowerHistorySeries(payload?.vsiTransformer),
    general: normalizePowerHistorySeries(payload?.general),
  };
}

export function appendPowerPoint(series, point, limit = 60) {
  if (!point) return series;
  return [...series.filter((item) => item.timestamp !== point.timestamp), point]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(-limit);
}

export function calculateGeneralLoad(mainSeries = [], vsiSeries = []) {
  const vsiByTimestamp = new Map(vsiSeries.map((point) => [point.timestamp, point]));
  return mainSeries.flatMap((mainPoint) => {
    const vsiPoint = vsiByTimestamp.get(mainPoint.timestamp);
    if (!vsiPoint || !Number.isFinite(mainPoint.value) || !Number.isFinite(vsiPoint.value)) return [];
    return [{ timestamp: mainPoint.timestamp, value: mainPoint.value + vsiPoint.value, quality: 'GOOD' }];
  });
}

export function mapCcm1Motors(payload) {
  const motors = Array.isArray(payload) ? payload : payload?.motors;
  if (!Array.isArray(motors)) return [];
  return motors
    .filter((motor) => motor?.name)
    .map((motor) => ({
      ...motor,
      reactKey: `${String(motor.ccm).toLowerCase()}:${motor.id ?? motor.name}`,
      current: motor.current !== null && motor.current !== undefined && Number.isFinite(Number(motor.current))
        ? Number(motor.current)
        : null,
      hours: motor.hours !== null && motor.hours !== undefined && Number.isFinite(Number(motor.hours))
        ? Number(motor.hours)
        : null,
    }));
}

// TODO(backend): confirm the definitive field name for motor load percentage.
export function mapCcm1MotorLoads(motors = []) {
  return motors
    .filter((motor) => {
      const category = String(motor?.category ?? '').trim().toLowerCase();
      const name = String(motor?.name ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

      const isConveyor = category === 'correia' || /^ct(?:\s|\d)/.test(name);
      const isUnidentified = name.includes('sem informacao');
      return !isConveyor && !isUnidentified;
    })
    .flatMap((motor) => {
      const motorNumber = Number(String(motor?.id ?? '').match(/^M(\d+)$/i)?.[1]);
      if (!Number.isInteger(motorNumber) || motorNumber < 1 || motorNumber > 11) return [];

      const apiLoad = motor?.loadPercentage;
      const current = motor?.current === null || motor?.current === undefined
        ? null
        : Number(motor.current);
      const nominalCurrent = Number(motor?.nominalCurrent);
      const calculatedLoad = current !== null && Number.isFinite(current) && Number.isFinite(nominalCurrent) && nominalCurrent > 0
        ? (current / nominalCurrent) * 100
        : null;
      const loadPercentage = apiLoad === null || apiLoad === undefined
        ? calculatedLoad
        : Number(apiLoad);

      if (!Number.isFinite(loadPercentage) || loadPercentage < 0) return [];

      return [{
        reactKey: motor.reactKey,
        motorNumber,
        nome: motor.name.length > 18 ? `${motor.name.slice(0, 17)}…` : motor.name,
        nomeCompleto: motor.name,
        carga: Math.round(loadPercentage * 10) / 10,
      }];
    })
    .sort((a, b) => a.motorNumber - b.motorNumber)
    .slice(0, 11);
}
