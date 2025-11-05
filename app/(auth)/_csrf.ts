import { generateCsrfToken, setCsrfCookie } from '../../lib/auth';

// Gera e configura um token CSRF seguro
export function issueCsrf() {
  const token = generateCsrfToken();
  setCsrfCookie(token);
  return token;
}
