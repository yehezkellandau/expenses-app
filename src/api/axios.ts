import axios from 'axios';
 
const api = axios.create({
  baseURL: 'https://www.expenses-api.yehezkellandau.com/api/', // Replace with your real URL
  withCredentials: true, // if you use cookies/session
});

export default api;