import axios from 'axios';

const api = axios.create({
    // baseURL ini adalah alamat rumah Laravel kamu.
    // Semua request dari React akan dikirim ke alamat ini.
    baseURL: 'http://localhost:8000/api/v1', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;