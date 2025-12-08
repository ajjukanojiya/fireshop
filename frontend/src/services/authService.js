import api from '../api/api';

export async function sendOtpForGuest(phone) {
  const guest_token = localStorage.getItem('guest_token') || null;
  const res = await api.post('/auth/send-otp', { phone, purpose: 'guest_checkout', guest_token });
  return res.data;
}


export async function verifyOtpAndClaim({ phone, otp }) {
  const guest_token = localStorage.getItem('guest_token');
  const res = await api.post('/auth/verify-otp', { phone, otp, guest_token });
  const token = res.data.token;
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  // cleanup guest token after claim
  localStorage.removeItem('guest_token');
  return res.data;
}

