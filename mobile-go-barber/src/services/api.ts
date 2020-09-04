import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://192.168.2.105:3333',
    baseURL: 'https://nodedeploy.fullmindstudio.net/',
});

export default api;
