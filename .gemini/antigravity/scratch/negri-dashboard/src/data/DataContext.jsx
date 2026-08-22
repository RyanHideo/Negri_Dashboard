import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createEmptyDashboardData, loadDashboardData } from './api';

const POLL_INTERVAL_MS = 2_000;
const RETRY_INTERVAL_MS = 5_000;
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(createEmptyDashboardData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSuccessfulAt, setLastSuccessfulAt] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let timer;

    const poll = async () => {
      let succeeded = false;
      try {
        const nextData = await loadDashboardData(controller.signal);
        if (controller.signal.aborted) return;

        setData(nextData);
        setLastSuccessfulAt(new Date());
        setError(null);
        succeeded = true;
      } catch (requestError) {
        if (controller.signal.aborted) return;

        setError(requestError instanceof Error ? requestError : new Error('Não foi possível consultar as tags do CCM1'));
        // Se já houve uma leitura boa, ela permanece visível durante a falha.
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          timer = window.setTimeout(poll, succeeded ? POLL_INTERVAL_MS : RETRY_INTERVAL_MS);
        }
      }
    };

    void poll();

    return () => {
      controller.abort();
      if (timer) window.clearTimeout(timer);
    };
  }, [refreshKey]);

  return (
    <DataContext.Provider value={{ data, error, loading, lastSuccessfulAt, refresh }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDashboardData deve ser usado dentro de DataProvider');
  return context;
}
