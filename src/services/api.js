import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Pastikan setiap fungsi hanya di-export satu kali
export const getDashboardSummary = () => api.get('/reports/summary');
export const getHouses = () => api.get('/houses');
export const getOccupants = () => api.get('/occupants');
export const createOccupant = (data) => api.post('/occupants', data); // Hapus baris serupa jika ada di bawah
export const assignHouse = (houseId, data) => api.post(`/houses/${houseId}/assign`, data);
export const createPayment = (data) => api.post('/payments', data);
export const createExpense = (data) => api.post('/expenses', data);

export default api;