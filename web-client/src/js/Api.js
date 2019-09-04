import axios from 'axios';
const Api = axios.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 20000,
});

export default Api;
