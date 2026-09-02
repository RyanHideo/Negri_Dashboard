import { useEffect, useMemo, useState } from 'react';
import { getCcm1PowerHistory, getCcm1TagSnapshot } from '../services/ccm1Api';
import {
  appendPowerPoint,
  calculateGeneralLoad,
  mapCcm1MotorLoads,
  mapCcm1PowerHistory,
  mapCcm1PowerSnapshot,
} from '../services/ccm1Adapter';
import { CCM1_MOCK_ENABLED, ccm1PowerPreview, createMotorLoadPreview } from '../data/ccm1PreviewData';

const POLL_INTERVAL_MS = 2_000;
const RETRY_INTERVAL_MS = 5_000;
const COMMUNICATION_WARNING_DELAY_MS = 30_000;

export default function useCcm1Data(dashboardMotors = []) {
  const [power, setPower] = useState({ mainTransformer: [], vsiTransformer: [], general: [] });
  const [loading, setLoading] = useState(true);
  const [powerError, setPowerError] = useState(null);

  useEffect(() => {
    if (CCM1_MOCK_ENABLED) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    let controller;
    let timer;
    let failureStartedAt = null;

    const refresh = async (includeHistory = false) => {
      controller = new AbortController();
      const requests = [getCcm1TagSnapshot(controller.signal)];
      if (includeHistory) requests.push(getCcm1PowerHistory(controller.signal));
      const results = await Promise.allSettled(requests);
      if (!active) return;
      const [powerResult, historyResult] = results;
      let succeeded = false;

      if (powerResult.status === 'fulfilled') {
        const snapshot = mapCcm1PowerSnapshot(powerResult.value);
        const history = historyResult?.status === 'fulfilled'
          ? mapCcm1PowerHistory(historyResult.value)
          : null;
        setPower((previous) => {
          const base = history ?? previous;
          return {
            mainTransformer: appendPowerPoint(base.mainTransformer, snapshot.mainTransformer),
            vsiTransformer: appendPowerPoint(base.vsiTransformer, snapshot.vsiTransformer),
            general: appendPowerPoint(base.general, snapshot.general),
          };
        });
        setPowerError(null);
        failureStartedAt = null;
        succeeded = true;
      } else {
        const now = Date.now();
        if (failureStartedAt === null) failureStartedAt = now;
        if (now - failureStartedAt >= COMMUNICATION_WARNING_DELAY_MS) {
          setPowerError('Não foi possível obter as leituras de potência.');
        }
      }

      setLoading(false);
      if (active) {
        timer = window.setTimeout(
          () => { void refresh(false); },
          succeeded ? POLL_INTERVAL_MS : RETRY_INTERVAL_MS,
        );
      }
    };

    void refresh(true);

    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
      controller?.abort();
    };
  }, []);

  const liveMotorLoads = useMemo(() => mapCcm1MotorLoads(dashboardMotors), [dashboardMotors]);
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
  };
}
