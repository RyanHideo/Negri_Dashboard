// TODO(backend): configure these names when the definitive Modbus tags are published.
// KW is deliberately not mapped because it is documented only as total power.
export const CCM1_POWER_TAGS = Object.freeze({ mainTransformer: null, vsiTransformer: null });

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
  return { mainTransformer: toPowerPoint(mainReading), vsiTransformer: toPowerPoint(vsiReading) };
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
    .filter((motor) => String(motor?.ccm).toLowerCase() === 'ccm1' && motor?.name)
    .map((motor) => ({
      ...motor,
      reactKey: `${String(motor.ccm).toLowerCase()}:${motor.name}`,
      current: Number.isFinite(Number(motor.current)) ? Number(motor.current) : null,
      hours: Number.isFinite(Number(motor.hours)) ? Number(motor.hours) : null,
    }));
}

// TODO(backend): confirm the definitive field name for motor load percentage.
export function mapCcm1MotorLoads(motors = []) {
  return motors.flatMap((motor) => {
    const loadPercentage = Number(motor?.loadPercentage);
    if (!Number.isFinite(loadPercentage) || loadPercentage < 0 || loadPercentage > 100) return [];
    return [{
      reactKey: motor.reactKey,
      nome: motor.name.length > 18 ? `${motor.name.slice(0, 17)}…` : motor.name,
      nomeCompleto: motor.name,
      carga: loadPercentage,
    }];
  });
}
