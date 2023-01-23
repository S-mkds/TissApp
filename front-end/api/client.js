import axios from "axios";

const client = axios.create({
    baseURL: "http://192.168.1.13:3000/", // URL de l'API maison Samir
    // baseURL: "http://10.10.40.104:3000/", // URL de l'API La plateforme
});

export default client;