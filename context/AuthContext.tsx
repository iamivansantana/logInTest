'use client';

import {
	createContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
	useContext,
	useRef,
} from 'react';
import { useRouter } from 'next/navigation';
import { apiLogIn } from '../services/api';

interface AuthContextProps {
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

// Se simula la duracion del Token
const TOKEN_VALIDITY_DURATION = 2 * 60 * 1000; // 2 minutos en milisegundos

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [token, setToken] = useState<string | null>(null);
	const [expiryTime, setExpiryTime] = useState<number | null>(null);
	const router = useRouter();

	const tokenRefreshTimeout = useRef<NodeJS.Timeout | null>(null);

	const scheduleTokenRefresh = useCallback(() => {
		if (!expiryTime) return;

		const now = Date.now();
		const timeout = expiryTime - now - 60000; // Refrescamos 1 minuto antes de expirar
		console.log(`scheduleTokenRefresh ejecutado. Tiempo restante: ${timeout} ms`);

		// Si ya hay un timeout programado se limpia
		if (tokenRefreshTimeout.current) {
			clearTimeout(tokenRefreshTimeout.current);
		}

		if (timeout > 0) {
			tokenRefreshTimeout.current = setTimeout(() => {
				console.log('Refrescando Token');
				refreshToken();
			}, timeout);
		}
	}, [expiryTime]);

	const refreshToken = async () => {
		try {
			// Simulamos una llamada al endpoint de refresh
			const newToken = 'NewToken_' + Math.random().toString(36).substring(2, 15);
			const newExpiry = Date.now() + TOKEN_VALIDITY_DURATION;

			// Guardamos en localStorage antes de actualizar el estado
			localStorage.setItem('token', newToken);
			localStorage.setItem('expiryTime', newExpiry.toString());

			setToken(newToken);
			setExpiryTime(newExpiry);

			console.log('Token refrescado:', newToken);

			// Volver a programar el refresco después de que expire el tiempo
			scheduleTokenRefresh();
		} catch (error) {
			console.error('Error al refrescar el token:', error);
			logout();
		}
	};

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const storedExpiry = localStorage.getItem('expiryTime');

		if (storedToken && storedExpiry) {
			const expiry = parseInt(storedExpiry);

			if (Date.now() < expiry) {
				setToken(storedToken);
				setExpiryTime(expiry);

				// Programar refresco solo si aún no ha expirado
				scheduleTokenRefresh();
			} else {
				console.log('Token expirado, llamando a logout.');
				logout();
			}
		}
	}, []);

	useEffect(() => {
		if (token && expiryTime) {
			console.log(
				'Token y expiryTime detectados en useEffect. Programando refresh.'
			);
			scheduleTokenRefresh();
		}
	}, [token, expiryTime]); // escucha los cambios en token y expiryTime

	const login = async (email: string, password: string) => {
		try {
			const { data } = await apiLogIn.post('/login', { email, password });
			const receivedToken = data.token;
			const expiry = Date.now() + TOKEN_VALIDITY_DURATION;

			console.log(
				'Login exitoso. Token recibido:',
				receivedToken,
				'Expira en:',
				expiry
			);

			localStorage.setItem('token', receivedToken);
			localStorage.setItem('expiryTime', expiry.toString());

			setToken(receivedToken);
			setExpiryTime(expiry);

			router.push('/orders');

			// Verificar si se programa el refresco
			setTimeout(() => {
				console.log('Llamando a scheduleTokenRefresh desde login()');
				scheduleTokenRefresh();
			}, 100);
		} catch (error) {
			console.error('Login fallido', error);
		}
	};

	const logout = () => {
		setToken(null);
		setExpiryTime(null);
		localStorage.removeItem('token');
		localStorage.removeItem('expiryTime');

		if (tokenRefreshTimeout.current) {
			clearTimeout(tokenRefreshTimeout.current);
		}

		router.push('/login');
	};

	return (
		<AuthContext.Provider value={{ token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe usarse dentro de un AuthProvider');
	}
	return context;
};
export default AuthContext;
