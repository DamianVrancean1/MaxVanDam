export function getApiUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // In development, API is typically on the same host but different port
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//localhost:5000`;
  }

  // In production, API is typically on the same host
  return `${protocol}//${hostname}`;
}

