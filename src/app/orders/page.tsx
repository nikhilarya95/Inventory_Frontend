// // // 'use client';

// // // import React, { useEffect, useState } from 'react';
// // // import { DashboardLayout } from '@/components/layout/DashboardLayout';
// // // import { Card, CardContent } from '@/components/ui/Card';
// // // import { Button } from '@/components/ui/Button';
// // // import { Input } from '@/components/ui/Input';
// // // import { Select } from '@/components/ui/Select';
// // // import { Modal } from '@/components/ui/Modal';
// // // import { Badge } from '@/components/ui/Badge';
// // // import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
// // // import { ordersAPI, customersAPI, productsAPI, stockAPI } from '@/lib/api';
// // // import { Order, Customer, Product, Stock } from '@/types';
// // // import { useAuth } from '@/contexts/AuthContext';
// // // import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// // // import { formatCurrency, formatDate } from '@/lib/utils';

// // // export default function OrdersPage() {
// // //   const [orders, setOrders] = useState<Order[]>([]);
// // //   const [customers, setCustomers] = useState<Customer[]>([]);
// // //   const [products, setProducts] = useState<Product[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
// // //   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const { hasRole } = useAuth();

// // //   const [formData, setFormData] = useState({
// // //     customer: '',
// // //     orderDate: new Date().toISOString().split('T')[0],
// // //     items: [{ product: '', quantity: 1, mrp: 0 }],
// // //   });

// // //   useEffect(() => {
// // //     loadData();
// // //   }, []);

// // //   const loadData = async () => {
// // //     try {
// // //       const [ordersRes, customersRes, productsRes] = await Promise.all([
// // //         ordersAPI.getAll(),
// // //         customersAPI.getAll(),
// // //         productsAPI.getAll(),
// // //       ]);
// // //       setOrders(ordersRes.data);
// // //       setCustomers(customersRes.data);
// // //       setProducts(productsRes.data);
// // //     } catch (error) {
// // //       console.error('Error loading data:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const openModal = () => {
// // //     setFormData({
// // //       customer: '',
// // //       orderDate: new Date().toISOString().split('T')[0],
// // //       items: [{ product: '', quantity: 1, mrp: 0 }],
// // //     });
// // //     setIsModalOpen(true);
// // //   };

// // //   const closeModal = () => {
// // //     setIsModalOpen(false);
// // //   };

// // //   const viewOrder = (order: Order) => {
// // //     setSelectedOrder(order);
// // //     setIsViewModalOpen(true);
// // //   };

// // //   const addItem = () => {
// // //     setFormData({
// // //       ...formData,
// // //       items: [...formData.items, { product: '', quantity: 1, mrp: 0 }],
// // //     });
// // //   };

// // //   const removeItem = (index: number) => {
// // //     const items = formData.items.filter((_, i) => i !== index);
// // //     setFormData({ ...formData, items });
// // //   };

// // //   const updateItem = (index: number, field: string, value: any) => {
// // //     const items = [...formData.items];
// // //     items[index] = { ...items[index], [field]: value };
// // //     setFormData({ ...formData, items });
// // //   };

