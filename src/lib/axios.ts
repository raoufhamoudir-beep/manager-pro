import axios from 'axios';

// رابط الباك ايند الخاص بك
const API_URL = "http://localhost:5000/api";
 
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // للسماح بالكوكيز إذا لزم الأمر مستقبلاً
  headers: {
    'Content-Type': 'application/json',
  },
});

// اعتراض الأخطاء (اختياري لكن مفيد)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);