//Import de axios para llamadas a la api
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8080',
    timeout: 10000,
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false
})

export default api;