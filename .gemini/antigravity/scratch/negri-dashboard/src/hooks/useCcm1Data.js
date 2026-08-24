import { useEffect, useMemo, useState } from 'react';
import { getCcm1TagSnapshot, getMotorsOverview } from '../services/ccm1Api';
import { appendPowerPoint, calculateGeneralLoad, mapCcm1MotorLoads, mapCcm1Motors, mapCcm1PowerSnapshot } from '../services/ccm1Adapter';
import { CCM1_MOCK_ENABLED, ccm1PowerPreview, createMotorLoadPreview } from '../data/ccm1PreviewData';

export default function useCcm1Data() {
  const [power, setPower] = useState({ mainTransformer: [], vsiTransformer: [], general: [] });
  const [motors, setMotors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [powerError, setPowerError] = useState(null);
  const [motorsError, setMotorsError] = useState(null);

  useEffect(() => {
    if (CCM1_MOCK_ENABLED) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    let controller;
    const refresh = async () => {
      controller?.abort();
      controller = new AbortController();
      const results = await Promise.allSettled([
        getCcm1TagSnapshot(controller.signal),
        getMotorsOverview(controller.signal),
      ]);
      if (!active) return;
      const [powerResult, motorsResult] = results;
      if (powerResult.status === 'fulfilled') {
        const snapshot = mapCcm1PowerSnapshot(powerResult.value);
        setPower((previous) => ({
          mainTransformer: appendPowerPoint(previous.mainTransformer, snapshot.mainTransformer),
          vsiTransformer: appendPowerPoint(previous.vsiTransformer, snapshot.vsiTransformer),
          general: appendPowerPoint(previous.general, snapshot.general),
        }));
        setPowerError(null);
      } else {
        setPowerError('Não foi possível obter as leituras de potência.');
      }
      if (motorsResult.status === 'fulfilled') {
        setMotors(mapCcm1Motors(motorsResult.value));
        setMotorsError(null);
      } else {
        setMotorsError('Não foi possível obter os motores do CCM1.');
      }
      setLoading(false);
    };
    refresh();
    const timer = window.setInterval(refresh, 1000);
    return () => { active = false; window.clearInterval(timer); controller?.abort(); };
  }, []);

  const liveMotorLoads = useMemo(() => mapCcm1MotorLoads(motors), [motors]);
  const previewGeneral = useMemo(
    () => calculateGeneralLoad(ccm1PowerPreview.mainTransformer, ccm1PowerPreview.vsiTransformer),
    [],
  );
  const previewMotorLoads = useMemo(() => createMotorLoadPreview(), []);

  return {
    power: CCM1_MOCK_ENABLED
      ? { ...ccm1PowerPreview, general: previewGeneral }
      : power,
    motorLoads: CCM1_MOCK_ENABLED ? previewMotorLoads : liveMotorLoads,
    loading: CCM1_MOCK_ENABLED ? false : loading,
    powerError: CCM1_MOCK_ENABLED ? null : powerError,
    motorsError: CCM1_MOCK_ENABLED ? null : motorsError,
  };
}
