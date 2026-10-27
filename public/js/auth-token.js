const tokenKey = 'accessToken';

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function saveToken(token) {
  if (typeof token !== 'string' || !token.trim()) {
    throw new TypeError('Token phải là chuỗi không rỗng.');
  }
  localStorage.setItem(tokenKey, token.trim());
}

export function clearToken() {
  localStorage.removeItem(tokenKey);
}

export function hasToken() {
  return Boolean(getToken());
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
