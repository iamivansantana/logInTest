// Archivo: /services/api.ts
import axios from 'axios';

export const api = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_API_URL ||
		'https://67aa117865ab088ea7e58c36.mockapi.io/api/v1',
});
export const apiLogIn = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_LOGIN_URL || ' https://reqres.in/api',
});
