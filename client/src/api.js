const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

function resolveApiBaseUrl() {
  if (configuredApiBaseUrl) {
    return configuredApiBaseUrl.replace(/\/$/, '');
  }

  const { hostname, protocol } = window.location;
  const isLocalVite =
    (hostname === 'localhost' || hostname === '127.0.0.1') &&
    window.location.port === '5173';

  if (isLocalVite) {
    return 'http://localhost:5000';
  }

  if (protocol === 'file:') {
    return 'http://localhost:5000';
  }

  return '';
}

const API_BASE_URL = resolveApiBaseUrl();

export function buildApiUrl(pathname) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function readJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(
      text.trim() ||
        `Expected JSON from ${response.url}, but received ${response.status}. Check VITE_API_BASE_URL for hosted deployments.`,
    );
  }

  return response.json();
}
