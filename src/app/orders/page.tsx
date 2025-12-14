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
import { Plus, Trash2, Eye,Edit, ShoppingCart, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

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
  const [creditCheck, setCreditCheck] = useState<any>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { hasRole } = useAuth();

  const [formData, setFormData] = useState({
    customer: '',
    orderDate: new Date().toISOString().split('T')[0],
    status: 'Pending' as 'Pending' | 'Confirmed' | 'Cancelled',
    items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
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
      items: [{ product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
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
        maxQty: it.quantity,
    }));

    setFormData({
        customer: order.customer?._id || '',
        orderDate: order.orderDate.split('T')[0],
        status: order.status,
        items: initialItems,
    });

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
      items: [...prev.items, { product: '', stock: '', quantity: 1, mrp: 0, maxQty: 0 }],
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
    if (!selectedStock) return;

    updateItem(index, 'stock', stockId);
    updateItem(index, 'mrp', selectedStock.mrp);
    updateItem(index, 'maxQty', selectedStock.quantity);
    updateItem(index, 'quantity', 1);
  };

  const calcTotal = () => formData.items.reduce((sum, it) => sum + (it.quantity * (it.mrp || 0)), 0);

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
        })),
        status: formData.status,
      };

      let orderRes;
      if (selectedOrder) {
        orderRes = await ordersAPI.update(selectedOrder._id, orderPayload);

        if (selectedOrder.status !== 'Confirmed' && formData.status === 'Confirmed') {
          const billPayload: Partial<Bill> = {
            customer: formData.customer,
            billDate: formData.orderDate,
            items: formData.items.map(it => ({
              product: it.product,
              hsnNumber: products.find(p => p._id === it.product)?.hsnNumber || '',
              productDetails: `${products.find(p => p._id === it.product)?.brandName} - ${products.find(p => p._id === it.product)?.productName}`,
              quantity: it.quantity,
              mrp: it.mrp,
              amount: it.quantity * it.mrp,
            })),
            totalAmount: calcTotal(),
            paidAmount: 0,
            dueAmount: calcTotal(),
          };
          await billsAPI.create(billPayload);
        }
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
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {hasRole(['Admin', 'Manager', 'Sales Man']) && (
              <Button
                onClick={openModal}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Order</span>
                <span className="sm:hidden">New</span>
              </Button>
            )}
            {hasRole(['Admin']) && selectedOrders.length > 0 && (
              <Button
                variant="danger"
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedOrders.length})
              </Button>
            )}
          </div>
        </div>

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

        {/* Orders Table Card */}
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
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">Order ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                      <TableHead className="font-semibold text-gray-700">Items</TableHead>
                      <TableHead className="font-semibold text-gray-700">Total</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, index) => (
                      <TableRow
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => toggleSelectOrder(order._id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{order.orderId}</TableCell>
                        <TableCell className="text-gray-600">{formatDate(order.orderDate)}</TableCell>
                        <TableCell className="text-gray-900 font-medium">{order.customer?.shopName}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {order.items?.length || 0} items
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewOrder(order)}
                              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {hasRole(['Admin']) && (
                              // <Button
                              //   variant="ghost"
                              //   size="sm"
                              //   onClick={() => openEditModal(order)}
                              //   className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                              // >
                              //   Edit
                              // </Button>
                              <Button
  variant="ghost"
  size="sm"
  onClick={() => openEditModal(order)}
  className="hover:bg-green-50 hover:text-green-600 transition-all duration-200 flex items-center gap-1"
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
                                className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
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
                        <TableCell colSpan={8} className="text-center py-12">
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

            {selectedOrder && hasRole(['Admin']) && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Status</label>
                <Select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as 'Pending' | 'Confirmed' | 'Cancelled' })}
                  options={[
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Confirmed', label: 'Confirmed' },
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
                      Credit Limit: {formatCurrency(creditCheck.creditLimit)} | Outstanding: {formatCurrency(creditCheck.totalOutstanding)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900 text-lg">Order Items</h4>
                {!selectedOrder && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addItem}
                    className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 animate-fade-in"
                  >
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Product</label>
                      <Select
                        value={item.product}
                        onChange={e => onProductSelect(index, e.target.value)}
                        options={[{ value: '', label: 'Select product' }, ...products.map(p => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))]}
                        disabled={!!selectedOrder}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Stock Batch</label>
                      <Select
                        value={item.stock}
                        disabled={!item.product || !!selectedOrder}
                        onChange={e => onStockSelect(index, e.target.value)}
                        options={[(stockList[item.product]?.length > 0) ? { value: '', label: 'Select stock' } : { value: '', label: 'No stock' }, ...(stockList[item.product] || []).map(s => ({ value: s._id, label: `Batch: ${s.batchNumber || 'N/A'} | Qty: ${s.quantity}` }))]}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                      <Input
                        type="number"
                        min={1}
                        max={item.maxQty || 1}
                        value={item.quantity}
                        disabled={!!selectedOrder}
                        onChange={e => {
                          let val = Number(e.target.value || 0);
                          if (item.maxQty && val > item.maxQty) val = item.maxQty;
                          if (val < 1) val = 1;
                          updateItem(index, 'quantity', val);
                        }}
                        className="font-semibold"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
                        <Input
                          value={item.mrp ? formatCurrency(item.mrp) : ''}
                          disabled
                          className="font-semibold text-gray-900"
                        />
                      </div>
                      {!selectedOrder && formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
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
                        <p className="font-medium text-gray-900">{it.productDetails}</p>
                        <p className="text-sm text-gray-500 mt-1">Quantity: {it.quantity} × {formatCurrency(it.mrp)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(it.quantity * it.mrp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t-2 border-gray-200">
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
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
            <div className="flex flex-col sm:flex-row justify-end gap-3">
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
      </div>
    </DashboardLayout>
  );
}
