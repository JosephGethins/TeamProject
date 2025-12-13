// Default to localhost:4000 in development if VITE_API_BASE is not set
export const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:4000' : '');
