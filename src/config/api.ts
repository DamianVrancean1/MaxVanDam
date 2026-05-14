export function getApiUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:5010';
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // In development, API is typically on the same host but different port
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//localhost:5010`;
  }

  // In production, API is typically on the same host
  return `${protocol}//${hostname}`;
}

