// Get the current hostname and port
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol;
  
  // If we're on localhost or 127.0.0.1, use the default backend URL
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.REACT_APP_API_URL || 'http://localhost:8080';
  }
  
  // Otherwise, use the current hostname and port
  return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
};

export const API_BASE_URL = getBaseUrl();
export const WS_BASE_URL = API_BASE_URL.replace('http', 'ws'); 