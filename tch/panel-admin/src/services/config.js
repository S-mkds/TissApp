import axios from 'axios';
import baseURL from './BaseUrl';

const API_URL = baseURL;

let token;

const instance = axios.create({
	baseURL: `${API_URL}/api`,
});

instance.interceptors.request.use((config) => {
	if (typeof window !== 'undefined') {
		token = window.localStorage.getItem('token');
	}
	config.headers.Authorization = token ? `Bearer ${token}` : '';
	return config;
});

export default instance;
