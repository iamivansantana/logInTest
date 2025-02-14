import { useState } from 'react';
import { Order } from '../types/types';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/solid';

interface OrdersTableProps {
	orders: Order[];
	onDelete: (id: string) => void;
}

export default function OrdersTable({ orders, onDelete }: OrdersTableProps) {
	// Estados para paginación
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState<{
		type: 'view' | 'delete';
		order?: Order;
	}>({ type: 'view' });

	// Calcular total de páginas
	const totalPages = Math.ceil(orders.length / itemsPerPage);

	// Calcular los índices para el slice
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	// Órdenes que se muestran en la tabla
	const displayedOrders = orders.slice(startIndex, endIndex);

	// Maneja el cambio en el select
	const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1); // Reiniciamos a la primera página
	};

	// Funciones para cambiar de página
	const goToPreviousPage = () => {
		setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
	};

	const goToNextPage = () => {
		setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
	};

	const openViewModal = (order: Order) => {
		setModalContent({ type: 'view', order });
		setModalOpen(true);
	};

	const openDeleteModal = (order: Order) => {
		setModalContent({ type: 'delete', order });
		setModalOpen(true);
	};

	const handleDelete = () => {
		if (modalContent.order) {
			onDelete(modalContent.order.id);
			setModalOpen(false);
		}
	};

	return (
		<div className='bg-white shadow rounded p-4'>
			<div className='mb-4 flex items-center justify-start gap-2'>
				<label htmlFor='itemsPerPage' className='text-gray-700 font-medium'>
					Elementos por página:
				</label>
				<select
					id='itemsPerPage'
					value={itemsPerPage}
					onChange={handleItemsPerPageChange}
					className='border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500'
				>
					<option value={10}>10 elementos</option>
					<option value={15}>15 elementos</option>
					<option value={20}>20 elementos</option>
				</select>
			</div>

			{/* Tabla */}
			<div className='overflow-x-auto'>
				<table className='w-full text-sm text-left text-gray-600'>
					<thead className='text-xs uppercase text-gray-700 border-b border-b-orange-500 '>
						<tr>
							<th scope='col' className='px-6 py-3'>
								Número de Orden
							</th>
							<th scope='col' className='px-6 py-3'>
								Medio de Ingreso
							</th>
							<th scope='col' className='px-6 py-3'>
								Fecha de Creación
							</th>
							<th scope='col' className='px-6 py-3'>
								Nombre del Cliente
							</th>
							<th scope='col' className='px-6 py-3'>
								Fecha y Hora de Entrega
							</th>
							<th scope='col' className='px-6 py-3'>
								Acciones
							</th>
						</tr>
					</thead>
					<tbody>
						{displayedOrders.length > 0 ? (
							displayedOrders.map((order) => (
								<tr key={order.id} className=' rounded-lg my-1 hover:bg-gray-50'>
									<td className=' px-6 py-4 font-medium text-gray-900 '>
										{order.order_num}
									</td>
									<td className='px-6 py-4'>{order.channel}</td>
									<td className='px-6 py-4'>
										{new Date(order.created_at).toLocaleString()}
									</td>
									<td className='px-6 py-4'>{order.customer_name}</td>
									<td className='px-6 py-4'>
										{new Date(order.delivery_date).toLocaleDateString()} -{' '}
										{new Date(order.delivery_time).toLocaleTimeString()}
									</td>

									<td className='px-6 py-4 flex justify-between whitespace-nowrap'>
										<div className='flex items-center gap-2'>
											<button
												onClick={() => openViewModal(order)}
												className='border border-blue-500 text-white p-2 rounded'
											>
												<EyeIcon className='h-5 w-5 text-blue-500' />
											</button>
											<button
												onClick={() => openDeleteModal(order)}
												className='border border-red-500 text-white p-2 rounded'
											>
												<TrashIcon className='h-5 w-5 text-red-500' />
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} className='text-center py-4 text-gray-500 italic'>
									No hay órdenes para mostrar.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Controles de paginación */}
			{totalPages > 1 && (
				<div className='flex justify-end items-center mt-4 space-x-4'>
					<button
						onClick={goToPreviousPage}
						disabled={currentPage === 1}
						className='px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						Anterior
					</button>

					<span className='text-gray-700 font-medium'>
						Página {currentPage} de {totalPages}
					</span>

					<button
						onClick={goToNextPage}
						disabled={currentPage === totalPages}
						className='px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						Siguiente
					</button>
				</div>
			)}

			{modalOpen && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-white p-6 rounded shadow-lg relative'>
						<button
							onClick={() => setModalOpen(false)}
							className='absolute top-2 right-2 text-xl'
						>
							&times;
						</button>

						{modalContent.type === 'view' && modalContent.order && (
							<div>
								<h2 className='text-lg font-bold mb-4'>Detalles de la Orden</h2>
								<p>
									<strong>Orden:</strong> {modalContent.order.order_num}
								</p>
								<p>
									<strong>Cliente:</strong> {modalContent.order.customer_name}
								</p>
								<p>
									<strong>Fecha:</strong>{' '}
									{new Date(modalContent.order.created_at).toLocaleString()}
								</p>
								<button
									onClick={() => setModalOpen(false)}
									className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'
								>
									Aceptar
								</button>
							</div>
						)}

						{modalContent.type === 'delete' && modalContent.order && (
							<div>
								<h2 className='text-lg font-bold mb-4'>Confirmar Eliminación</h2>
								<p>
									¿Estás seguro de que deseas eliminar la orden{' '}
									<strong>{modalContent.order.order_num}</strong>?
								</p>
								<div className='mt-4 flex justify-center gap-4'>
									<button
										onClick={() => setModalOpen(false)}
										className='bg-gray-300 px-4 py-2 rounded'
									>
										Cancelar
									</button>
									<button
										onClick={handleDelete}
										className='bg-red-500 text-white px-4 py-2 rounded'
									>
										Eliminar
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
