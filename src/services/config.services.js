import axios from "axios";

const service = axios.create({
    baseUrl: process.env.REACT_APP_SERVER_URL,
 })


 service.interceptors.request.use((config) => {

    const authToken = localStorage.getItem("authToken");

    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
 })

 export default service;