'use client';

import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { login } = useContext(AuthContext) ?? {};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		login?.(email, password);
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50'>
			<div className='w-full max-w-sm p-8 bg-white rounded-lg shadow-lg'>
				<h2 className='text-2xl font-semibold text-center text-gray-700 mb-6'>
					Bienvenido de vuelta 👋🏽
				</h2>
				<h4 className='text-xl  text-center text-gray-700 mb-6'>
					Por favor inicia sesión
				</h4>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='Email'
							required
							className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
					<div>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Password'
							required
							className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
					<div className='pt-3'>
						<button
							type='submit'
							className='w-full py-3 bg-orange-400 text-white font-semibold rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500'
						>
							Iniciar sesión
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
