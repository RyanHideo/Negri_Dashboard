// A tela usa somente as leituras reais da API. Os dados abaixo ficam disponíveis para desenvolvimento manual.
export const CCM1_MOCK_ENABLED = false;

const mainValues = [342, 346, 353, 349, 357, 361, 358, 365, 368, 364, 371, 374];
const vsiValues = [142, 146, 149, 151, 148, 153, 156, 158, 161, 159, 164, 166];

const previewEnd = Date.now();
const timestamps = mainValues.map((_, index) =>
  new Date(previewEnd - (mainValues.length - 1 - index) * 60_000).toISOString(),
);

const makeSeries = (values) => values.map((value, index) => ({
  timestamp: timestamps[index],
  value,
  quality: 'GOOD',
}));

export const ccm1PowerPreview = Object.freeze({
  mainTransformer: makeSeries(mainValues),
  vsiTransformer: makeSeries(vsiValues),
});

const fallbackMotorNames = [
  'Elevador 02 - Moega',
  'Elevador 04',
  'Elevador 06',
  'Redler Silo 1',
  'Redler Silo 2',
  'Redler Silo 3',
  'Redler Silo 4',
  'Rosca Varredora Silo 2',
  'Elevador 07 - Armazém',
  'Elevador 08 - Armazém',
  'Elevador 01 - Moega',
  'Elevador 09 - Silo Carga',
];

const previewLoads = [68, 54, 72, 46, 63, 81, 59, 74, 41, 66, 57, 77];
const shortName = (name) => name.length > 18 ? `${name.slice(0, 17)}…` : name;

export function createMotorLoadPreview(motors = []) {
  const names = motors.length > 0
    ? motors.slice(0, previewLoads.length).map((motor) => motor.name)
    : fallbackMotorNames;

  return names.map((name, index) => ({
    reactKey: `preview:${name}`,
    nome: shortName(name),
    nomeCompleto: name,
    carga: previewLoads[index],
  }));
}
