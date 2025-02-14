'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../../hooks/useAuth';
import { api } from '../../services/api';
import OrdersTable from '../../components/OrdersTable';
import { Order } from '../../types/types';

export default function OrdersPage() {
	const { token, logout } = useAuth() ?? {};
	const [orders, setOrders] = useState<Order[]>([]);
	const router = useRouter();

	useEffect(() => {
		if (!token) {
			router.push('/login');
			return;
		}

		const fetchOrders = async () => {
			try {
				const { data } = await api.get('/order', {
					headers: { Authorization: `Bearer ${token}` },
				});
				setOrders(data);
			} catch (error) {
				console.error('Error fetching orders:', error);
			}
		};

		fetchOrders();
	}, [token, router]);

	useEffect(() => {
		if (!token) {
			router.push('/login');
		}
	}, [token, router]);

	if (!token) {
		return <p>Redirigiendo a login...</p>;
	}

	return (
		<div className='mx-auto max-w-7xl p-4'>
			<p className='text-gray-700 font-medium'>
				Bienvenido <span className='font-bold'>Comercializadora ABC</span>
			</p>
			<div className='flex justify-between mb-6'>
				<h1 className='text-2xl font-bold mb-6'>Mis pedidos</h1>
				<button
					onClick={logout}
					className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700'
				>
					Cerrar sesión
				</button>
			</div>

			<OrdersTable
				orders={orders}
				onDelete={(id) => {
					setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
				}}
			/>
		</div>
	);
}
