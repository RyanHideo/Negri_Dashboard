const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function getJson(path, signal) {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export const getCcm1TagSnapshot = (signal) => getJson('/api/modbus/ccm1/tags', signal);
export const getCcm1PowerHistory = (signal) => getJson('/api/power/history', signal);
export const getMotorsOverview = (signal) => getJson('/api/motors/overview', signal);
