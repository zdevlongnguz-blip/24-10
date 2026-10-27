import axios from 'axios';

const API = process.env.JSON_SERVER_URL || 'http://localhost:3001';

export async function login(credentials) {
  const response = await axios.post(`${API}/login`, credentials);
  return response.data;
}

export async function register(credentials) {
  const response = await axios.post(`${API}/register`, credentials);
  return response.data;
}
