'use client';
import { useEffect } from 'react';
import LoginForm from '../../components/LoginForm';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const { token } = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (token) {
			router.push('/orders');
		}
	}, [token, router]);
	return (
		<div>
			<LoginForm />
		</div>
	);
}
