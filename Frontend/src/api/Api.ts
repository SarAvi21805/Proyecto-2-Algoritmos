//Import de axios para llamadas a la api
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8080', //Se define la url base de la api
    timeout: 10000, //Se define el tiempo de espera para la respuesta de la api
    headers:{ 
        'Content-Type': 'application/json', //Se define el tipo de contenido que se enviará en la solicitud
        'Accept': 'application/json',
    },
    withCredentials: false
})

export default api;