// // //   const onSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     try {
// // //       setIsSubmitting(true);
// // //       await ordersAPI.create(formData);
// // //       await loadData();
// // //       closeModal();
// // //     } catch (error: any) {
// // //       alert(error.response?.data?.message || 'Error creating order');
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleDelete = async (id: string) => {
// // //     if (confirm('Are you sure you want to delete this order?')) {
// // //       try {
// // //         await ordersAPI.delete(id);
// // //         await loadData();
// // //       } catch (error: any) {
// // //         alert(error.response?.data?.message || 'Error deleting order');
// // //       }
// // //     }
// // //   };

// // //   const getStatusBadge = (status: string) => {
// // //     const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
// // //       Pending: 'warning',
// // //       Confirmed: 'info',
// // //       Billed: 'success',
// // //       Cancelled: 'danger',
// // //     };
// // //     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
// // //   };

// // //   const canEdit = hasRole(['Admin', 'Sales Man']);

// // //   return (
// // //     <DashboardLayout>
// // //       <div className="space-y-6">
// // //         <div className="flex items-center justify-between">
// // //           <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
// // //           {canEdit && (
// // //             <Button onClick={openModal}>
// // //               <Plus className="h-4 w-4 mr-2" />
// // //               Create Order
// // //             </Button>
// // //           )}
// // //         </div>

// // //         <Card>
// // //           <CardContent>
// // //             {loading ? (
// // //               <div className="flex justify-center py-8">
// // //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
// // //               </div>
// // //             ) : (
// // //               <Table>
// // //                 <TableHeader>
// // //                   <TableRow>
// // //                     <TableHead>Order ID</TableHead>
// // //                     <TableHead>Date</TableHead>
// // //                     <TableHead>Customer</TableHead>
// // //                     <TableHead>Items</TableHead>
// // //                     <TableHead>Total</TableHead>
// // //                     <TableHead>Status</TableHead>
// // //                     <TableHead>Actions</TableHead>
// // //                   </TableRow>
// // //                 </TableHeader>
// // //                 <TableBody>
// // //                   {orders.map((order) => (
// // //                     <TableRow key={order._id}>
// // //                       <TableCell className="font-medium">{order.orderId}</TableCell>
// // //                       <TableCell>{formatDate(order.orderDate)}</TableCell>
// // //                       <TableCell>
// // //                         <div>
// // //                           <p>{order.customer?.shopName}</p>
// // //                           <p className="text-sm text-gray-500">{order.customer?.firstName} {order.customer?.lastName}</p>
// // //                         </div>
// // //                       </TableCell>
// // //                       <TableCell>{order.items?.length || 0} items</TableCell>
// // //                       <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
// // //                       <TableCell>{getStatusBadge(order.status)}</TableCell>
// // //                       <TableCell>
// // //                         <div className="flex space-x-2">
// // //                           <button onClick={() => viewOrder(order)} className="text-gray-600 hover:text-gray-800">
// // //                             <Eye className="h-4 w-4" />
// // //                           </button>
// // //                           {canEdit && (
// // //                             <button onClick={() => handleDelete(order._id)} className="text-red-600 hover:text-red-800">
// // //                               <Trash2 className="h-4 w-4" />
// // //                             </button>
// // //                           )}
// // //                         </div>
// // //                       </TableCell>
// // //                     </TableRow>
// // //                   ))}
// // //                   {orders.length === 0 && (
// // //                     <TableRow>
// // //                       <TableCell colSpan={7} className="text-center text-gray-500">No orders found</TableCell>
// // //                     </TableRow>
// // //                   )}
// // //                 </TableBody>
// // //               </Table>
// // //             )}
// // //           </CardContent>
// // //         </Card>

// // //         <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order" size="xl">
// // //           <form onSubmit={onSubmit} className="space-y-4">
// // //             <div className="grid grid-cols-2 gap-4">
// // //               <Select
// // //                 label="Customer"
// // //                 value={formData.customer}
// // //                 onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
// // //                 options={customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))}
// // //               />
// // //               <Input label="Order Date" type="date" value={formData.orderDate} onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })} />
// // //             </div>

// // //             <div className="space-y-3">
// // //               <div className="flex justify-between items-center">
// // //                 <h4 className="font-medium">Order Items</h4>
// // //                 <Button type="button" variant="secondary" size="sm" onClick={addItem}>Add Item</Button>
// // //               </div>
// // //               {formData.items.map((item, index) => (
// // //                 <div key={index} className="grid grid-cols-4 gap-3 items-end">
// // //                   <Select
// // //                     label={index === 0 ? "Product" : undefined}
// // //                     value={item.product}
// // //                     onChange={(e) => updateItem(index, 'product', e.target.value)}
// // //                     options={products.map(p => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))}
// // //                   />
// // //                   <Input label={index === 0 ? "Quantity" : undefined} type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))} />
// // //                   <Input label={index === 0 ? "MRP" : undefined} type="number" step="0.01" value={item.mrp} onChange={(e) => updateItem(index, 'mrp', parseFloat(e.target.value))} />
// // //                   {formData.items.length > 1 && (
// // //                     <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)}>Remove</Button>
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             <div className="flex justify-end space-x-3">
// // //               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
// // //               <Button type="submit" isLoading={isSubmitting}>Create Order</Button>
// // //             </div>
// // //           </form>
// // //         </Modal>

// // //         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details" size="lg">
// // //           {selectedOrder && (
// // //             <div className="space-y-4">
// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <p className="text-sm text-gray-500">Order ID</p>
// // //                   <p className="font-medium">{selectedOrder.orderId}</p>
// // //                 </div>
// // //                 <div>
// // //                   <p className="text-sm text-gray-500">Date</p>
// // //                   <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
// // //                 </div>
// // //                 <div>
// // //                   <p className="text-sm text-gray-500">Customer</p>
// // //                   <p className="font-medium">{selectedOrder.customer?.shopName}</p>
// // //                 </div>
// // //                 <div>
// // //                   <p className="text-sm text-gray-500">Status</p>
// // //                   {getStatusBadge(selectedOrder.status)}
// // //                 </div>
// // //               </div>
// // //               <div>
// // //                 <h4 className="font-medium mb-2">Items</h4>
// // //                 <Table>
// // //                   <TableHeader>
// // //                     <TableRow>
// // //                       <TableHead>Product</TableHead>
// // //                       <TableHead>Quantity</TableHead>
// // //                       <TableHead>Price</TableHead>
// // //                       <TableHead>Total</TableHead>
// // //                     </TableRow>
// // //                   </TableHeader>
// // //                   <TableBody>
// // //                     {selectedOrder.items?.map((item, index) => (
// // //                       <TableRow key={index}>
// // //                         <TableCell>{item.product?.brandName} - {item.product?.productName}</TableCell>
// // //                         <TableCell>{item.quantity}</TableCell>
// // //                         <TableCell>{formatCurrency(item.mrp)}</TableCell>
// // //                         <TableCell>{formatCurrency(item.quantity * item.mrp)}</TableCell>
// // //                       </TableRow>
// // //                     ))}
// // //                   </TableBody>
// // //                 </Table>
// // //               </div>
// // //               <div className="text-right">
// // //                 <p className="text-lg font-bold">Total: {formatCurrency(selectedOrder.totalAmount)}</p>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </Modal>
// // //       </div>
// // //     </DashboardLayout>
// // //   );
// // // }


// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import { DashboardLayout } from '@/components/layout/DashboardLayout';
// // import { Card, CardContent } from '@/components/ui/Card';
// // import { Button } from '@/components/ui/Button';
// // import { Input } from '@/components/ui/Input';
// // import { Select } from '@/components/ui/Select';
// // import { Modal } from '@/components/ui/Modal';
// // import { Badge } from '@/components/ui/Badge';
// // import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
// // import { ordersAPI, customersAPI, productsAPI } from '@/lib/api';
// // import { Order, Customer, Product } from '@/types';
// // import { useAuth } from '@/contexts/AuthContext';
// // import { Plus, Edit, Trash2, Eye } from 'lucide-react';
// // import { formatCurrency, formatDate } from '@/lib/utils';

// // export default function OrdersPage() {
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [customers, setCustomers] = useState<Customer[]>([]);
// //   const [products, setProducts] = useState<Product[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isViewModalOpen, setIsViewModalOpen] = useState(false);

// //   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const { hasRole } = useAuth();

// //   const [formData, setFormData] = useState({
// //     customer: '',
// //     orderDate: new Date().toISOString().split('T')[0],
// //     items: [{ product: '', quantity: 1, mrp: 0 }],
// //   });

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   const loadData = async () => {
// //     try {
// //       const [ordersRes, customersRes, productsRes] = await Promise.all([
// //         ordersAPI.getAll(),
// //         customersAPI.getAll(),
// //         productsAPI.getAll(),
// //       ]);
// //       setOrders(ordersRes.data);
// //       setCustomers(customersRes.data);
// //       setProducts(productsRes.data);
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const openModal = () => {
// //     setFormData({
// //       customer: '',
// //       orderDate: new Date().toISOString().split('T')[0],
// //       items: [{ product: '', quantity: 1, mrp: 0 }],
// //     });
// //     setIsModalOpen(true);
// //   };

// //   const closeModal = () => setIsModalOpen(false);

// //   const viewOrder = (order: Order) => {
// //     setSelectedOrder(order);
// //     setIsViewModalOpen(true);
// //   };

// //   const addItem = () => {
// //     setFormData({
// //       ...formData,
// //       items: [...formData.items, { product: '', quantity: 1, mrp: 0 }],
// //     });
// //   };

// //   const removeItem = (index: number) => {
// //     setFormData({
// //       ...formData,
// //       items: formData.items.filter((_, i) => i !== index),
// //     });
// //   };

// //   const updateItem = (index: number, field: string, value: any) => {
// //     const items = [...formData.items];
// //     items[index] = { ...items[index], [field]: value };
// //     setFormData({ ...formData, items });
// //   };

// //   const onSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       setIsSubmitting(true);
// //       await ordersAPI.create(formData);
// //       await loadData();
// //       closeModal();
// //     } catch (error: any) {
// //       alert(error.response?.data?.message || 'Error creating order');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleDelete = async (id: string) => {
// //     if (!confirm('Are you sure you want to delete this order?')) return;

// //     try {
// //       await ordersAPI.delete(id);
// //       await loadData();
// //     } catch (error: any) {
// //       alert(error.response?.data?.message || 'Error deleting order');
// //     }
// //   };

// //   const getStatusBadge = (status: string) => {
// //     const variants: any = {
// //       Pending: 'warning',
// //       Confirmed: 'info',
// //       Billed: 'success',
// //       Cancelled: 'danger',
// //     };
// //     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
// //   };

// //   const canEdit = hasRole(['Admin', 'Sales Man']);

// //   return (
// //     <DashboardLayout>
// //       {/* PAGE FADE-IN */}
// //       <div className="space-y-6 animate-fadeIn">

// //         {/* Header */}
// //         <div className="flex items-center justify-between">
// //           <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

// //           {canEdit && (
// //             <Button onClick={openModal} className="transition-all hover:scale-105 shadow-md">
// //               <Plus className="h-4 w-4 mr-2" />
// //               Create Order
// //             </Button>
// //           )}
// //         </div>

// //         {/* Table Card */}
// //         <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
// //           <CardContent>
// //             {loading ? (
// //               <div className="flex justify-center py-8">
// //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
// //               </div>
// //             ) : (
// //               <Table>
// //                 <TableHeader>
// //                   <TableRow className="bg-gray-50">
// //                     <TableHead>Order ID</TableHead>
// //                     <TableHead>Date</TableHead>
// //                     <TableHead>Customer</TableHead>
// //                     <TableHead>Items</TableHead>
// //                     <TableHead>Total</TableHead>
// //                     <TableHead>Status</TableHead>
// //                     <TableHead>Actions</TableHead>
// //                   </TableRow>
// //                 </TableHeader>

// //                 <TableBody>
// //                   {orders.map((order, i) => (
// //                     <TableRow
// //                       key={order._id}
// //                       className="hover:bg-gray-100 transition-all duration-200 animate-slideUp opacity-0"
// //                     >
// //                       <TableCell className="font-medium">
// //                         <div style={{ animationDelay: `${i * 80}ms` }}>{order.orderId}</div>
// //                       </TableCell>
// //                       <TableCell>{formatDate(order.orderDate)}</TableCell>

// //                       <TableCell>
// //                         <div>
// //                           <p>{order.customer?.shopName}</p>
// //                           <p className="text-sm text-gray-500">
// //                             {order.customer?.firstName} {order.customer?.lastName}
// //                           </p>
// //                         </div>
// //                       </TableCell>

// //                       <TableCell>{order.items?.length || 0} items</TableCell>

// //                       <TableCell>{formatCurrency(order.totalAmount)}</TableCell>

// //                       <TableCell>{getStatusBadge(order.status)}</TableCell>

// //                       <TableCell>
// //                         <div className="flex space-x-2">
// //                           <button
// //                             onClick={() => viewOrder(order)}
// //                             className="text-gray-600 hover:text-gray-900 transition"
// //                           >
// //                             <Eye className="h-4 w-4" />
// //                           </button>

// //                           {canEdit && (
// //                             <button
// //                               onClick={() => handleDelete(order._id)}
// //                               className="text-red-600 hover:text-red-800 transition"
// //                             >
// //                               <Trash2 className="h-4 w-4" />
// //                             </button>
// //                           )}
// //                         </div>
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}

// //                   {orders.length === 0 && (
// //                     <TableRow>
// //                       <TableCell colSpan={7} className="text-center text-gray-500 py-6">
// //                         No orders found
// //                       </TableCell>
// //                     </TableRow>
// //                   )}
// //                 </TableBody>

// //               </Table>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* CREATE ORDER MODAL */}
// //         <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order" size="xl">
// //           <form onSubmit={onSubmit} className="space-y-4 animate-scaleIn">
// //             <div className="grid grid-cols-2 gap-4">
// //               <Select
// //                 label="Customer"
// //                 value={formData.customer}
// //                 onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
// //                 options={customers.map(c => ({
// //                   value: c._id,
// //                   label: `${c.shopName} - ${c.firstName} ${c.lastName}`,
// //                 }))}
// //               />

// //               <Input
// //                 label="Order Date"
// //                 type="date"
// //                 value={formData.orderDate}
// //                 onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
// //               />
// //             </div>

// //             {/* Items */}
// //             <div className="space-y-3">
// //               <div className="flex justify-between items-center">
// //                 <h4 className="font-medium">Order Items</h4>
// //                 <Button type="button" variant="secondary" size="sm" onClick={addItem}>
// //                   Add Item
// //                 </Button>
// //               </div>

// //               {formData.items.map((item, index) => (
// //                 <div
// //                   key={index}
// //                   className="grid grid-cols-4 gap-3 items-end p-3 bg-gray-50 rounded-lg animate-slideUp"
// //                   style={{ animationDelay: `${index * 100}ms` }}
// //                 >
// //                   <Select
// //                     label={index === 0 ? "Product" : undefined}
// //                     value={item.product}
// //                     onChange={(e) => updateItem(index, 'product', e.target.value)}
// //                     options={products.map(p => ({
// //                       value: p._id,
// //                       label: `${p.brandName} - ${p.productName}`,
// //                     }))}
// //                   />

// //                   <Input
// //                     label={index === 0 ? "Quantity" : undefined}
// //                     type="number"
// //                     value={item.quantity}
// //                     onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
// //                   />

// //                   <Input
// //                     label={index === 0 ? "MRP" : undefined}
// //                     type="number"
// //                     step="0.01"
// //                     value={item.mrp}
// //                     onChange={(e) => updateItem(index, 'mrp', Number(e.target.value))}
// //                   />

// //                   {formData.items.length > 1 && (
// //                     <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)}>
// //                       Remove
// //                     </Button>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Buttons */}
// //             <div className="flex justify-end space-x-3">
// //               <Button type="button" variant="secondary" onClick={closeModal}>
// //                 Cancel
// //               </Button>

// //               <Button type="submit" isLoading={isSubmitting}>
// //                 Create Order
// //               </Button>
// //             </div>
// //           </form>
// //         </Modal>

// //         {/* VIEW ORDER MODAL */}
// //         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details" size="lg">
// //           {selectedOrder && (
// //             <div className="space-y-4 animate-fadeIn">
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <p className="text-sm text-gray-500">Order ID</p>
// //                   <p className="font-medium">{selectedOrder.orderId}</p>
// //                 </div>

// //                 <div>
// //                   <p className="text-sm text-gray-500">Date</p>
// //                   <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
// //                 </div>

// //                 <div>
// //                   <p className="text-sm text-gray-500">Customer</p>
// //                   <p className="font-medium">{selectedOrder.customer?.shopName}</p>
// //                 </div>

// //                 <div>
// //                   <p className="text-sm text-gray-500">Status</p>
// //                   {getStatusBadge(selectedOrder.status)}
// //                 </div>
// //               </div>

// //               <div>
// //                 <h4 className="font-medium mb-2">Items</h4>

// //                 <Table>
// //                   <TableHeader>
// //                     <TableRow className="bg-gray-50">
// //                       <TableHead>Product</TableHead>
// //                       <TableHead>Quantity</TableHead>
// //                       <TableHead>Price</TableHead>
// //                       <TableHead>Total</TableHead>
// //                     </TableRow>
// //                   </TableHeader>

// //                   <TableBody>
// //                     {selectedOrder.items?.map((item, index) => (
// //                       <TableRow key={index} className="animate-slideUp">
// //                         <TableCell>
// //                           {item.product?.brandName} - {item.product?.productName}
// //                         </TableCell>
// //                         <TableCell>{item.quantity}</TableCell>
// //                         <TableCell>{formatCurrency(item.mrp)}</TableCell>
// //                         <TableCell>{formatCurrency(item.quantity * item.mrp)}</TableCell>
// //                       </TableRow>
// //                     ))}
// //                   </TableBody>
// //                 </Table>
// //               </div>

// //               <div className="text-right">
// //                 <p className="text-lg font-bold">
// //                   Total: {formatCurrency(selectedOrder.totalAmount)}
// //                 </p>
// //               </div>
// //             </div>
// //           )}
// //         </Modal>

// //       </div>
// //     </DashboardLayout>
// //   );
// // }

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Modal } from '@/components/ui/Modal';
// import { Badge } from '@/components/ui/Badge';
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

// import { ordersAPI, customersAPI, stockAPI } from '@/lib/api';
// import { Order, Customer, Stock } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Trash2, Eye } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [stocks, setStocks] = useState<Stock[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);

//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState<any>({
//     customer: '',
//     orderDate: new Date().toISOString().split('T')[0],
//     items: [
//       { product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }
//     ],
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [ordersRes, customersRes, stockRes] = await Promise.all([
//         ordersAPI.getAll(),
//         customersAPI.getAll(),
//         stockAPI.getAll(),
//       ]);

//       setOrders(ordersRes.data);
//       setCustomers(customersRes.data);
//       setStocks(stockRes.data);

//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       orderDate: new Date().toISOString().split('T')[0],
//       items: [
//         { product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }
//       ],
//     });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const viewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsViewModalOpen(true);
//   };

//   const addItem = () => {
//     setFormData({
//       ...formData,
//       items: [
//         ...formData.items,
//         { product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }
//       ],
//     });
//   };

//   const removeItem = (index: number) => {
//     setFormData({
//       ...formData,
//       items: formData.items.filter((_, i) => i !== index),
//     });
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     const updated = [...formData.items];
//     updated[index][field] = value;
//     setFormData({ ...formData, items: updated });
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setIsSubmitting(true);
//       await ordersAPI.create(formData);
//       await loadData();
//       closeModal();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error creating order');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure?')) return;
//     try {
//       await ordersAPI.delete(id);
//       await loadData();
//     } catch (error: any) {
//       alert(error.response?.data?.message);
//     }
//   };

//   // STOCK DROPDOWN OPTIONS
//   const stockOptions = stocks.map((s) => ({
//     value: s._id,
//     label: `${s.product.brandName} - ${s.product.productName} | MRP ₹${s.mrp} | Stock ${s.quantity}`,
//     product: s.product._id,
//     mrp: s.mrp,
//     stockQty: s.quantity,
//   }));

//   const getStatusBadge = (status: string) => {
//     const variants: any = {
//       Pending: 'warning',
//       Confirmed: 'info',
//       Billed: 'success',
//       Cancelled: 'danger',
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };

//   const canEdit = hasRole(['Admin', 'Sales Man']);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">

//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Orders</h1>

//           {canEdit && (
//             <Button onClick={openModal}>
//               <Plus className="h-4 w-4 mr-2" />
//               Create Order
//             </Button>
//           )}
//         </div>

//         {/* TABLE */}
//         <Card>
//           <CardContent>
//             {loading ? (
//               <div className="py-10 text-center">Loading...</div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Order ID</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Items</TableHead>
//                     <TableHead>Total</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {orders.map((o) => (
//                     <TableRow key={o._id}>
//                       <TableCell>{o.orderId}</TableCell>
//                       <TableCell>{formatDate(o.orderDate)}</TableCell>
//                       <TableCell>{o.customer?.shopName}</TableCell>
//                       <TableCell>{o.items.length}</TableCell>
//                       <TableCell>{formatCurrency(o.totalAmount)}</TableCell>
//                       <TableCell>{getStatusBadge(o.status)}</TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <Eye
//                             onClick={() => viewOrder(o)}
//                             className="h-4 w-4 cursor-pointer text-gray-700"
//                           />
//                           <Trash2
//                             className="h-4 w-4 text-red-500 cursor-pointer"
//                             onClick={() => handleDelete(o._id)}
//                           />
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>

//               </Table>
//             )}
//           </CardContent>
//         </Card>

//         {/* CREATE ORDER MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
//           <form onSubmit={onSubmit} className="space-y-4">

//             {/* Customer */}
//             <Select
//               label="Customer"
//               value={formData.customer}
//               onChange={(e) =>
//                 setFormData({ ...formData, customer: e.target.value })
//               }
//               options={customers.map((c) => ({
//                 value: c._id,
//                 label: `${c.shopName} - ${c.firstName} ${c.lastName}`,
//               }))}
//             />

//             {/* STOCK ITEMS */}
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <h3 className="font-semibold">Items</h3>
//                 <Button type="button" onClick={addItem} size="sm">
//                   Add Item
//                 </Button>
//               </div>

//               {formData.items.map((item: any, index: number) => (
//                 <div key={index} className="grid grid-cols-4 gap-3 items-end">

//                   {/* STOCK DROPDOWN */}
//                   <Select
//                     label="Stock (Product + MRP + Quantity)"
//                     value={item.stock}
//                     onChange={(e) => {
//                       const selected = stockOptions.find((s) => s.value === e.target.value);
//                       if (!selected) return;

//                       updateItem(index, 'stock', selected.value);
//                       updateItem(index, 'product', selected.product);
//                       updateItem(index, 'mrp', selected.mrp);
//                       updateItem(index, 'maxQty', selected.stockQty);
//                       updateItem(index, 'quantity', 1);
//                     }}
//                     options={stockOptions}
//                   />

//                   {/* QUANTITY */}
//                   <Input
//                     label="Qty"
//                     type="number"
//                     value={item.quantity}
//                     min={1}
//                     max={item.maxQty}
//                     onChange={(e) => {
//                       let q = Number(e.target.value);
//                       if (q < 1) q = 1;
//                       if (q > item.maxQty) q = item.maxQty;
//                       updateItem(index, 'quantity', q);
//                     }}
//                   />

//                   {/* MRP (AUTO) */}
//                   <Input
//                     label="MRP"
//                     value={item.mrp}
//                     readOnly
//                     className="bg-gray-100"
//                   />

//                   {/* REMOVE */}
//                   {formData.items.length > 1 && (
//                     <Button
//                       type="button"
//                       variant="danger"
//                       onClick={() => removeItem(index)}
//                     >
//                       Remove
//                     </Button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Submit */}
//             <div className="text-right">
//               <Button type="submit" isLoading={isSubmitting}>
//                 Create Order
//               </Button>
//             </div>
//           </form>
//         </Modal>

//         {/* VIEW ORDER MODAL */}
//         <Modal
//           isOpen={isViewModalOpen}
//           onClose={() => setIsViewModalOpen(false)}
//           title="Order Details"
//         >
//           {selectedOrder && (
//             <div>
//               <h3 className="font-semibold mb-2">Items</h3>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Product</TableHead>
//                     <TableHead>Qty</TableHead>
//                     <TableHead>MRP</TableHead>
//                     <TableHead>Total</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {selectedOrder.items.map((i, idx) => (
//                     <TableRow key={idx}>
//                       <TableCell>
//                         {i.product?.brandName} - {i.product?.productName}
//                       </TableCell>
//                       <TableCell>{i.quantity}</TableCell>
//                       <TableCell>{formatCurrency(i.mrp)}</TableCell>
//                       <TableCell>{formatCurrency(i.quantity * i.mrp)}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               <div className="text-right mt-4 font-bold text-lg">
//                 Total: {formatCurrency(selectedOrder.totalAmount)}
//               </div>
//             </div>
//           )}
//         </Modal>

//       </div>
//     </DashboardLayout>
//   );
// }


// 'use client';

// import React, { useEffect, useState } from 'react';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Modal } from '@/components/ui/Modal';
// import { Badge } from '@/components/ui/Badge';
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
// import { ordersAPI, customersAPI, productsAPI, stockAPI } from '@/lib/api';
// import { Order, Customer, Product } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Trash2, Eye } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';

// /**
//  * OrdersPage (fixed)
//  * - stockList stored by productId (so it doesn't break when items added/removed)
//  * - Select component used as-is (it supports native select props)
//  * - Selecting product loads stocks for that product
//  * - Selecting stock auto-fills mrp and maxQty
//  * - Validates quantity <= maxQty before submit
//  */

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   // stockList keyed by productId -> array of stock docs
//   const [stockList, setStockList] = useState<Record<string, any[]>>({});

//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     orderDate: new Date().toISOString().split('T')[0],
//     items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Load orders, customers, products
//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [ordersRes, customersRes, productsRes] = await Promise.all([
//         ordersAPI.getAll(),
//         customersAPI.getAll(),
//         productsAPI.getAll(),
//       ]);
//       setOrders(ordersRes.data);
//       setCustomers(customersRes.data);
//       setProducts(productsRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       orderDate: new Date().toISOString().split('T')[0],
//       items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     });
//     setStockList({});
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const viewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsViewModalOpen(true);
//   };

//   const addItem = () => {
//     setFormData((prev) => ({
//       ...prev,
//       items: [...prev.items, { product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     }));
//   };

//   const removeItem = (index: number) => {
//     setFormData((prev) => {
//       const items = prev.items.filter((_, i) => i !== index);
//       return { ...prev, items };
//     });
//     // no need to delete from stockList because it's keyed by productId
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     setFormData((prev) => {
//       const items = [...prev.items];
//       items[index] = { ...items[index], [field]: value };
//       return { ...prev, items };
//     });
//   };

//   // PRODUCT SELECT: load stocks for the selected product (store by productId)
//   const onProductSelect = async (index: number, productId: string) => {
//     updateItem(index, 'product', productId);
//     updateItem(index, 'stock', '');
//     updateItem(index, 'mrp', 0);
//     updateItem(index, 'quantity', 1);
//     updateItem(index, 'maxQty', 0);

//     if (!productId) {
//       // clear entry
//       setStockList((prev) => ({ ...prev, [productId]: [] }));
//       return;
//     }

//     // If we already have stock data for this product, reuse it
//     if (stockList[productId] && stockList[productId].length > 0) return;

//     try {
//       const res = await stockAPI.getByProduct(productId); // should map to /api/stock/by-product/:productId
//       setStockList((prev) => ({ ...prev, [productId]: res.data || [] }));
//     } catch (error) {
//       console.error('Error loading stock:', error);
//       setStockList((prev) => ({ ...prev, [productId]: [] }));
//     }
//   };

//   // STOCK SELECT: auto-fill MRP and maxQty
//   const onStockSelect = (index: number, stockId: string) => {
//     const item = formData.items[index];
//     if (!item || !item.product) {
//       updateItem(index, 'stock', '');
//       updateItem(index, 'mrp', 0);
//       updateItem(index, 'maxQty', 0);
//       return;
//     }

//     const stocksForProduct = stockList[item.product] || [];
//     const selectedStock = stocksForProduct.find((s) => String(s._id) === String(stockId));
//     if (!selectedStock) {
//       updateItem(index, 'stock', '');
//       updateItem(index, 'mrp', 0);
//       updateItem(index, 'maxQty', 0);
//       return;
//     }

//     updateItem(index, 'stock', stockId);
//     updateItem(index, 'mrp', selectedStock.mrp);
//     updateItem(index, 'maxQty', selectedStock.quantity);
//     updateItem(index, 'quantity', 1);
//   };

//   // Calculate order total (client-side display only)
//   const calcTotal = () => {
//     return formData.items.reduce((sum, it) => sum + (it.quantity * (it.mrp || 0)), 0);
//   };

//   // SUBMIT: validate and send
//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // validations
//     if (!formData.customer) {
//       alert('Please select a customer.');
//       return;
//     }

//     for (let i = 0; i < formData.items.length; i++) {
//       const it = formData.items[i];
//       if (!it.product) {
//         alert(`Please select product for item ${i + 1}`);
//         return;
//       }
//       if (!it.stock) {
//         alert(`Please select stock batch for item ${i + 1}`);
//         return;
//       }
//       if (it.quantity < 1) {
//         alert(`Quantity must be at least 1 for item ${i + 1}`);
//         return;
//       }
//       if (it.maxQty && it.quantity > it.maxQty) {
//         alert(`Quantity for item ${i + 1} exceeds available stock (${it.maxQty})`);
//         return;
//       }
//     }

//     try {
//       setIsSubmitting(true);

//       // prepare payload for backend: items => product, stock, quantity, mrp
//       const payload = {
//         customer: formData.customer,
//         orderDate: formData.orderDate,
//         items: formData.items.map((it) => ({
//           product: it.product,
//           stock: it.stock,
//           quantity: it.quantity,
//           mrp: it.mrp,
//         })),
//       };

//       await ordersAPI.create(payload);
//       await loadData();
//       closeModal();
//     } catch (error: any) {
//       console.error('Create order error:', error);
//       alert(error?.response?.data?.message || 'Error creating order');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this order?')) return;
//     try {
//       await ordersAPI.delete(id);
//       await loadData();
//     } catch (error: any) {
//       console.error('Delete error:', error);
//       alert(error?.response?.data?.message || 'Error deleting order');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
//       Pending: 'warning',
//       Confirmed: 'info',
//       Billed: 'success',
//       Cancelled: 'danger',
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };

//   const canEdit = hasRole(['Admin', 'Sales Man']);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//           {canEdit && (
//             <Button onClick={openModal} className="flex items-center">
//               <Plus className="h-4 w-4 mr-2" />
//               Create Order
//             </Button>
//           )}
//         </div>

//         <Card>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Order ID</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Customer</TableHead>
//                       <TableHead>Items</TableHead>
//                       <TableHead>Total</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>

//                   <TableBody>
//                     {orders.map((order) => (
//                       <TableRow key={order._id}>
//                         <TableCell>{order.orderId}</TableCell>
//                         <TableCell>{formatDate(order.orderDate)}</TableCell>
//                         <TableCell>{order.customer?.shopName}</TableCell>
//                         <TableCell>{order.items?.length || 0} items</TableCell>
//                         <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
//                         <TableCell>{getStatusBadge(order.status)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button variant="ghost" size="sm" onClick={() => viewOrder(order)}>
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             {canEdit && (
//                               <Button variant="ghost" size="sm" onClick={() => handleDelete(order._id)}>
//                                 <Trash2 className="h-4 w-4 text-red-600" />
//                               </Button>
//                             )}
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}

//                     {orders.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={7} className="text-center text-gray-500 py-6">
//                           No orders found
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* CREATE ORDER MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order" size="xl">
//           <form onSubmit={onSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
//                 <Select
//                   value={formData.customer}
//                   onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
//                   options={customers.map((c) => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
//                 <Input
//                   type="date"
//                   value={formData.orderDate}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, orderDate: e.target.value })}
//                 />
//               </div>
//             </div>

//             {/* Items */}
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-medium">Order Items</h4>
//                 <Button type="button" variant="secondary" size="sm" onClick={addItem}>
//                   Add Item
//                 </Button>
//               </div>

//               {formData.items.map((item, index) => (
//                 <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-gray-50 rounded-lg">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
//                     <Select
//                       value={item.product}
//                       onChange={(e) => onProductSelect(index, e.target.value)}
//                       options={[{ value: '', label: 'Select product' }, ...products.map((p) => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))]}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
//                     <Select
//                       value={item.stock}
//                       disabled={!item.product}
//                       onChange={(e) => onStockSelect(index, e.target.value)}
//                       options={[(stockList[item.product] && stockList[item.product].length > 0) ? { value: '', label: 'Select stock' } : { value: '', label: 'No stock' }, ...(stockList[item.product] || []).map((s) => ({ value: s._id, label: `Batch: ${s.batchNumber || 'N/A'} | Qty: ${s.quantity} | MRP: ₹${s.mrp}` }))]}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
//                     <Input
//                       type="number"
//                       min={1}
//                       max={item.maxQty || 1}
//                       value={item.quantity}
//                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                         let val = Number(e.target.value || 0);
//                         if (item.maxQty && val > item.maxQty) val = item.maxQty;
//                         if (val < 1) val = 1;
//                         updateItem(index, 'quantity', val);
//                       }}
//                     />

//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
//                     <Input value={item.mrp ? String(item.mrp) : ''} disabled />
//                   </div>
//                       <p className="text-xs text-gray-500 mt-1">Available: {item.maxQty || 0}</p>
//                   <div className="flex items-end">
//                     {formData.items.length > 1 && (
//                       <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)}>
//                         Remove
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Instant total */}
//               <div className="text-right">
//                 <p className="text-lg font-semibold">Sub-total: {formatCurrency(calcTotal())}</p>
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3">
//               <Button type="button" variant="secondary" onClick={closeModal}>
//                 Cancel
//               </Button>
//               <Button type="submit" isLoading={isSubmitting}>
//                 Create Order
//               </Button>
//             </div>
//           </form>
//         </Modal>

//         {/* VIEW ORDER MODAL */}
//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details" size="lg">
//           {selectedOrder && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Order ID</p>
//                   <p className="font-medium">{selectedOrder.orderId}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">Date</p>
//                   <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">Customer</p>
//                   <p className="font-medium">{selectedOrder.customer?.shopName}</p>
//                 </div>

//                 <div>
//                   <p className="text-sm text-gray-500">Status</p>
//                   {getStatusBadge(selectedOrder.status)}
//                 </div>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Product</TableHead>
//                     <TableHead>Stock</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>MRP</TableHead>
//                     <TableHead>Total</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {selectedOrder.items?.map((it, idx) => (
//                     <TableRow key={idx}>
//                       <TableCell>{it.product?.brandName} - {it.product?.productName}</TableCell>
//                       <TableCell>{it.stock?.batchNumber || 'N/A'}</TableCell>
//                       <TableCell>{it.quantity}</TableCell>
//                       <TableCell>{formatCurrency(it.mrp)}</TableCell>
//                       <TableCell>{formatCurrency(it.mrp * it.quantity)}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               <div className="text-right">
//                 <p className="text-lg font-bold">Total: {formatCurrency(selectedOrder.totalAmount)}</p>
//               </div>
//             </div>
//           )}
//         </Modal>
//       </div>
//     </DashboardLayout>
//   );
// }


// 'use client';

// import React, { useEffect, useState } from 'react';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Modal } from '@/components/ui/Modal';
// import { Badge } from '@/components/ui/Badge';
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
// import { ordersAPI, customersAPI, productsAPI, stockAPI } from '@/lib/api';
// import { Order, Customer, Product } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Trash2, Eye } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [stockList, setStockList] = useState<Record<string, any[]>>({});

//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     orderDate: new Date().toISOString().split('T')[0],
//     items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//   });

//   const [formErrors, setFormErrors] = useState<string | null>(null);
//   const [formSuccess, setFormSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [ordersRes, customersRes, productsRes] = await Promise.all([
//         ordersAPI.getAll(),
//         customersAPI.getAll(),
//         productsAPI.getAll(),
//       ]);
//       setOrders(ordersRes.data);
//       setCustomers(customersRes.data);
//       setProducts(productsRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       orderDate: new Date().toISOString().split('T')[0],
//       items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     });
//     setStockList({});
//     setFormErrors(null);
//     setFormSuccess(null);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const viewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsViewModalOpen(true);
//   };

//   const addItem = () => {
//     setFormData((prev) => ({
//       ...prev,
//       items: [...prev.items, { product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     }));
//   };

//   const removeItem = (index: number) => {
//     setFormData((prev) => {
//       const items = prev.items.filter((_, i) => i !== index);
//       return { ...prev, items };
//     });
//     setFormErrors(null);
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     setFormData((prev) => {
//       const items = [...prev.items];
//       items[index] = { ...items[index], [field]: value };
//       return { ...prev, items };
//     });
//     setFormErrors(null);
//   };

//   const onProductSelect = async (index: number, productId: string) => {
//     updateItem(index, 'product', productId);
//     updateItem(index, 'stock', '');
//     updateItem(index, 'mrp', 0);
//     updateItem(index, 'quantity', 1);
//     updateItem(index, 'maxQty', 0);

//     if (!productId) {
//       setStockList((prev) => ({ ...prev, [productId]: [] }));
//       return;
//     }

//     if (stockList[productId] && stockList[productId].length > 0) return;

//     try {
//       const res = await stockAPI.getByProduct(productId);
//       setStockList((prev) => ({ ...prev, [productId]: res.data || [] }));
//     } catch (error) {
//       console.error('Error loading stock:', error);
//       setStockList((prev) => ({ ...prev, [productId]: [] }));
//     }
//   };

//   const onStockSelect = (index: number, stockId: string) => {
//     const item = formData.items[index];
//     if (!item || !item.product) return;

//     const stocksForProduct = stockList[item.product] || [];
//     const selectedStock = stocksForProduct.find((s) => String(s._id) === String(stockId));
//     if (!selectedStock) return;

//     updateItem(index, 'stock', stockId);
//     updateItem(index, 'mrp', selectedStock.mrp);
//     updateItem(index, 'maxQty', selectedStock.quantity);
//     updateItem(index, 'quantity', 1);
//   };

//   const calcTotal = () => {
//     return formData.items.reduce((sum, it) => sum + (it.quantity * (it.mrp || 0)), 0);
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormErrors(null);
//     setFormSuccess(null);

//     if (!formData.customer) {
//       setFormErrors("Please select a customer.");
//       return;
//     }

//     for (let i = 0; i < formData.items.length; i++) {
//       const it = formData.items[i];
//       if (!it.product) {
//         setFormErrors(`Please select product for item ${i + 1}.`);
//         return;
//       }
//       if (!it.stock) {
//         setFormErrors(`Please select stock batch for item ${i + 1}.`);
//         return;
//       }
//       if (it.quantity < 1) {
//         setFormErrors(`Quantity must be at least 1 for item ${i + 1}.`);
//         return;
//       }
//       if (it.maxQty && it.quantity > it.maxQty) {
//         setFormErrors(`Quantity for item ${i + 1} exceeds available stock (${it.maxQty}).`);
//         return;
//       }
//     }

//     try {
//       setIsSubmitting(true);

//       const payload = {
//         customer: formData.customer,
//         orderDate: formData.orderDate,
//         items: formData.items.map((it) => ({
//           product: it.product,
//           stock: it.stock,
//           quantity: it.quantity,
//           mrp: it.mrp,
//         })),
//       };

//       await ordersAPI.create(payload);
//       await loadData();
//       closeModal();
//       setFormSuccess("Order created successfully!");
//     } catch (error: any) {
//       console.error('Create order error:', error);
//       setFormErrors(error?.response?.data?.message || "Error creating order.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this order?')) return;
//     try {
//       await ordersAPI.delete(id);
//       await loadData();
//     } catch (error: any) {
//       console.error('Delete error:', error);
//       setFormErrors(error?.response?.data?.message || "Error deleting order.");
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
//       Pending: 'warning',
//       Confirmed: 'info',
//       Billed: 'success',
//       Cancelled: 'danger',
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };

//   const canEdit = hasRole(['Admin', 'Sales Man']);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//           {canEdit && (
//             <Button onClick={openModal} className="flex items-center">
//               <Plus className="h-4 w-4 mr-2" />
//               Create Order
//             </Button>
//           )}
//         </div>

//         <Card>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Order ID</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Customer</TableHead>
//                       <TableHead>Items</TableHead>
//                       <TableHead>Total</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {orders.map((order) => (
//                       <TableRow key={order._id}>
//                         <TableCell>{order.orderId}</TableCell>
//                         <TableCell>{formatDate(order.orderDate)}</TableCell>
//                         <TableCell>{order.customer?.shopName}</TableCell>
//                         <TableCell>{order.items?.length || 0} items</TableCell>
//                         <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
//                         <TableCell>{getStatusBadge(order.status)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button variant="ghost" size="sm" onClick={() => viewOrder(order)}>
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             {canEdit && (
//                               <Button variant="ghost" size="sm" onClick={() => handleDelete(order._id)}>
//                                 <Trash2 className="h-4 w-4 text-red-600" />
//                               </Button>
//                             )}
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {orders.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={7} className="text-center text-gray-500 py-6">
//                           No orders found
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* CREATE ORDER MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order" size="xl">
//           <form onSubmit={onSubmit} className="space-y-4">
//             {/* Customer & Date */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
//                 <Select
//                   value={formData.customer}
//                   onChange={(e) => {
//                     setFormData({ ...formData, customer: e.target.value });
//                     if (e.target.value) setFormErrors(null);
//                   }}
//                   options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
//                 <Input
//                   type="date"
//                   value={formData.orderDate}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, orderDate: e.target.value })}
//                 />
//               </div>
//             </div>

//             {/* Items */}
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-medium">Order Items</h4>
//                 <Button type="button" variant="secondary" size="sm" onClick={addItem}>Add Item</Button>
//               </div>
//               {formData.items.map((item, index) => (
//                 <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-gray-50 rounded-lg">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
//                     <Select
//                       value={item.product}
//                       onChange={(e) => onProductSelect(index, e.target.value)}
//                       options={[{ value: '', label: 'Select product' }, ...products.map(p => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))]}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
//                     <Select
//                       value={item.stock}
//                       disabled={!item.product}
//                       onChange={(e) => onStockSelect(index, e.target.value)}
//                       options={[(stockList[item.product]?.length > 0) ? { value: '', label: 'Select stock' } : { value: '', label: 'No stock' }, ...(stockList[item.product] || []).map(s => ({ value: s._id, label: `Batch: ${s.batchNumber || 'N/A'} | Qty: ${s.quantity} | MRP: ₹${s.mrp}` }))]}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
//                     <Input
//                       type="number"
//                       min={1}
//                       max={item.maxQty || 1}
//                       value={item.quantity}
//                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                         let val = Number(e.target.value || 0);
//                         if (item.maxQty && val > item.maxQty) val = item.maxQty;
//                         if (val < 1) val = 1;
//                         updateItem(index, 'quantity', val);
//                       }}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
//                     <Input value={item.mrp ? String(item.mrp) : ''} disabled />
//                     <p className="text-xs text-gray-500 mt-1">Available: {item.maxQty || 0}</p>
//                   </div>
//                   <div className="flex items-end">
//                     {formData.items.length > 1 && (
//                       <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)}>Remove</Button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <div className="text-right">
//                 <p className="text-lg font-semibold">Sub-total: {formatCurrency(calcTotal())}</p>
//               </div>
//             </div>

//             {/* Inline validation messages */}
//             {formErrors && <p className="text-red-600 font-medium">{formErrors}</p>}
//             {formSuccess && <p className="text-green-600 font-medium">{formSuccess}</p>}

//             <div className="flex justify-end space-x-3">
//               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
//               <Button type="submit" isLoading={isSubmitting}>Create Order</Button>
//             </div>
//           </form>
//         </Modal>

//         {/* VIEW ORDER MODAL */}
//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details" size="lg">
//           {selectedOrder && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Order ID</p>
//                   <p className="font-medium">{selectedOrder.orderId}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Date</p>
//                   <p className="font-medium">{formatDate(selectedOrder.orderDate)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Customer</p>
//                   <p className="font-medium">{selectedOrder.customer?.shopName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Status</p>
//                   {getStatusBadge(selectedOrder.status)}
//                 </div>
//               </div>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Product</TableHead>
//                     <TableHead>Stock</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>MRP</TableHead>
//                     <TableHead>Total</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {selectedOrder.items?.map((it, idx) => (
//                     <TableRow key={idx}>
//                       <TableCell>{it.product?.brandName} - {it.product?.productName}</TableCell>
//                       <TableCell>{it.stock?.batchNumber || 'N/A'}</TableCell>
//                       <TableCell>{it.quantity}</TableCell>
//                       <TableCell>{formatCurrency(it.mrp)}</TableCell>
//                       <TableCell>{formatCurrency(it.mrp * it.quantity)}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//               <div className="text-right">
//                 <p className="text-lg font-bold">Total: {formatCurrency(selectedOrder.totalAmount)}</p>
//               </div>
//             </div>
//           )}
//         </Modal>
//       </div>
//     </DashboardLayout>
//   );
// }
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Modal } from '@/components/ui/Modal';
// import { Badge } from '@/components/ui/Badge';
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
// import { ordersAPI, billsAPI, customersAPI, productsAPI, stockAPI } from '@/lib/api';
// import { Order, Customer, Product, Stock, Bill } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Trash2, Eye } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [stockList, setStockList] = useState<Record<string, Stock[]>>({});
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [creditCheck, setCreditCheck] = useState<any>(null);
//   const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     orderDate: new Date().toISOString().split('T')[0],
//     items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//   });

//   const [formErrors, setFormErrors] = useState<string | null>(null);
//   const [formSuccess, setFormSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [ordersRes, customersRes, productsRes] = await Promise.all([
//         ordersAPI.getAll(),
//         customersAPI.getAll(),
//         productsAPI.getAll(),
//       ]);
//       setOrders(ordersRes.data);
//       setCustomers(customersRes.data);
//       setProducts(productsRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkCustomerCredit = async (customerId: string) => {
//     if (!customerId) {
//       setCreditCheck(null);
//       return;
//     }
//     try {
//       const res = await billsAPI.checkCredit(customerId);
//       setCreditCheck(res.data);
//     } catch (error) {
//       console.error('Error checking credit:', error);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       orderDate: new Date().toISOString().split('T')[0],
//       items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     });
//     setStockList({});
//     setFormErrors(null);
//     setFormSuccess(null);
//     setCreditCheck(null);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const viewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsViewModalOpen(true);
//   };

//   const addItem = () => {
//     setFormData((prev) => ({
//       ...prev,
//       items: [...prev.items, { product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     }));
//   };

//   const removeItem = (index: number) => {
//     setFormData((prev) => {
//       const items = prev.items.filter((_, i) => i !== index);
//       return { ...prev, items };
//     });
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     setFormData((prev) => {
//       const items = [...prev.items];
//       items[index] = { ...items[index], [field]: value };
//       return { ...prev, items };
//     });
//   };

//   const onProductSelect = async (index: number, productId: string) => {
//     updateItem(index, 'product', productId);
//     updateItem(index, 'stock', '');
//     updateItem(index, 'mrp', 0);
//     updateItem(index, 'quantity', 1);
//     updateItem(index, 'maxQty', 0);

//     if (!productId) {
//       setStockList((prev) => ({ ...prev, [productId]: [] }));
//       return;
//     }

//     if (stockList[productId] && stockList[productId].length > 0) return;

//     try {
//       const res = await stockAPI.getByProduct(productId);
//       setStockList((prev) => ({ ...prev, [productId]: res.data || [] }));
//     } catch (error) {
//       console.error('Error loading stock:', error);
//       setStockList((prev) => ({ ...prev, [productId]: [] }));
//     }
//   };

//   const onStockSelect = (index: number, stockId: string) => {
//     const item = formData.items[index];
//     if (!item || !item.product) return;
//     const selectedStock = (stockList[item.product] || []).find(s => s._id === stockId);
//     if (!selectedStock) return;

//     updateItem(index, 'stock', stockId);
//     updateItem(index, 'mrp', selectedStock.mrp);
//     updateItem(index, 'maxQty', selectedStock.quantity);
//     updateItem(index, 'quantity', 1);
//   };

//   const calcTotal = () => formData.items.reduce((sum, it) => sum + (it.quantity * (it.mrp || 0)), 0);

//   const handleCustomerChange = async (customerId: string) => {
//     setFormData({ ...formData, customer: customerId });
//     await checkCustomerCredit(customerId);
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormErrors(null);
//     setFormSuccess(null);

//     if (!formData.customer) {
//       setFormErrors('Please select a customer.');
//       return;
//     }

//     if (creditCheck && !creditCheck.canCreateBill) {
//       setFormErrors('Customer is not eligible to create order.');
//       return;
//     }

//     for (let i = 0; i < formData.items.length; i++) {
//       const it = formData.items[i];
//       if (!it.product) {
//         setFormErrors(`Please select product for item ${i + 1}.`);
//         return;
//       }
//       if (!it.stock) {
//         setFormErrors(`Please select stock batch for item ${i + 1}.`);
//         return;
//       }
//       if (it.quantity < 1) {
//         setFormErrors(`Quantity must be at least 1 for item ${i + 1}.`);
//         return;
//       }
//       if (it.maxQty && it.quantity > it.maxQty) {
//         setFormErrors(`Quantity for item ${i + 1} exceeds available stock (${it.maxQty}).`);
//         return;
//       }
//     }

//     try {
//       setIsSubmitting(true);

//       // Create order payload
//       const orderPayload = {
//         customer: formData.customer,
//         orderDate: formData.orderDate,
//         items: formData.items.map(it => ({
//           product: it.product,
//           stock: it.stock,
//           quantity: it.quantity,
//           mrp: it.mrp,
//         })),
//       };

//       const orderRes = await ordersAPI.create(orderPayload);

//       // Create bill automatically after order if eligible
//       if (creditCheck?.canCreateBill) {
//         const billPayload: Partial<Bill> = {
//           customer: formData.customer,
//           billDate: formData.orderDate,
//           items: formData.items.map(it => ({
//             product: it.product,
//             hsnNumber: products.find(p => p._id === it.product)?.hsnNumber || '',
//             productDetails: `${products.find(p => p._id === it.product)?.brandName} - ${products.find(p => p._id === it.product)?.productName}`,
//             quantity: it.quantity,
//             mrp: it.mrp,
//             amount: it.quantity * it.mrp,
//           })),
//           totalAmount: calcTotal(),
//           paidAmount: 0,
//           dueAmount: calcTotal(),
//         };
//         await billsAPI.create(billPayload);
//       }

//       await loadData();
//       setFormSuccess('Order created successfully!');
//       setIsModalOpen(false);
//     } catch (error: any) {
//       console.error('Error creating order:', error);
//       setFormErrors(error?.response?.data?.message || 'Error creating order.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id?: string) => {
//     try {
//       if (id) {
//         await ordersAPI.delete(id);
//       } else if (selectedOrders.length > 0) {
//         await Promise.all(selectedOrders.map(oid => ordersAPI.delete(oid)));
//         setSelectedOrders([]);
//       }
//       setDeleteModalOpen(false);
//       await loadData();
//     } catch (error: any) {
//       console.error('Error deleting:', error);
//     }
//   };

//   const toggleSelectOrder = (id: string) => {
//     setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const toggleSelectAll = () => {
//     if (selectedOrders.length === orders.length) {
//       setSelectedOrders([]);
//     } else {
//       setSelectedOrders(orders.map(o => o._id));
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
//       Pending: 'warning',
//       Confirmed: 'info',
//       Billed: 'success',
//       Cancelled: 'danger',
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };

//   const canEdit = hasRole(['Admin', 'Sales Man']);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//           <div className="flex space-x-2">
//             {canEdit && (
//               <Button onClick={openModal} className="flex items-center"> <Plus className="h-4 w-4 mr-2" /> Create Order </Button>
//             )}
//             {selectedOrders.length > 0 && (
//               <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>Delete Selected</Button>
//             )}
//           </div>
//         </div>

//         <Card>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>
//                         <input type="checkbox" checked={selectedOrders.length === orders.length} onChange={toggleSelectAll} />
//                       </TableHead>
//                       <TableHead>Order ID</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Customer</TableHead>
//                       <TableHead>Items</TableHead>
//                       <TableHead>Total</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {orders.map(order => (
//                       <TableRow key={order._id}>
//                         <TableCell>
//                           <input type="checkbox" checked={selectedOrders.includes(order._id)} onChange={() => toggleSelectOrder(order._id)} />
//                         </TableCell>
//                         <TableCell>{order.orderId}</TableCell>
//                         <TableCell>{formatDate(order.orderDate)}</TableCell>
//                         <TableCell>{order.customer?.shopName}</TableCell>
//                         <TableCell>{order.items?.length || 0} items</TableCell>
//                         <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
//                         <TableCell>{getStatusBadge(order.status)}</TableCell>
//                         <TableCell className="flex space-x-2">
//                           <Button variant="ghost" size="sm" onClick={() => viewOrder(order)}><Eye className="h-4 w-4" /></Button>
//                           <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(true)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {orders.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={8} className="text-center text-gray-500 py-6">No orders found</TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* CREATE ORDER MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order" size="xl">
//           <form onSubmit={onSubmit} className="space-y-4">
//             {/* Customer & Date */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
//                 <Select
//                   value={formData.customer}
//                   onChange={async e => handleCustomerChange(e.target.value)}
//                   options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
//                 <Input type="date" value={formData.orderDate} onChange={e => setFormData({ ...formData, orderDate: e.target.value })} />
//               </div>
//             </div>

//             {/* Credit check message */}
//             {creditCheck && !creditCheck.canCreateBill && (
//               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
//                 Customer is not eligible to create order.
//               </div>
//             )}

//             {/* Items */}
//             <div className="space-y-3 opacity-50" style={{ opacity: creditCheck && !creditCheck.canCreateBill ? 0.5 : 1 }}>
//               <div className="flex justify-between items-center">
//                 <h4 className="font-medium">Order Items</h4>
//                 <Button type="button" variant="secondary" size="sm" onClick={addItem} disabled={creditCheck && !creditCheck.canCreateBill}>Add Item</Button>
//               </div>
//               {formData.items.map((item, index) => (
//                 <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-gray-50 rounded-lg">
//                   <Select
//                     value={item.product}
//                     onChange={e => onProductSelect(index, e.target.value)}
//                     options={[{ value: '', label: 'Select product' }, ...products.map(p => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))]}
//                     disabled={creditCheck && !creditCheck.canCreateBill}
//                   />
//                   <Select
//                     value={item.stock}
//                     disabled={!item.product || (creditCheck && !creditCheck.canCreateBill)}
//                     onChange={e => onStockSelect(index, e.target.value)}
//                     options={[(stockList[item.product]?.length > 0) ? { value: '', label: 'Select stock' } : { value: '', label: 'No stock' }, ...(stockList[item.product] || []).map(s => ({ value: s._id, label: `Batch: ${s.batchNumber || 'N/A'} | Qty: ${s.quantity} | MRP: ₹${s.mrp}` }))]}
//                   />
//                   <Input
//                     type="number"
//                     min={1}
//                     max={item.maxQty || 1}
//                     value={item.quantity}
//                     disabled={creditCheck && !creditCheck.canCreateBill}
//                     onChange={e => {
//                       let val = Number(e.target.value || 0);
//                       if (item.maxQty && val > item.maxQty) val = item.maxQty;
//                       if (val < 1) val = 1;
//                       updateItem(index, 'quantity', val);
//                     }}
//                   />
//                   <Input value={item.mrp ? String(item.mrp) : ''} disabled />
//                   {formData.items.length > 1 && (
//                     <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)} disabled={creditCheck && !creditCheck.canCreateBill}>Remove</Button>
//                   )}
//                 </div>
//               ))}
//               <div className="text-right">
//                 <p className="text-lg font-semibold">Sub-total: {formatCurrency(calcTotal())}</p>
//               </div>
//             </div>

//             {/* Errors / success */}
//             {formErrors && <p className="text-red-600 font-medium">{formErrors}</p>}
//             {formSuccess && <p className="text-green-600 font-medium">{formSuccess}</p>}

//             <div className="flex justify-end space-x-3">
//               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
//               <Button type="submit" isLoading={isSubmitting} disabled={creditCheck && !creditCheck.canCreateBill}>Create Order</Button>
//             </div>
//           </form>
//         </Modal>

//         {/* VIEW ORDER MODAL */}
//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details" size="lg">
//           {selectedOrder && (
//             <div className="space-y-2">
//               <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
//               <p><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
//               <p><strong>Customer:</strong> {selectedOrder.customer?.shopName}</p>
//               <p><strong>Status:</strong> {selectedOrder.status}</p>
//               <div className="mt-2">
//                 <h4 className="font-medium">Items</h4>
//                 {selectedOrder.items.map((it, idx) => (
//                   <div key={idx} className="flex justify-between p-2 border-b border-gray-200">
//                     <span>{it.productDetails}</span>
//                     <span>{it.quantity} × ₹{it.mrp}</span>
//                     <span>₹{it.quantity * it.mrp}</span>
//                   </div>
//                 ))}
//               </div>
//               <p className="text-right font-semibold mt-2">Total: ₹{selectedOrder.totalAmount}</p>
//             </div>
//           )}
//         </Modal>

//         {/* DELETE MODAL */}
//         <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete">
//           <p>Are you sure you want to delete {selectedOrders.length > 0 ? 'selected orders' : 'this order'}?</p>
//           <div className="flex justify-end space-x-3 mt-4">
//             <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
//             <Button variant="danger" onClick={() => handleDelete()}>{selectedOrders.length > 0 ? 'Delete Selected' : 'Delete'}</Button>
//           </div>
//         </Modal>
//       </div>
//     </DashboardLayout>
//   );
// }

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Modal } from '@/components/ui/Modal';
// import { Badge } from '@/components/ui/Badge';
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
// import { ordersAPI, billsAPI, customersAPI, productsAPI, stockAPI } from '@/lib/api';
// import { Order, Customer, Product, Stock, Bill } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Trash2, Eye } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [stockList, setStockList] = useState<Record<string, Stock[]>>({});
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [creditCheck, setCreditCheck] = useState<any>(null);
//   const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     orderDate: new Date().toISOString().split('T')[0],
//     status: 'Pending' as 'Pending' | 'Confirmed' | 'Cancelled',
//     items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//   });

//   const [formErrors, setFormErrors] = useState<string | null>(null);
//   const [formSuccess, setFormSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [ordersRes, customersRes, productsRes] = await Promise.all([
//         ordersAPI.getAll(),
//         customersAPI.getAll(),
//         productsAPI.getAll(),
//       ]);
//       setOrders(ordersRes.data);
//       setCustomers(customersRes.data);
//       setProducts(productsRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkCustomerCredit = async (customerId: string) => {
//     if (!customerId) {
//       setCreditCheck(null);
//       return;
//     }
//     try {
//       const res = await billsAPI.checkCredit(customerId);
//       setCreditCheck(res.data);
//     } catch (error) {
//       console.error('Error checking credit:', error);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       orderDate: new Date().toISOString().split('T')[0],
//       status: 'Pending',
//       items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     });
//     setStockList({});
//     setFormErrors(null);
//     setFormSuccess(null);
//     setCreditCheck(null);
//     setSelectedOrder(null);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const openEditModal = (order: Order) => {
//     setSelectedOrder(order);
//     setFormData({
//       customer: order.customer?._id || '',
//       orderDate: order.orderDate.split('T')[0],
//       status: order.status,
//       items: order.items.map(it => ({
//         product: it.product,
//         stock: it.stock,
//         quantity: it.quantity,
//         mrp: it.mrp,
//         maxQty: it.quantity, // not editable more than existing
//       })),
//     });
//     setIsModalOpen(true);
//   };

//   const viewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsViewModalOpen(true);
//   };

//   const addItem = () => {
//     setFormData(prev => ({
//       ...prev,
//       items: [...prev.items, { product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     }));
//   };

//   const removeItem = (index: number) => {
//     setFormData(prev => {
//       const items = prev.items.filter((_, i) => i !== index);
//       return { ...prev, items };
//     });
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     setFormData(prev => {
//       const items = [...prev.items];
//       items[index] = { ...items[index], [field]: value };
//       return { ...prev, items };
//     });
//   };

//   const onProductSelect = async (index: number, productId: string) => {
//     updateItem(index, 'product', productId);
//     updateItem(index, 'stock', '');
//     updateItem(index, 'mrp', 0);
//     updateItem(index, 'quantity', 1);
//     updateItem(index, 'maxQty', 0);

//     if (!productId) {
//       setStockList(prev => ({ ...prev, [productId]: [] }));
//       return;
//     }

//     if (stockList[productId] && stockList[productId].length > 0) return;

//     try {
//       const res = await stockAPI.getByProduct(productId);
//       setStockList(prev => ({ ...prev, [productId]: res.data || [] }));
//     } catch (error) {
//       console.error('Error loading stock:', error);
//       setStockList(prev => ({ ...prev, [productId]: [] }));
//     }
//   };

//   const onStockSelect = (index: number, stockId: string) => {
//     const item = formData.items[index];
//     if (!item || !item.product) return;
//     const selectedStock = (stockList[item.product] || []).find(s => s._id === stockId);
//     if (!selectedStock) return;

//     updateItem(index, 'stock', stockId);
//     updateItem(index, 'mrp', selectedStock.mrp);
//     updateItem(index, 'maxQty', selectedStock.quantity);
//     updateItem(index, 'quantity', 1);
//   };

//   const calcTotal = () => formData.items.reduce((sum, it) => sum + (it.quantity * (it.mrp || 0)), 0);

//   const handleCustomerChange = async (customerId: string) => {
//     setFormData({ ...formData, customer: customerId });
//     await checkCustomerCredit(customerId);
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormErrors(null);
//     setFormSuccess(null);

//     if (!formData.customer) {
//       setFormErrors('Please select a customer.');
//       return;
//     }

//     if (creditCheck && !creditCheck.canCreateBill) {
//       setFormErrors('Customer is not eligible to create order.');
//       return;
//     }

//     for (let i = 0; i < formData.items.length; i++) {
//       const it = formData.items[i];
//       if (!it.product) {
//         setFormErrors(`Please select product for item ${i + 1}.`);
//         return;
//       }
//       if (!it.stock) {
//         setFormErrors(`Please select stock batch for item ${i + 1}.`);
//         return;
//       }
//       if (it.quantity < 1) {
//         setFormErrors(`Quantity must be at least 1 for item ${i + 1}.`);
//         return;
//       }
//       if (it.maxQty && it.quantity > it.maxQty) {
//         setFormErrors(`Quantity for item ${i + 1} exceeds available stock (${it.maxQty}).`);
//         return;
//       }
//     }

//     try {
//       setIsSubmitting(true);

//       const orderPayload = {
//         customer: formData.customer,
//         orderDate: formData.orderDate,
//         items: formData.items.map(it => ({
//           product: it.product,
//           stock: it.stock,
//           quantity: it.quantity,
//           mrp: it.mrp,
//         })),
//         status: formData.status,
//       };

//       let orderRes;
//       if (selectedOrder) {
//         // Update order
//         orderRes = await ordersAPI.update(selectedOrder._id, orderPayload);

//         // If status changed to Confirmed by Admin, generate bill
//         if (selectedOrder.status !== 'Confirmed' && formData.status === 'Confirmed') {
//           const billPayload: Partial<Bill> = {
//             customer: formData.customer,
//             billDate: formData.orderDate,
//             items: formData.items.map(it => ({
//               product: it.product,
//               hsnNumber: products.find(p => p._id === it.product)?.hsnNumber || '',
//               productDetails: `${products.find(p => p._id === it.product)?.brandName} - ${products.find(p => p._id === it.product)?.productName}`,
//               quantity: it.quantity,
//               mrp: it.mrp,
//               amount: it.quantity * it.mrp,
//             })),
//             totalAmount: calcTotal(),
//             paidAmount: 0,
//             dueAmount: calcTotal(),
//           };
//           await billsAPI.create(billPayload);
//         }
//       } else {
//         // Create order
//         orderRes = await ordersAPI.create(orderPayload);
//       }

//       await loadData();
//       setFormSuccess('Order saved successfully!');
//       setIsModalOpen(false);
//     } catch (error: any) {
//       console.error('Error creating/updating order:', error);
//       setFormErrors(error?.response?.data?.message || 'Error saving order.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id?: string) => {
//     try {
//       if (id) {
//         await ordersAPI.delete(id);
//       } else if (selectedOrders.length > 0) {
//         await Promise.all(selectedOrders.map(oid => ordersAPI.delete(oid)));
//         setSelectedOrders([]);
//       }
//       setDeleteModalOpen(false);
//       await loadData();
//     } catch (error: any) {
//       console.error('Error deleting:', error);
//     }
//   };

//   const toggleSelectOrder = (id: string) => {
//     setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const toggleSelectAll = () => {
//     if (selectedOrders.length === orders.length) {
//       setSelectedOrders([]);
//     } else {
//       setSelectedOrders(orders.map(o => o._id));
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
//       Pending: 'warning',
//       Confirmed: 'info',
//       Billed: 'success',
//       Cancelled: 'danger',
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };
// console.log('Error creating order:', hasRole(['Admin']) );
//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//           <div className="flex space-x-2">
//             {hasRole(['Admin', 'Manager', 'Sales Man']) && (
//               <Button onClick={openModal} className="flex items-center"> <Plus className="h-4 w-4 mr-2" /> Create Order </Button>
//             )}
//             {hasRole(['Admin']) && selectedOrders.length > 0 && (
//               <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>Delete Selected</Button>
//             )}
//           </div>
//         </div>

//         <Card>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>
//                         <input type="checkbox" checked={selectedOrders.length === orders.length} onChange={toggleSelectAll} />
//                       </TableHead>
//                       <TableHead>Order ID</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Customer</TableHead>
//                       <TableHead>Items</TableHead>
//                       <TableHead>Total</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {orders.map(order => (
//                       <TableRow key={order._id}>
//                         <TableCell>
//                           <input type="checkbox" checked={selectedOrders.includes(order._id)} onChange={() => toggleSelectOrder(order._id)} />
//                         </TableCell>
//                         <TableCell>{order.orderId}</TableCell>
//                         <TableCell>{formatDate(order.orderDate)}</TableCell>
//                         <TableCell>{order.customer?.shopName}</TableCell>
//                         <TableCell>{order.items?.length || 0} items</TableCell>
//                         <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
//                         <TableCell>{getStatusBadge(order.status)}</TableCell>
//                         <TableCell className="flex space-x-2">
//                           <Button variant="ghost" size="sm" onClick={() => viewOrder(order)}><Eye className="h-4 w-4" /></Button>

//                           {hasRole(['Admin']) && (
//                             <Button variant="ghost" size="sm" onClick={() => openEditModal(order)}>Edit</Button>
//                                                   )}

//                           {hasRole(['Admin']) && (
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => {
//                                 setDeleteModalOpen(true);
//                                 setSelectedOrders([order._id]);
//                               }}
//                             >
//                               <Trash2 className="h-4 w-4 text-red-600" />
//                             </Button>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {orders.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={8} className="text-center text-gray-500 py-6">No orders found</TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* CREATE / EDIT ORDER MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedOrder ? 'Edit Order' : 'Create Order'} size="xl">
//           <form onSubmit={onSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
//                 <Select
//                   value={formData.customer}
//                   onChange={async e => handleCustomerChange(e.target.value)}
//                   options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}
//                   disabled={!!selectedOrder} // cannot change customer on edit
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
//                 <Input type="date" value={formData.orderDate} onChange={e => setFormData({ ...formData, orderDate: e.target.value })} />
//               </div>
//             </div>

//             {selectedOrder && hasRole(['Admin']) && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <Select
//                   value={formData.status}
//                   onChange={e => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Confirmed' | 'Cancelled' })}
//                   options={[
//                     { value: 'Pending', label: 'Pending' },
//                     { value: 'Confirmed', label: 'Confirmed' },
//                     { value: 'Cancelled', label: 'Cancelled' },
//                   ]}
//                 />
//               </div>
//             )}

//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-medium">Order Items</h4>
//                 {!selectedOrder && (
//                   <Button type="button" variant="secondary" size="sm" onClick={addItem}>Add Item</Button>
//                 )}
//               </div>
//               {formData.items.map((item, index) => (
//                 <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-gray-50 rounded-lg">
//                   <Select
//                     value={item.product}
//                     onChange={e => onProductSelect(index, e.target.value)}
//                     options={[{ value: '', label: 'Select product' }, ...products.map(p => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))]}
//                     disabled={!!selectedOrder} // cannot change items on edit
//                   />
//                   <Select
//                     value={item.stock}
//                     disabled={!item.product || !!selectedOrder}
//                     onChange={e => onStockSelect(index, e.target.value)}
//                     options={[(stockList[item.product]?.length > 0) ? { value: '', label: 'Select stock' } : { value: '', label: 'No stock' }, ...(stockList[item.product] || []).map(s => ({ value: s._id, label: `Batch: ${s.batchNumber || 'N/A'} | Qty: ${s.quantity} | MRP: ₹${s.mrp}` }))]}
//                   />
//                   <Input
//                     type="number"
//                     min={1}
//                     max={item.maxQty || 1}
//                     value={item.quantity}
//                     disabled={!!selectedOrder}
//                     onChange={e => {
//                       let val = Number(e.target.value || 0);
//                       if (item.maxQty && val > item.maxQty) val = item.maxQty;
//                       if (val < 1) val = 1;
//                       updateItem(index, 'quantity', val);
//                     }}
//                   />
//                   <Input value={item.mrp ? String(item.mrp) : ''} disabled />
//                   {!selectedOrder && formData.items.length > 1 && (
//                     <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)}>Remove</Button>
//                   )}
//                 </div>
//               ))}
//               <div className="text-right">
//                 <p className="text-lg font-semibold">Sub-total: {formatCurrency(calcTotal())}</p>
//               </div>
//             </div>

//             {formErrors && <p className="text-red-600 font-medium">{formErrors}</p>}
//             {formSuccess && <p className="text-green-600 font-medium">{formSuccess}</p>}

//             <div className="flex justify-end space-x-3">
//               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
//               <Button type="submit" isLoading={isSubmitting}>{selectedOrder ? 'Update Order' : 'Create Order'}</Button>
//             </div>
//           </form>
//         </Modal>

//         {/* VIEW ORDER MODAL */}
//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details" size="lg">
//           {selectedOrder && (
//             <div className="space-y-2">
//               <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
//               <p><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
//               <p><strong>Customer:</strong> {selectedOrder.customer?.shopName}</p>
//               <p><strong>Status:</strong> {selectedOrder.status}</p>
//               <div className="mt-2">
//                 <h4 className="font-medium">Items</h4>
//                 {selectedOrder.items.map((it, idx) => (
//                   <div key={idx} className="flex justify-between p-2 border-b border-gray-200">
//                     <span>{it.productDetails}</span>
//                     <span>{it.quantity} × ₹{it.mrp}</span>
//                     <span>₹{it.quantity * it.mrp}</span>
//                   </div>
//                 ))}
//               </div>
//               <p className="text-right font-semibold mt-2">Total: ₹{selectedOrder.totalAmount}</p>
//             </div>
//           )}
//         </Modal>

//         {/* DELETE MODAL */}
//         <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete">
//           <p>Are you sure you want to delete {selectedOrders.length > 0 ? 'selected orders' : 'this order'}?</p>
//           <div className="flex justify-end space-x-3 mt-4">
//             <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
//             <Button variant="danger" onClick={() => handleDelete()}>{selectedOrders.length > 0 ? 'Delete Selected' : 'Delete'}</Button>
//           </div>
//         </Modal>
//       </div>
//     </DashboardLayout>
//   );
// }


// 'use client';

// import React, { useEffect, useState } from 'react';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';
// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Modal } from '@/components/ui/Modal';
// import { Badge } from '@/components/ui/Badge';
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
// import { ordersAPI, billsAPI, customersAPI, productsAPI, stockAPI } from '@/lib/api';
// import { Order, Customer, Product, Stock, Bill } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Trash2, Eye } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [stockList, setStockList] = useState<Record<string, Stock[]>>({});
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [creditCheck, setCreditCheck] = useState<any>(null);
//   const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     orderDate: new Date().toISOString().split('T')[0],
//     status: 'Pending' as 'Pending' | 'Confirmed' | 'Cancelled',
//     items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//   });

//   const [formErrors, setFormErrors] = useState<string | null>(null);
//   const [formSuccess, setFormSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [ordersRes, customersRes, productsRes] = await Promise.all([
//         ordersAPI.getAll(),
//         customersAPI.getAll(),
//         productsAPI.getAll(),
//       ]);
//       setOrders(ordersRes.data);
//       setCustomers(customersRes.data);
//       setProducts(productsRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkCustomerCredit = async (customerId: string) => {
//     if (!customerId) {
//       setCreditCheck(null);
//       return;
//     }
//     try {
//       const res = await billsAPI.checkCredit(customerId);
//       setCreditCheck(res.data);
//     } catch (error) {
//       console.error('Error checking credit:', error);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       orderDate: new Date().toISOString().split('T')[0],
//       status: 'Pending',
//       items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     });
//     setStockList({});
//     setFormErrors(null);
//     setFormSuccess(null);
//     setCreditCheck(null);
//     setSelectedOrder(null);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const openEditModal = async (order: Order) => {
//     setSelectedOrder(order);

//     // FIX 1: Extract IDs from the populated objects (it.product/it.stock)
//     const initialItems = order.items.map(it => ({
//         // The backend populates these fields, so we must extract the _id
//         product: (it.product as Product)._id, 
//         stock: (it.stock as Stock)._id,
//         quantity: it.quantity,
//         mrp: it.mrp,
//         maxQty: it.quantity, // not editable more than existing
//     }));

//     setFormData({
//         customer: order.customer?._id || '',
//         orderDate: order.orderDate.split('T')[0],
//         status: order.status,
//         items: initialItems,
//     });

//     // FIX 2: Use the correctly extracted IDs for stock pre-fetching
//     const productIds = Array.from(new Set(initialItems.map(item => item.product)));
//     const newStockList: Record<string, Stock[]> = {};

//     try {
//         // Fetch stock data for ALL products in the existing order to pre-populate the stockList state
//         const stockPromises = productIds.map(async (productId) => {
//             const res = await stockAPI.getByProduct(productId);
//             newStockList[productId] = res.data || [];
//         });

//         await Promise.all(stockPromises);
//         setStockList(newStockList); 
//     } catch (error) {
//         console.error('Error preloading stock for edit:', error);
//     }

//     setIsModalOpen(true);
//   };

//   const viewOrder = (order: Order) => {
//     setSelectedOrder(order);
//     setIsViewModalOpen(true);
//   };

//   const addItem = () => {
//     setFormData(prev => ({
//       ...prev,
//       items: [...prev.items, { product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
//     }));
//   };

//   const removeItem = (index: number) => {
//     setFormData(prev => {
//       const items = prev.items.filter((_, i) => i !== index);
//       return { ...prev, items };
//     });
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     setFormData(prev => {
//       const items = [...prev.items];
//       items[index] = { ...items[index], [field]: value };
//       return { ...prev, items };
//     });
//   };

//   const onProductSelect = async (index: number, productId: string) => {
//     updateItem(index, 'product', productId);
//     updateItem(index, 'stock', '');
//     updateItem(index, 'mrp', 0);
//     updateItem(index, 'quantity', 1);
//     updateItem(index, 'maxQty', 0);

//     if (!productId) {
//       setStockList(prev => ({ ...prev, [productId]: [] }));
//       return;
//     }

//     if (stockList[productId] && stockList[productId].length > 0) return;

//     try {
//       const res = await stockAPI.getByProduct(productId);
//       setStockList(prev => ({ ...prev, [productId]: res.data || [] }));
//     } catch (error) {
//       console.error('Error loading stock:', error);
//       setStockList(prev => ({ ...prev, [productId]: [] }));
//     }
//   };

//   const onStockSelect = (index: number, stockId: string) => {
//     const item = formData.items[index];
//     if (!item || !item.product) return;
//     const selectedStock = (stockList[item.product] || []).find(s => s._id === stockId);
//     if (!selectedStock) return;

//     updateItem(index, 'stock', stockId);
//     updateItem(index, 'mrp', selectedStock.mrp);
//     updateItem(index, 'maxQty', selectedStock.quantity);
//     updateItem(index, 'quantity', 1);
//   };

//   const calcTotal = () => formData.items.reduce((sum, it) => sum + (it.quantity * (it.mrp || 0)), 0);

//   const handleCustomerChange = async (customerId: string) => {
//     setFormData({ ...formData, customer: customerId });
//     await checkCustomerCredit(customerId);
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormErrors(null);
//     setFormSuccess(null);

//     if (!formData.customer) {
//       setFormErrors('Please select a customer.');
//       return;
//     }

//     if (creditCheck && !creditCheck.canCreateBill) {
//       setFormErrors('Customer is not eligible to create order.');
//       return;
//     }

//     for (let i = 0; i < formData.items.length; i++) {
//       const it = formData.items[i];
//       if (!it.product) {
//         setFormErrors(`Please select product for item ${i + 1}.`);
//         return;
//       }
//       if (!it.stock) {
//         setFormErrors(`Please select stock batch for item ${i + 1}.`);
//         return;
//       }
//       if (it.quantity < 1) {
//         setFormErrors(`Quantity must be at least 1 for item ${i + 1}.`);
//         return;
//       }
//       if (it.maxQty && it.quantity > it.maxQty) {
//         setFormErrors(`Quantity for item ${i + 1} exceeds available stock (${it.maxQty}).`);
//         return;
//       }
//     }

//     try {
//       setIsSubmitting(true);

//       const orderPayload = {
//         customer: formData.customer,
//         orderDate: formData.orderDate,
//         items: formData.items.map(it => ({
//           product: it.product,
//           stock: it.stock,
//           quantity: it.quantity,
//           mrp: it.mrp,
//         })),
//         status: formData.status,
//       };

//       let orderRes;
//       if (selectedOrder) {
//         // Update order
//         orderRes = await ordersAPI.update(selectedOrder._id, orderPayload);

//         // If status changed to Confirmed by Admin, generate bill
//         if (selectedOrder.status !== 'Confirmed' && formData.status === 'Confirmed') {
//           const billPayload: Partial<Bill> = {
//             customer: formData.customer,
//             billDate: formData.orderDate,
//             items: formData.items.map(it => ({
//               product: it.product,
//               hsnNumber: products.find(p => p._id === it.product)?.hsnNumber || '',
//               productDetails: `${products.find(p => p._id === it.product)?.brandName} - ${products.find(p => p._id === it.product)?.productName}`,
//               quantity: it.quantity,
//               mrp: it.mrp,
//               amount: it.quantity * it.mrp,
//             })),
//             totalAmount: calcTotal(),
//             paidAmount: 0,
//             dueAmount: calcTotal(),
//           };
//           await billsAPI.create(billPayload);
//         }
//       } else {
//         // Create order
//         orderRes = await ordersAPI.create(orderPayload);
//       }

//       await loadData();
//       setFormSuccess('Order saved successfully!');
//       setIsModalOpen(false);
//     } catch (error: any) {
//       console.error('Error creating/updating order:', error);
//       setFormErrors(error?.response?.data?.message || 'Error saving order.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id?: string) => {
//     try {
//       if (id) {
//         await ordersAPI.delete(id);
//       } else if (selectedOrders.length > 0) {
//         await Promise.all(selectedOrders.map(oid => ordersAPI.delete(oid)));
//         setSelectedOrders([]);
//       }
//       setDeleteModalOpen(false);
//       await loadData();
//     } catch (error: any) {
//       console.error('Error deleting:', error);
//     }
//   };

//   const toggleSelectOrder = (id: string) => {
//     setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const toggleSelectAll = () => {
//     if (selectedOrders.length === orders.length) {
//       setSelectedOrders([]);
//     } else {
//       setSelectedOrders(orders.map(o => o._id));
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
//       Pending: 'warning',
//       Confirmed: 'info',
//       Billed: 'success',
//       Cancelled: 'danger',
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };
// console.log('Error creating order:', hasRole(['Admin']) );
//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//           <div className="flex space-x-2">
//             {hasRole(['Admin', 'Manager', 'Sales Man']) && (
//               <Button onClick={openModal} className="flex items-center"> <Plus className="h-4 w-4 mr-2" /> Create Order </Button>
//             )}
//             {hasRole(['Admin']) && selectedOrders.length > 0 && (
//               <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>Delete Selected</Button>
//             )}
//           </div>
//         </div>

//         <Card>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>
//                         <input type="checkbox" checked={selectedOrders.length === orders.length} onChange={toggleSelectAll} />
//                       </TableHead>
//                       <TableHead>Order ID</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Customer</TableHead>
//                       <TableHead>Items</TableHead>
//                       <TableHead>Total</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {orders.map(order => (
//                       <TableRow key={order._id}>
//                         <TableCell>
//                           <input type="checkbox" checked={selectedOrders.includes(order._id)} onChange={() => toggleSelectOrder(order._id)} />
//                         </TableCell>
//                         <TableCell>{order.orderId}</TableCell>
//                         <TableCell>{formatDate(order.orderDate)}</TableCell>
//                         <TableCell>{order.customer?.shopName}</TableCell>
//                         <TableCell>{order.items?.length || 0} items</TableCell>
//                         <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
//                         <TableCell>{getStatusBadge(order.status)}</TableCell>
//                         <TableCell className="flex space-x-2">
//                           <Button variant="ghost" size="sm" onClick={() => viewOrder(order)}><Eye className="h-4 w-4" /></Button>

//                           {hasRole(['Admin']) && (
//                             <Button variant="ghost" size="sm" onClick={() => openEditModal(order)}>Edit</Button>
//                                                   )}

//                           {hasRole(['Admin']) && (
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => {
//                                 setDeleteModalOpen(true);
//                                 setSelectedOrders([order._id]);
//                               }}
//                             >
//                               <Trash2 className="h-4 w-4 text-red-600" />
//                             </Button>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {orders.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={8} className="text-center text-gray-500 py-6">No orders found</TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* CREATE / EDIT ORDER MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedOrder ? 'Edit Order' : 'Create Order'} size="xl">
//           <form onSubmit={onSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
//                 <Select
//                   value={formData.customer}
//                   onChange={async e => handleCustomerChange(e.target.value)}
//                   options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}
//                   disabled={!!selectedOrder} // cannot change customer on edit
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
//                 <Input type="date" value={formData.orderDate} onChange={e => setFormData({ ...formData, orderDate: e.target.value })} />
//               </div>
//             </div>

//             {selectedOrder && hasRole(['Admin']) && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <Select
//                   value={formData.status}
//                   onChange={e => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Confirmed' | 'Cancelled' })}
//                   options={[
//                     { value: 'Pending', label: 'Pending' },
//                     { value: 'Confirmed', label: 'Confirmed' },
//                     { value: 'Cancelled', label: 'Cancelled' },
//                   ]}
//                 />
//               </div>
//             )}

//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-medium">Order Items</h4>
//                 {!selectedOrder && (
//                   <Button type="button" variant="secondary" size="sm" onClick={addItem}>Add Item</Button>
//                 )}
//               </div>
//               {formData.items.map((item, index) => (
//                 <div key={index} className="grid grid-cols-5 gap-3 items-end p-3 bg-gray-50 rounded-lg">
//                   <Select
//                     value={item.product}
//                     onChange={e => onProductSelect(index, e.target.value)}
//                     options={[{ value: '', label: 'Select product' }, ...products.map(p => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))]}
//                     disabled={!!selectedOrder} // cannot change items on edit
//                   />
//                   <Select
//                     value={item.stock}
//                     disabled={!item.product || !!selectedOrder}
//                     onChange={e => onStockSelect(index, e.target.value)}
//                     options={[(stockList[item.product]?.length > 0) ? { value: '', label: 'Select stock' } : { value: '', label: 'No stock' }, ...(stockList[item.product] || []).map(s => ({ value: s._id, label: `Batch: ${s.batchNumber || 'N/A'} | Qty: ${s.quantity} | MRP: ₹${s.mrp}` }))]}
//                   />
//                   <Input
//                     type="number"
//                     min={1}
//                     max={item.maxQty || 1}
//                     value={item.quantity}
//                     disabled={!!selectedOrder}
//                     onChange={e => {
//                       let val = Number(e.target.value || 0);
//                       if (item.maxQty && val > item.maxQty) val = item.maxQty;
//                       if (val < 1) val = 1;
//                       updateItem(index, 'quantity', val);
//                     }}
//                   />
//                   <Input value={item.mrp ? String(item.mrp) : ''} disabled />
//                   {!selectedOrder && formData.items.length > 1 && (
//                     <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)}>Remove</Button>
//                   )}
//                 </div>
//               ))}
//               <div className="text-right">
//                 <p className="text-lg font-semibold">Sub-total: {formatCurrency(calcTotal())}</p>
//               </div>
//             </div>

//             {formErrors && <p className="text-red-600 font-medium">{formErrors}</p>}
//             {formSuccess && <p className="text-green-600 font-medium">{formSuccess}</p>}

//             <div className="flex justify-end space-x-3">
//               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
//               <Button type="submit" isLoading={isSubmitting}>{selectedOrder ? 'Update Order' : 'Create Order'}</Button>
//             </div>
//           </form>
//         </Modal>

//         {/* VIEW ORDER MODAL */}
//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details" size="lg">
//           {selectedOrder && (
//             <div className="space-y-2">
//               <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
//               <p><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
//               <p><strong>Customer:</strong> {selectedOrder.customer?.shopName}</p>
//               <p><strong>Status:</strong> {selectedOrder.status}</p>
//               <div className="mt-2">
//                 <h4 className="font-medium">Items</h4>
//                 {selectedOrder.items.map((it, idx) => (
//                   <div key={idx} className="flex justify-between p-2 border-b border-gray-200">
//                     <span>{it.productDetails}</span>
//                     <span>{it.quantity} × ₹{it.mrp}</span>
//                     <span>₹{it.quantity * it.mrp}</span>
//                   </div>
//                 ))}
//               </div>
//               <p className="text-right font-semibold mt-2">Total: ₹{selectedOrder.totalAmount}</p>
//             </div>
//           )}
//         </Modal>

//         {/* DELETE MODAL */}
//         <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete">
//           <p>Are you sure you want to delete {selectedOrders.length > 0 ? 'selected orders' : 'this order'}?</p>
//           <div className="flex justify-end space-x-3 mt-4">
//             <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
//             <Button variant="danger" onClick={() => handleDelete()}>{selectedOrders.length > 0 ? 'Delete Selected' : 'Delete'}</Button>
//           </div>
//         </Modal>
//       </div>
//     </DashboardLayout>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { ordersAPI, billsAPI, customersAPI, productsAPI, stockAPI } from '@/lib/api';
import { Order, Customer, Product, Stock, Bill } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Trash2, Eye, Edit, ShoppingCart, AlertCircle, CheckCircle, Package, Search, Filter } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';
import { useMemo } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stockList, setStockList] = useState<Record<string, Stock[]>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<string>('All');
  const [creditCheck, setCreditCheck] = useState<any>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { hasRole } = useAuth();

  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      (filterStatus === 'All' || order.status === filterStatus) &&
      (searchField === 'All' ? (
        (order.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer?.shopName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((order.customer?.firstName || '') + ' ' + (order.customer?.lastName || '')).toLowerCase().includes(searchQuery.toLowerCase())
      ) : searchField === 'Order ID' ? (
        (order.orderId || '').toLowerCase().includes(searchQuery.toLowerCase())
      ) : searchField === 'Customer' ? (
        ((order.customer?.firstName || '') + ' ' + (order.customer?.lastName || '')).toLowerCase().includes(searchQuery.toLowerCase())
      ) : searchField === 'Shop' ? (
        (order.customer?.shopName || '').toLowerCase().includes(searchQuery.toLowerCase())
      ) : true)
    );
  }, [orders, filterStatus, searchQuery, searchField]);

  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const [formData, setFormData] = useState({
    customer: '',
    orderDate: new Date().toISOString().split('T')[0],
    status: 'Pending' as 'Pending' | 'Confirmed' | 'Cancelled' | 'Billed',
    items: [{ product: '', stock: '', quantity: 1, mrp: 0, discount: 0, maxQty: 0 }],
  });

  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        ordersAPI.getAll(),
        customersAPI.getAll(),
        productsAPI.getAll(),
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCustomerCredit = async (customerId: string) => {
    if (!customerId) {
      setCreditCheck(null);
      return;
    }
    try {
      const res = await billsAPI.checkCredit(customerId);
      setCreditCheck(res.data);
    } catch (error) {
      console.error('Error checking credit:', error);
    }
  };

  const openModal = () => {
    setFormData({
      customer: '',
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      items: [{ product: '', stock: '', quantity: 1, mrp: 0, discount: 0, maxQty: 0 }],
    });
    setStockList({});
    setFormErrors(null);
    setFormSuccess(null);
    setCreditCheck(null);
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openEditModal = async (order: Order) => {
    setSelectedOrder(order);

    const initialItems = order.items.map(it => ({
      product: (it.product as Product)._id,
      stock: (it.stock as Stock)._id,
      quantity: it.quantity,
      mrp: it.mrp,
      discount: it.discount || 0,
      maxQty: it.quantity,
    }));

    setFormData({
      customer: order.customer?._id || '',
      orderDate: order.orderDate.split('T')[0],
      status: order.status,
      items: initialItems,
    });

    if (order.customer?._id) {
      checkCustomerCredit(order.customer._id);
    }

    const productIds = Array.from(new Set(initialItems.map(item => item.product)));
    const newStockList: Record<string, Stock[]> = {};

    try {
      const stockPromises = productIds.map(async (productId) => {
        const res = await stockAPI.getByProduct(productId);
        newStockList[productId] = res.data || [];
      });

      await Promise.all(stockPromises);
      setStockList(newStockList);
    } catch (error) {
      console.error('Error preloading stock for edit:', error);
    }

    setIsModalOpen(true);
  };

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', stock: '', quantity: 1, mrp: 0, discount: 0, maxQty: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => {
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items };
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const onProductSelect = async (index: number, productId: string) => {
    updateItem(index, 'product', productId);
    updateItem(index, 'stock', '');
    updateItem(index, 'mrp', 0);
    updateItem(index, 'discount', 0);
    updateItem(index, 'quantity', 1);
    updateItem(index, 'maxQty', 0);

    if (!productId) {
      setStockList(prev => ({ ...prev, [productId]: [] }));
      return;
    }

    if (stockList[productId] && stockList[productId].length > 0) return;

    try {
      const res = await stockAPI.getByProduct(productId);
      setStockList(prev => ({ ...prev, [productId]: res.data || [] }));
    } catch (error) {
      console.error('Error loading stock:', error);
      setStockList(prev => ({ ...prev, [productId]: [] }));
    }
  };

  const onStockSelect = (index: number, stockId: string) => {
    const item = formData.items[index];
    if (!item || !item.product) return;
    const selectedStock = (stockList[item.product] || []).find(s => s._id === stockId);
    if (!selectedStock) {
      console.log('No stock found for selected stockId:', stockId);
      return;
    }

    console.log('Selected Stock Data:', {
      batch: selectedStock.batchNumber,
      mrp: selectedStock.mrp,
      discount: selectedStock.discount,
      fullObject: selectedStock
    });

    updateItem(index, 'stock', stockId);
    updateItem(index, 'mrp', selectedStock.mrp);
    updateItem(index, 'discount', selectedStock.discount || 0);
    updateItem(index, 'maxQty', selectedStock.quantity);
    updateItem(index, 'quantity', 1);
  };

  const calcTotal = () => formData.items.reduce((sum, it) => {
    const discount = it.discount || 0;
    const finalPrice = it.mrp - (it.mrp * discount / 100);
    return sum + (it.quantity * (finalPrice || 0));
  }, 0);

  const handleCustomerChange = async (customerId: string) => {
    setFormData({ ...formData, customer: customerId });
    await checkCustomerCredit(customerId);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);
    setFormSuccess(null);

    if (!formData.customer) {
      setFormErrors('Please select a customer.');
      return;
    }

    if (creditCheck && !creditCheck.canCreateBill) {
      setFormErrors('Customer is not eligible to create order.');
      return;
    }

    for (let i = 0; i < formData.items.length; i++) {
      const it = formData.items[i];
      if (!it.product) {
        setFormErrors(`Please select product for item ${i + 1}.`);
        return;
      }
      if (!it.stock) {
        setFormErrors(`Please select stock batch for item ${i + 1}.`);
        return;
      }
      if (it.quantity < 1) {
        setFormErrors(`Quantity must be at least 1 for item ${i + 1}.`);
        return;
      }
      if (it.maxQty && it.quantity > it.maxQty) {
        setFormErrors(`Quantity for item ${i + 1} exceeds available stock (${it.maxQty}).`);
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        customer: formData.customer,
        orderDate: formData.orderDate,
        items: formData.items.map(it => ({
          product: it.product,
          stock: it.stock,
          quantity: it.quantity,
          mrp: it.mrp,
          discount: it.discount || 0,
        })),
        status: formData.status,
      };

      console.log('Order submission payload:', JSON.stringify(orderPayload, null, 2));

      let orderRes;
      if (selectedOrder) {
        orderRes = await ordersAPI.update(selectedOrder._id, orderPayload);


      } else {
        orderRes = await ordersAPI.create(orderPayload);
      }

      await loadData();
      setFormSuccess('Order saved successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error creating/updating order:', error);
      setFormErrors(error?.response?.data?.message || 'Error saving order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    try {
      if (id) {
        await ordersAPI.delete(id);
      } else if (selectedOrders.length > 0) {
        await Promise.all(selectedOrders.map(oid => ordersAPI.delete(oid)));
        setSelectedOrders([]);
      }
      setDeleteModalOpen(false);
      await loadData();
    } catch (error: any) {
      console.error('Error deleting:', error);
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o._id));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      Pending: 'warning',
      Confirmed: 'info',
      Billed: 'success',
      Cancelled: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <DashboardLayout moduleName="Orders">
      <div className="space-y-6 w-full animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{orders.filter(o => o.status === 'Pending').length}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{orders.filter(o => o.status === 'Confirmed').length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-40">
            <Select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              options={[
                { value: 'All', label: 'All Fields' },
                { value: 'Order ID', label: 'Order ID' },
                { value: 'Customer', label: 'Customer Name' },
                { value: 'Shop', label: 'Shop Name' }
              ]}
              className="h-10"
            />
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Confirmed', label: 'Confirmed' },
                { value: 'Billed', label: 'Billed' },
                { value: 'Cancelled', label: 'Cancelled' }
              ]}
              className="h-10"
            />
          </div>
          {hasRole(['Admin', 'Manager', 'Sales Man']) && (
            <Button
              onClick={openModal}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 h-10"
            >
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          )}
          {hasRole(['Admin']) && selectedOrders.length > 0 && (
            <Button
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 h-10"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedOrders.length})
            </Button>
          )}
        </div>

        {/* Orders Table Card Area */}
        <Card className="shadow-md border border-gray-100 overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-1/8">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 w-1/8">Order ID</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-1/8">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-1/8">Customer</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-1/8">Items</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-1/8">Total</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-1/8">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right w-1/8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order, index) => (
                      <TableRow
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 animate-slide-up"
                      >
                        <TableCell className='w-1/8'>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => toggleSelectOrder(order._id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 w-1/8">{order.orderId}</TableCell>
                        <TableCell className="text-gray-600 w-1/8">{formatDate(order.orderDate)}</TableCell>
                        <TableCell className="text-gray-900 font-medium w-1/8">{order.customer?.shopName}</TableCell>
                        <TableCell className="w-1/8">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {order.items?.length || 0} items
                          </span>
                        </TableCell>
                        <TableCell className="w-1/8">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                            {order.items?.some(it => (it.discount || 0) > 0) && (
                              <span className="text-[10px] text-green-600 font-medium">
                                Save {formatCurrency(order.items.reduce((sum, it) => sum + (it.quantity * it.mrp * (it.discount || 0) / 100), 0))}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className='w-1/8'>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewOrder(order)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {hasRole(['Admin', 'Manager', 'Sales Man']) && order.status === 'Pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditModal(order)}
                                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                              >
                                <Edit size={16} />
                              </Button>
                            )}
                            {hasRole(['Admin']) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setDeleteModalOpen(true);
                                  setSelectedOrders([order._id]);
                                }}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center p-4">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <ShoppingCart className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No orders found</p>
                            <p className="text-sm text-gray-400">Create your first order to get started</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {!loading && filteredOrders.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={(items) => {
                setItemsPerPage(items);
                setCurrentPage(1);
              }}
              type="table"
            />
          </div>
        )}
      </div>

      {/* CREATE / EDIT ORDER MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedOrder ? 'Edit Order' : 'Create Order'} size="xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Customer</label>
              <Select
                value={formData.customer}
                onChange={async e => handleCustomerChange(e.target.value)}
                options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}
                disabled={!!selectedOrder}
                className="transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Order Date</label>
              <Input
                type="date"
                value={formData.orderDate}
                onChange={e => setFormData({ ...formData, orderDate: e.target.value })}
                className="transition-all duration-200"
              />
            </div>
          </div>

          {selectedOrder && hasRole(['Admin', 'Manager', 'Sales Man']) && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Status</label>
              <Select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Confirmed' | 'Cancelled' | 'Billed' })}
                options={[
                  { value: 'Pending', label: 'Pending' },
                  ...(hasRole(['Admin']) ? [{ value: 'Confirmed', label: 'Confirmed' }] : []),
                  { value: 'Cancelled', label: 'Cancelled' },
                ]}
                className="transition-all duration-200"
              />
            </div>
          )}

          {creditCheck && (
            <div className={`p-4 rounded-lg border-2 ${creditCheck.canCreateBill ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-fade-in`}>
              <div className="flex items-start gap-3">
                {creditCheck.canCreateBill ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${creditCheck.canCreateBill ? 'text-green-900' : 'text-red-900'}`}>
                    {creditCheck.canCreateBill ? 'Customer Eligible' : 'Customer Not Eligible'}
                  </p>
                  <p className={`text-sm mt-1 ${creditCheck.canCreateBill ? 'text-green-700' : 'text-red-700'}`}>
                    Unpaid Bills: {creditCheck.unpaidBillsCount} | Total Due: {formatCurrency(creditCheck.totalDue)} | Unpaid: {creditCheck.unpaidPercentage}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900 text-lg">Order Items</h4>
              {(!selectedOrder || selectedOrder.status === 'Pending') && (
                <button
                  type="button"
                  onClick={addItem}
                  disabled={!formData.customer || (creditCheck && !creditCheck.canCreateBill)}
                  className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              )}
            </div>

            {!formData.customer && !selectedOrder && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-700 animate-pulse">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">Please select a customer first to start adding items</p>
              </div>
            )}

            <div className={`space-y-3 ${(!formData.customer && !selectedOrder) || (creditCheck && !creditCheck.canCreateBill) ? 'opacity-50 pointer-events-none' : ''}`}>
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2.5 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in group/item"
                >
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Product</label>
                    <Select
                      value={item.product}
                      onChange={e => onProductSelect(index, e.target.value)}
                      options={[{ value: '', label: 'Search & Select Product' }, ...products.map(p => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))]}
                      disabled={!!selectedOrder && selectedOrder.status !== 'Pending'}
                      showSearch={true}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Stock Batch</label>
                    <Select
                      value={item.stock}
                      disabled={!item.product || (!!selectedOrder && selectedOrder.status !== 'Pending')}
                      onChange={e => onStockSelect(index, e.target.value)}
                      options={[(stockList[item.product]?.length > 0) ? { value: '', label: 'Select batch' } : { value: '', label: 'No stock' }, ...(stockList[item.product] || []).map(s => ({
                        value: s._id,
                        label: `${s.weight}${s.weightUnit} • Qty: ${s.quantity} • ${formatDate(s.expiryDate)}`
                      }))]}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 text-center">Qty</label>
                    <Input
                      type="number"
                      min={1}
                      max={item.maxQty || 1}
                      value={item.quantity}
                      disabled={!!selectedOrder && selectedOrder.status !== 'Pending'}
                      onChange={e => {
                        let val = Number(e.target.value || 0);
                        if (item.maxQty && val > item.maxQty) val = item.maxQty;
                        if (val < 1) val = 1;
                        updateItem(index, 'quantity', val);
                      }}
                      className="text-center font-bold px-1 h-[40px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 text-center">Price/Disc</label>
                    <div className="h-[40px] flex flex-col justify-center px-1.5 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      {(item.discount || 0) > 0 && (
                        <p className="text-[9px] text-gray-400 line-through leading-none mb-0.5 text-center">{formatCurrency(item.mrp || 0)}</p>
                      )}
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-xs font-bold text-blue-600 leading-none">
                          {formatCurrency((item.mrp || 0) * (1 - (item.discount || 0) / 100))}
                        </p>
                        {(item.discount || 0) > 0 && (
                          <span className="text-[8px] font-bold px-0.5 py-0.5 bg-green-100 text-green-700 rounded">
                            -{item.discount}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-1 border-l border-gray-100 pl-2 flex items-center justify-center pt-6">
                    {(!selectedOrder || selectedOrder.status === 'Pending') && formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t-2 border-gray-200">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {formatCurrency(calcTotal())}
                </p>
              </div>
            </div>
          </div>

          {formErrors && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-shake">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium">{formErrors}</p>
              </div>
            </div>
          )}
          {formSuccess && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800 font-medium">{formSuccess}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 pb-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
              className="w-full sm:w-auto hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!!(creditCheck && !creditCheck.canCreateBill && !selectedOrder)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              {selectedOrder ? 'Update Order' : 'Create Order'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW ORDER MODAL */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Order Details" size="lg">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{selectedOrder.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{formatDate(selectedOrder.orderDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customer</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedOrder.customer?.shopName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-lg mb-4">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1 mb-2 sm:mb-0">
                      <p className="font-medium text-gray-900">
                        {(it.product as Product)?.brandName} - {(it.product as Product)?.productName || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Batch: {(it.stock as any)?.batchNumber || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {it.quantity} × {formatCurrency(it.mrp)}
                        {(it.discount || 0) > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs font-semibold">
                            -{it.discount}% Off
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 line-through mb-1">
                        {formatCurrency(it.quantity * it.mrp)}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(it.quantity * it.mrp * (1 - (it.discount || 0) / 100))}
                      </p>
                      {(it.discount || 0) > 0 ? (
                        <p className="text-[10px] text-green-600 font-medium">Save {formatCurrency((it.mrp * (it.discount || 0) / 100) * it.quantity)}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end pt-4 border-t-2 border-gray-200 gap-2">
              <div className="flex justify-between w-full sm:w-1/2 text-sm text-gray-600">
                <span>Subtotal (MRP)</span>
                <span>{formatCurrency(selectedOrder.items.reduce((sum, it) => sum + (it.quantity * it.mrp), 0))}</span>
              </div>
              {selectedOrder.items.some(it => (it.discount || 0) > 0) && (
                <div className="flex justify-between w-full sm:w-1/2 text-sm text-green-600 font-medium">
                  <span>Total Discount Savings</span>
                  <span>-{formatCurrency(selectedOrder.items.reduce((sum, it) => sum + (it.quantity * it.mrp * (it.discount || 0) / 100), 0))}</span>
                </div>
              )}
              <div className="text-right mt-2">
                <p className="text-sm text-gray-600 mb-1 font-semibold">Grand Total</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {formatCurrency(selectedOrder.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-900">Are you sure?</p>
              <p className="text-sm text-red-700 mt-1">
                {selectedOrders.length > 1
                  ? `You are about to delete ${selectedOrders.length} orders. This action cannot be undone.`
                  : 'You are about to delete this order. This action cannot be undone.'}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              className="w-full sm:w-auto hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete()}
              className="w-full sm:w-auto hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              {selectedOrders.length > 1 ? `Delete ${selectedOrders.length} Orders` : 'Delete Order'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout >
  );
}