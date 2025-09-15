import axios from 'axios';
 
const api = axios.create({
  // baseURL: 'https://www.expenses-api.yehezkellandau.com/api/', // Replace with your real URL
  baseURL : import.meta.env.VITE_API_URL,
  withCredentials: true, // if you use cookies/session
});

export default api;