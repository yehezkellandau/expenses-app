import axios from 'axios';
 
const api = axios.create({
  baseURL: 'http://expenses-api.yehezkellandau.com/api/', // Replace with your real URL
  withCredentials: false, // if you use cookies/session
});

export default api;