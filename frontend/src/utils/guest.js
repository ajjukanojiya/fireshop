import { v4 as uuidv4 } from 'uuid';

export function ensureGuestToken() {
  let t = localStorage.getItem('guest_token');
  if (!t) {
    t = uuidv4();
    localStorage.setItem('guest_token', t);
  }
  return t;
}
