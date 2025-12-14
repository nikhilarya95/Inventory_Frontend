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
// // import { paymentsAPI, customersAPI, billsAPI } from '@/lib/api';
// // import { Payment, Customer, Bill } from '@/types';
// // import { useAuth } from '@/contexts/AuthContext';
// // import { Plus, Eye, Trash2 } from 'lucide-react';
// // import { formatCurrency, formatDate } from '@/lib/utils';

// // export default function PaymentsPage() {
// //   const [payments, setPayments] = useState<Payment[]>([]);
// //   const [customers, setCustomers] = useState<Customer[]>([]);
// //   const [customerBills, setCustomerBills] = useState<Bill[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
// //   const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const { hasRole } = useAuth();

// //   const [formData, setFormData] = useState({
// //     customer: '',
// //     bill: '',
// //     amount: 0,
// //     modeOfPayment: '',
// //     transactionDate: new Date().toISOString().split('T')[0],
// //     notes: '',
// //   });

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   const loadData = async () => {
// //     try {
// //       const [paymentsRes, customersRes] = await Promise.all([
// //         paymentsAPI.getAll(),
// //         customersAPI.getAll(),
// //       ]);
// //       setPayments(paymentsRes.data);
// //       setCustomers(customersRes.data);
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadCustomerBills = async (customerId: string) => {
// //     try {
// //       const response = await billsAPI.getByCustomer(customerId);
// //       setCustomerBills(response.data);
// //     } catch (error) {
// //       console.error('Error loading customer bills:', error);
// //     }
// //   };

// //   const openModal = () => {
// //     setFormData({
// //       customer: '',
// //       bill: '',
// //       amount: 0,
// //       modeOfPayment: '',
// //       transactionDate: new Date().toISOString().split('T')[0],
// //       notes: '',
// //     });
// //     setCustomerBills([]);
// //     setIsModalOpen(true);
// //   };

// //   const closeModal = () => {
// //     setIsModalOpen(false);
// //     setCustomerBills([]);
// //   };

// //   const viewPayment = (payment: Payment) => {
// //     setSelectedPayment(payment);
// //     setIsViewModalOpen(true);
// //   };

// //   const handleCustomerChange = (customerId: string) => {
// //     setFormData({ ...formData, customer: customerId, bill: '' });
// //     if (customerId) {
// //       loadCustomerBills(customerId);
// //     } else {
// //       setCustomerBills([]);
// //     }
// //   };

// //   const handleBillChange = (billId: string) => {
// //     const bill = customerBills.find(b => b._id === billId);
// //     setFormData({ 
// //       ...formData, 
// //       bill: billId,
// //       amount: bill ? bill.dueAmount : 0
// //     });
// //   };

// //   const onSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       setIsSubmitting(true);
// //       await paymentsAPI.create(formData);
// //       await loadData();
// //       closeModal();
// //     } catch (error: any) {
// //       alert(error.response?.data?.message || 'Error recording payment');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleDelete = async (id: string) => {
// //     if (confirm('Are you sure you want to delete this payment? This will update the bill status.')) {
// //       try {
// //         await paymentsAPI.delete(id);
// //         await loadData();
// //       } catch (error: any) {
// //         alert(error.response?.data?.message || 'Error deleting payment');
// //       }
// //     }
// //   };

// //   const getModeColor = (mode: string) => {
// //     const colors: Record<string, 'default' | 'success' | 'info' | 'warning'> = {
// //       Cash: 'success',
// //       UPI: 'info',
// //       'Net Banking': 'info',
// //       Cheque: 'warning',
// //       Card: 'default',
// //     };
// //     return colors[mode] || 'default';
// //   };

// //   const canEdit = hasRole(['Admin', 'Sales Man']);

// //   return (
// //     <DashboardLayout>
// //       <div className="space-y-6">
// //         <div className="flex items-center justify-between">
// //           <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
// //           {canEdit && (
// //             <Button onClick={openModal}>
// //               <Plus className="h-4 w-4 mr-2" />
// //               Record Payment
// //             </Button>
// //           )}
// //         </div>

// //         <Card>
// //           <CardContent>
// //             {loading ? (
// //               <div className="flex justify-center py-8">
// //                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
// //               </div>
// //             ) : (
// //               <Table>
// //                 <TableHeader>
// //                   <TableRow>
// //                     <TableHead>Transaction ID</TableHead>
// //                     <TableHead>Date</TableHead>
// //                     <TableHead>Customer</TableHead>
// //                     <TableHead>Bill</TableHead>
// //                     <TableHead>Amount</TableHead>
// //                     <TableHead>Mode</TableHead>
// //                     <TableHead>Actions</TableHead>
// //                   </TableRow>
// //                 </TableHeader>
// //                 <TableBody>
// //                   {payments.map((payment) => (
// //                     <TableRow key={payment._id}>
// //                       <TableCell className="font-medium">{payment.transactionId}</TableCell>
// //                       <TableCell>{formatDate(payment.transactionDate)}</TableCell>
// //                       <TableCell>
// //                         <div>
// //                           <p>{payment.customer?.shopName}</p>
// //                           <p className="text-sm text-gray-500">{payment.customer?.firstName} {payment.customer?.lastName}</p>
// //                         </div>
// //                       </TableCell>
// //                       <TableCell>{payment.bill?.billId}</TableCell>
// //                       <TableCell className="text-green-600 font-medium">{formatCurrency(payment.amount)}</TableCell>
// //                       <TableCell>
// //                         <Badge variant={getModeColor(payment.modeOfPayment)}>{payment.modeOfPayment}</Badge>
// //                       </TableCell>
// //                       <TableCell>
// //                         <div className="flex space-x-2">
// //                           <button onClick={() => viewPayment(payment)} className="text-gray-600 hover:text-gray-800">
// //                             <Eye className="h-4 w-4" />
// //                           </button>
// //                           {canEdit && (
// //                             <button onClick={() => handleDelete(payment._id)} className="text-red-600 hover:text-red-800">
// //                               <Trash2 className="h-4 w-4" />
// //                             </button>
// //                           )}
// //                         </div>
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //                   {payments.length === 0 && (
// //                     <TableRow>
// //                       <TableCell colSpan={7} className="text-center text-gray-500">No payments found</TableCell>
// //                     </TableRow>
// //                   )}
// //                 </TableBody>
// //               </Table>
// //             )}
// //           </CardContent>
// //         </Card>

// //         <Modal isOpen={isModalOpen} onClose={closeModal} title="Record Payment" size="lg">
// //           <form onSubmit={onSubmit} className="space-y-4">
// //             <Select
// //               label="Customer"
// //               value={formData.customer}
// //               onChange={(e) => handleCustomerChange(e.target.value)}
// //               options={customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))}
// //             />

// //             {customerBills.length > 0 && (
// //               <Select
// //                 label="Bill"
// //                 value={formData.bill}
// //                 onChange={(e) => handleBillChange(e.target.value)}
// //                 options={customerBills.map(b => ({ 
// //                   value: b._id, 
// //                   label: `${b.billId} - Due: ${formatCurrency(b.dueAmount)}` 
// //                 }))}
// //               />
// //             )}

// //             {customerBills.length === 0 && formData.customer && (
// //               <div className="bg-gray-50 text-gray-600 p-3 rounded-lg text-sm">
// //                 No unpaid bills found for this customer.
// //               </div>
// //             )}

// //             <div className="grid grid-cols-2 gap-4">
// //               <Input 
// //                 label="Amount" 
// //                 type="number" 
// //                 step="0.01" 
// //                 value={formData.amount} 
// //                 onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} 
// //               />
// //               <Select
// //                 label="Mode of Payment"
// //                 value={formData.modeOfPayment}
// //                 onChange={(e) => setFormData({ ...formData, modeOfPayment: e.target.value })}
// //                 options={[
// //                   { value: 'Cash', label: 'Cash' },
// //                   { value: 'UPI', label: 'UPI' },
// //                   { value: 'Net Banking', label: 'Net Banking' },
// //                   { value: 'Cheque', label: 'Cheque' },
// //                   { value: 'Card', label: 'Card' },
// //                 ]}
// //               />
// //             </div>

// //             <Input 
// //               label="Transaction Date" 
// //               type="date" 
// //               value={formData.transactionDate} 
// //               onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })} 
// //             />

// //             <Input 
// //               label="Notes (Optional)" 
// //               value={formData.notes} 
// //               onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
// //             />

// //             <div className="flex justify-end space-x-3">
// //               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
// //               <Button type="submit" isLoading={isSubmitting} disabled={!formData.bill}>Record Payment</Button>
// //             </div>
// //           </form>
// //         </Modal>

// //         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Details">
// //           {selectedPayment && (
// //             <div className="space-y-4">
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <p className="text-sm text-gray-500">Transaction ID</p>
// //                   <p className="font-medium">{selectedPayment.transactionId}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-500">Date</p>
// //                   <p className="font-medium">{formatDate(selectedPayment.transactionDate)}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-500">Customer</p>
// //                   <p className="font-medium">{selectedPayment.customer?.shopName}</p>
// //                   <p className="text-sm text-gray-500">{selectedPayment.customer?.firstName} {selectedPayment.customer?.lastName}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-500">Bill</p>
// //                   <p className="font-medium">{selectedPayment.bill?.billId}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-500">Amount</p>
// //                   <p className="font-medium text-green-600">{formatCurrency(selectedPayment.amount)}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-500">Mode of Payment</p>
// //                   <Badge variant={getModeColor(selectedPayment.modeOfPayment)}>{selectedPayment.modeOfPayment}</Badge>
// //                 </div>
// //               </div>
// //               {selectedPayment.notes && (
// //                 <div>
// //                   <p className="text-sm text-gray-500">Notes</p>
// //                   <p>{selectedPayment.notes}</p>
// //                 </div>
// //               )}
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
// import { paymentsAPI, customersAPI, billsAPI } from '@/lib/api';
// import { Payment, Customer, Bill } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Eye, Trash2 } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';

// export default function PaymentsPage() {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [customerBills, setCustomerBills] = useState<Bill[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     bill: '',
//     amount: 0,
//     modeOfPayment: '',
//     transactionDate: new Date().toISOString().split('T')[0],
//     notes: '',
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [paymentsRes, customersRes] = await Promise.all([
//         paymentsAPI.getAll(),
//         customersAPI.getAll(),
//       ]);
//       setPayments(paymentsRes.data);
//       setCustomers(customersRes.data);
//     } catch (error) {
//       console.error('Error loading:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCustomerBills = async (customerId: string) => {
//     try {
//       const res = await billsAPI.getByCustomer(customerId);
//       setCustomerBills(res.data);

//       // Auto-select bill if only one exists
//       if (res.data.length === 1) {
//         const bill = res.data[0];
//         setFormData(prev => ({
//           ...prev,
//           bill: bill._id,
//           amount: bill.dueAmount
//         }));
//       }
//     } catch (error) {
//       console.error('Error loading bills:', error);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       bill: '',
//       amount: 0,
//       modeOfPayment: '',
//       transactionDate: new Date().toISOString().split('T')[0],
//       notes: '',
//     });
//     setCustomerBills([]);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const viewPayment = (payment: Payment) => {
//     setSelectedPayment(payment);
//     setIsViewModalOpen(true);
//   };

//   const handleCustomerChange = (customerId: string) => {
//     setFormData(prev => ({ ...prev, customer: customerId, bill: '' }));
//     if (customerId) loadCustomerBills(customerId);
//   };

//   const handleBillChange = (billId: string) => {
//     const bill = customerBills.find(b => b._id === billId);
//     setFormData(prev => ({
//       ...prev,
//       bill: billId,
//       amount: bill ? bill.dueAmount : 0,
//     }));
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setIsSubmitting(true);

//       await paymentsAPI.create(formData);

//       await loadData();
//       closeModal();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error recording payment');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this payment? Bill status will be affected.")) return;

//     try {
//       await paymentsAPI.delete(id);
//       await loadData();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error deleting payment');
//     }
//   };

//   const getModeColor = (mode: string) => {
//     const colors: any = {
//       Cash: 'success',
//       UPI: 'info',
//       'Net Banking': 'info',
//       Cheque: 'warning',
//       Card: 'default',
//     };
//     return colors[mode] || 'default';
//   };

//   const canEdit = hasRole(['Admin', 'Sales Man']);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">

//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Payments</h1>
//           {canEdit && (
//             <Button onClick={openModal}>
//               <Plus className="h-4 w-4 mr-2" />
//               Record Payment
//             </Button>
//           )}
//         </div>

//         {/* TABLE */}
//         <Card>
//           <CardContent>
//             {loading ? (
//               <div className="py-8 text-center">Loading...</div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Txn ID</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Bill</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Mode</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {payments.map(payment => (
//                     <TableRow key={payment._id}>
//                       <TableCell>{payment.transactionId}</TableCell>
//                       <TableCell>{formatDate(payment.transactionDate)}</TableCell>
//                       <TableCell>
//                         <p>{payment.customer?.shopName}</p>
//                         <p className="text-sm text-gray-500">
//                           {payment.customer?.firstName} {payment.customer?.lastName}
//                         </p>
//                       </TableCell>
//                       <TableCell>{payment.bill?.billId}</TableCell>
//                       <TableCell className="text-green-600 font-medium">
//                         {formatCurrency(payment.amount)}
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant={getModeColor(payment.modeOfPayment)}>
//                           {payment.modeOfPayment}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <Eye onClick={() => viewPayment(payment)} className="cursor-pointer" />
//                           {canEdit && (
//                             <Trash2
//                               className="cursor-pointer text-red-600"
//                               onClick={() => handleDelete(payment._id)}
//                             />
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}

//                   {payments.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center text-gray-500">
//                         No payments found
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>

//               </Table>
//             )}
//           </CardContent>
//         </Card>

//         {/* PAYMENT ENTRY MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title="Record Payment" size="lg">
//           <form onSubmit={onSubmit} className="space-y-4">

//             <Select
//               label="Customer"
//               value={formData.customer}
//               onChange={(e) => handleCustomerChange(e.target.value)}
//               options={customers.map(c => ({
//                 value: c._id,
//                 label: `${c.shopName} - ${c.firstName} ${c.lastName}`,
//               }))}
//             />

//             {customerBills.length > 0 && (
//               <Select
//                 label="Bill"
//                 value={formData.bill}
//                 onChange={(e) => handleBillChange(e.target.value)}
//                 options={customerBills.map(b => ({
//                   value: b._id,
//                   label: `${b.billId} - Due: ${formatCurrency(b.dueAmount)}`
//                 }))}
//               />
//             )}

//             {customerBills.length === 0 && formData.customer && (
//               <div className="p-3 bg-gray-100 text-gray-700 rounded">
//                 No unpaid bills for this customer
//               </div>
//             )}

//             <Input
//               label="Amount"
//               type="number"
//               step="0.01"
//               value={formData.amount}
//               onChange={(e) =>
//                 setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))
//               }
//             />

//             <Select
//               label="Payment Mode"
//               value={formData.modeOfPayment}
//               onChange={(e) => setFormData(prev => ({ ...prev, modeOfPayment: e.target.value }))}
//               options={[
//                 { value: 'Cash', label: 'Cash' },
//                 { value: 'UPI', label: 'UPI' },
//                 { value: 'Net Banking', label: 'Net Banking' },
//                 { value: 'Cheque', label: 'Cheque' },
//                 { value: 'Card', label: 'Card' },
//               ]}
//             />

//             <Input
//               label="Transaction Date"
//               type="date"
//               value={formData.transactionDate}
//               onChange={(e) =>
//                 setFormData(prev => ({ ...prev, transactionDate: e.target.value }))
//               }
//             />

//             <Input
//               label="Notes"
//               value={formData.notes}
//               onChange={(e) =>
//                 setFormData(prev => ({ ...prev, notes: e.target.value }))
//               }
//             />

//             <div className="flex justify-end gap-3">
//               <Button variant="secondary" type="button" onClick={closeModal}>
//                 Cancel
//               </Button>
//               <Button type="submit" isLoading={isSubmitting} disabled={!formData.bill}>
//                 Record Payment
//               </Button>
//             </div>

//           </form>
//         </Modal>

//         {/* VIEW PAYMENT MODAL */}
//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Details">
//           {selectedPayment && (
//             <div className="space-y-4">
//               <p><b>Transaction ID:</b> {selectedPayment.transactionId}</p>
//               <p><b>Date:</b> {formatDate(selectedPayment.transactionDate)}</p>
//               <p><b>Customer:</b> {selectedPayment.customer?.shopName}</p>
//               <p><b>Bill:</b> {selectedPayment.bill?.billId}</p>
//               <p><b>Amount:</b> {formatCurrency(selectedPayment.amount)}</p>
//               <p><b>Mode:</b> {selectedPayment.modeOfPayment}</p>
//               {selectedPayment.notes && <p><b>Notes:</b> {selectedPayment.notes}</p>}
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
// import { paymentsAPI, customersAPI, billsAPI } from '@/lib/api';
// import { Payment, Customer, Bill } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Eye, Trash2 } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';


// export default function PaymentsPage() {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [customerBills, setCustomerBills] = useState<Bill[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     bill: '',
//     amount: 0,
//     modeOfPayment: '',
//     transactionDate: new Date().toISOString().split('T')[0],
//     notes: '',
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [paymentsRes, customersRes] = await Promise.all([
//         paymentsAPI.getAll(),
//         customersAPI.getAll(),
//       ]);
//       setPayments(paymentsRes.data);
//       setCustomers(customersRes.data);
//     } catch (error) {
//       console.error('Error loading:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCustomerBills = async (customerId: string) => {
//     console.log('Loading bills for customer:', customerId);
//     try {
//       const res = await billsAPI.getByCustomer(customerId);
//       // Sort bills by creation date ascending
//       console.log('Fetched Bills:', res.data);
//       const sortedBills = res.data.sort(
//         (a, b) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime()
//       );
//       setCustomerBills(sortedBills);

//       // Auto-select first pending bill
//       const firstPending = sortedBills.find(b => b.dueAmount > 0);
//       if (firstPending) {
//         setFormData(prev => ({
//           ...prev,
//           bill: firstPending._id,
//           amount: firstPending.dueAmount,
//         }));
//       } else {
//         setFormData(prev => ({ ...prev, bill: '', amount: 0 }));
//       }
//     } catch (error) {
//       console.error('Error loading bills:', error);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       bill: '',
//       amount: 0,
//       modeOfPayment: '',
//       transactionDate: new Date().toISOString().split('T')[0],
//       notes: '',
//     });
//     setCustomerBills([]);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const viewPayment = (payment: Payment) => {
//     setSelectedPayment(payment);
//     setIsViewModalOpen(true);
//   };

//   const handleCustomerChange = (customerId: string) => {
//     setFormData(prev => ({ ...prev, customer: customerId, bill: '', amount: 0 }));
//     console.log('Customer changed to:', customerId);
//     if (customerId) loadCustomerBills(customerId);
//     else setCustomerBills([]);
//   };

//   const handleBillChange = (billId: string) => {
//     const bill = customerBills.find(b => b._id === billId);
//     setFormData(prev => ({
//       ...prev,
//       bill: billId,
//       amount: bill?.dueAmount || 0,
//     }));
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.bill) return;

//     try {
//       setIsSubmitting(true);
//       await paymentsAPI.create(formData);
//       await loadData();
//       closeModal();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error recording payment');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this payment? Bill status will be affected.")) return;
//     try {
//       await paymentsAPI.delete(id);
//       await loadData();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error deleting payment');
//     }
//   };

//   const getModeColor = (mode: string) => {
//     const colors: any = {
//       Cash: 'success',
//       UPI: 'info',
//       'Net Banking': 'info',
//       Cheque: 'warning',
//       Card: 'default',
//     };
//     return colors[mode] || 'default';
//   };

//   const canEdit = hasRole(['Admin', 'Sales Man']);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">

//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Payments</h1>
//           {canEdit && (
//             <Button onClick={openModal} className="flex items-center gap-2">
//               <Plus className="h-4 w-4" /> Record Payment
//             </Button>
//           )}
//         </div>

//         {/* PAYMENTS TABLE */}
//         <Card className="animate-fadeIn">
//           <CardContent>
//             {loading ? (
//               <div className="py-8 text-center">Loading...</div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Txn ID</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Bill</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Mode</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {payments.map(payment => (
//                     <TableRow key={payment._id} className="hover:bg-gray-50 transition-all duration-300">
//                       <TableCell>{payment.transactionId}</TableCell>
//                       <TableCell>{formatDate(payment.transactionDate)}</TableCell>
//                       <TableCell>
//                         <p>{payment.customer?.shopName}</p>
//                         <p className="text-sm text-gray-500">{payment.customer?.firstName} {payment.customer?.lastName}</p>
//                       </TableCell>
//                       <TableCell>{payment.bill?.billId}</TableCell>
//                       <TableCell className="text-green-600 font-medium">{formatCurrency(payment.amount)}</TableCell>
//                       <TableCell>
//                         <Badge variant={getModeColor(payment.modeOfPayment)}>
//                           {payment.modeOfPayment}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Eye className="cursor-pointer text-blue-600 hover:text-blue-800 transition-all" onClick={() => viewPayment(payment)} />
//                           {canEdit && (
//                             <Trash2 className="cursor-pointer text-red-600 hover:text-red-800 transition-all" onClick={() => handleDelete(payment._id)} />
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {payments.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center text-gray-500">No payments found</TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </Card>

//         {/* PAYMENT FORM MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title="Record Payment" size="lg">
//           <form onSubmit={onSubmit} className="space-y-4">
//             <Select
//               label="Customer"
//               value={formData.customer}
//               onChange={(e) => handleCustomerChange(e.target.value)}
//               options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}

//             />

//             {customerBills.length > 0 && (
//               <Select
//                 label="Bill"
//                 value={formData.bill}
//                 onChange={(e) => handleBillChange(e.target.value)}
//                 options={customerBills
//                   .filter(b => b.dueAmount > 0) // only unpaid bills
//                   .map(b => ({
//                     value: b._id,
//                     label: `${b.billId} - Due: ${formatCurrency(b.dueAmount)}`,
//                   }))
//                 }
//               />
//             )}

//             {customerBills.length === 0 && formData.customer && (
//               <div className="p-3 bg-gray-100 text-gray-700 rounded">No unpaid bills for this customer</div>
//             )}

//             <Input
//               label="Amount"
//               type="number"
              
//               value={formData.amount}
//               onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
//             />

//             <Select
//               label="Payment Mode"
//               value={formData.modeOfPayment}
//               onChange={(e) => setFormData(prev => ({ ...prev, modeOfPayment: e.target.value }))}
//               options={[
//                 { value: 'Cash', label: 'Cash' },
//                 { value: 'UPI', label: 'UPI' },
//                 { value: 'Net Banking', label: 'Net Banking' },
//                 { value: 'Cheque', label: 'Cheque' },
//                 { value: 'Card', label: 'Card' },
//               ]}
//             />

//             <Input
//               label="Transaction Date"
//               type="date"
//               value={formData.transactionDate}
//               onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
//             />

//             <Input
//               label="Notes"
//               value={formData.notes}
//               onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
//             />

//             <div className="flex justify-end gap-3">
//               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
//               <Button type="submit" isLoading={isSubmitting} disabled={!formData.bill}>Record Payment</Button>
//             </div>
//           </form>
//         </Modal>

//         {/* VIEW PAYMENT MODAL */}
//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Details">
//           {selectedPayment && (
//             <div className="space-y-2">
//               <p><b>Transaction ID:</b> {selectedPayment.transactionId}</p>
//               <p><b>Date:</b> {formatDate(selectedPayment.transactionDate)}</p>
//               <p><b>Customer:</b> {selectedPayment.customer?.shopName}</p>
//               <p><b>Bill:</b> {selectedPayment.bill?.billId}</p>
//               <p><b>Amount:</b> {formatCurrency(selectedPayment.amount)}</p>
//               <p><b>Mode:</b> {selectedPayment.modeOfPayment}</p>
//               {selectedPayment.notes && <p><b>Notes:</b> {selectedPayment.notes}</p>}
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
// import { paymentsAPI, customersAPI, billsAPI } from '@/lib/api';
// import { Payment, Customer, Bill } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Eye, Trash2 } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';


// export default function PaymentsPage() {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [customerBills, setCustomerBills] = useState<Bill[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     bill: '',
//     amount: 0,
//     modeOfPayment: '',
//     transactionDate: new Date().toISOString().split('T')[0],
//     notes: '',
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [paymentsRes, customersRes] = await Promise.all([
//         paymentsAPI.getAll(),
//         customersAPI.getAll(),
//       ]);
//       setPayments(paymentsRes.data);
//       setCustomers(customersRes.data);
//     } catch (error) {
//       console.error('Error loading:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCustomerBills = async (customerId: string) => {
//     console.log('Loading bills for customer:', customerId);
//     try {
//       const res = await billsAPI.getByCustomer(customerId);
//       // Sort bills by creation date ascending
//       console.log('Fetched Bills:', res.data);
//       const sortedBills = res.data.sort(
//         (a, b) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime()
//       );
//       setCustomerBills(sortedBills);

//       // Auto-select first pending bill
//       const firstPending = sortedBills.find(b => b.dueAmount > 0);
//       if (firstPending) {
//         setFormData(prev => ({
//           ...prev,
//           bill: firstPending._id,
//           // FIX: Ensure amount is set to a valid number (dueAmount)
//           amount: firstPending.dueAmount || 0,
//         }));
//       } else {
//         setFormData(prev => ({ ...prev, bill: '', amount: 0 }));
//       }
//     } catch (error) {
//       console.error('Error loading bills:', error);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       bill: '',
//       amount: 0,
//       modeOfPayment: '',
//       transactionDate: new Date().toISOString().split('T')[0],
//       notes: '',
//     });
//     setCustomerBills([]);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const viewPayment = (payment: Payment) => {
//     setSelectedPayment(payment);
//     setIsViewModalOpen(true);
//   };

//   const handleCustomerChange = (customerId: string) => {
//     setFormData(prev => ({ ...prev, customer: customerId, bill: '', amount: 0 }));
//     console.log('Customer changed to:', customerId);
//     if (customerId) loadCustomerBills(customerId);
//     else setCustomerBills([]);
//   };

//   const handleBillChange = (billId: string) => {
//     const bill = customerBills.find(b => b._id === billId);
//     setFormData(prev => ({
//       ...prev,
//       bill: billId,
//       // FIX: Ensure dueAmount is set as a number, defaulting to 0
//       amount: bill?.dueAmount || 0,
//     }));
//   };

//   const handleAmountChange = (value: string) => {
//     // FIX: Safely convert input string to float for amount
//     const newAmount = parseFloat(value) || 0;
//     setFormData(prev => ({ ...prev, amount: newAmount }));
//   }


//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.bill) {
//       alert("Please select a bill.");
//       return;
//     }
    
//     // Additional Frontend Validation to catch the backend error condition
//     if (formData.amount <= 0) {
//       alert("Amount must be greater than 0.");
//       return;
//     }


//     try {
//       setIsSubmitting(true);
//       await paymentsAPI.create(formData);
//       await loadData();
//       closeModal();
//     } catch (error: any) {
//       // FIX: Display the actual message from backend validation errors
//       const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Error recording payment';
//       alert(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this payment? Bill status will be affected.")) return;
//     try {
//       await paymentsAPI.delete(id);
//       await loadData();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error deleting payment');
//     }
//   };

//   const getModeColor = (mode: string) => {
//     const colors: any = {
//       Cash: 'success',
//       UPI: 'info',
//       'Net Banking': 'info',
//       Cheque: 'warning',
//       Card: 'default',
//     };
//     return colors[mode] || 'default';
//   };

//   const canEdit = hasRole(['Admin', 'Sales Man']);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">

//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Payments</h1>
//           {canEdit && (
//             <Button onClick={openModal} className="flex items-center gap-2">
//               <Plus className="h-4 w-4" /> Record Payment
//             </Button>
//           )}
//         </div>

//         {/* PAYMENTS TABLE */}
//         <Card className="animate-fadeIn">
//           <CardContent>
//             {loading ? (
//               <div className="py-8 text-center">Loading...</div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Txn ID</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Bill</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Mode</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {payments.map(payment => (
//                     <TableRow key={payment._id} className="hover:bg-gray-50 transition-all duration-300">
//                       <TableCell>{payment.transactionId}</TableCell>
//                       <TableCell>{formatDate(payment.transactionDate)}</TableCell>
//                       <TableCell>
//                         <p>{payment.customer?.shopName}</p>
//                         <p className="text-sm text-gray-500">{payment.customer?.firstName} {payment.customer?.lastName}</p>
//                       </TableCell>
//                       <TableCell>{payment.bill?.billId}</TableCell>
//                       <TableCell className="text-green-600 font-medium">{formatCurrency(payment.amount)}</TableCell>
//                       <TableCell>
//                         <Badge variant={getModeColor(payment.modeOfPayment)}>
//                           {payment.modeOfPayment}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Eye className="cursor-pointer text-blue-600 hover:text-blue-800 transition-all" onClick={() => viewPayment(payment)} />
//                           {canEdit && (
//                             <Trash2 className="cursor-pointer text-red-600 hover:text-red-800 transition-all" onClick={() => handleDelete(payment._id)} />
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {payments.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center text-gray-500">No payments found</TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </Card>

//         {/* PAYMENT FORM MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title="Record Payment" size="lg">
//           <form onSubmit={onSubmit} className="space-y-4">
//             <Select
//               label="Customer"
//               value={formData.customer}
//               onChange={(e) => handleCustomerChange(e.target.value)}
//               options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}

//             />

//             {customerBills.length > 0 && (
//               <Select
//                 label="Bill"
//                 value={formData.bill}
//                 onChange={(e) => handleBillChange(e.target.value)}
//                 options={customerBills
//                   .filter(b => b.dueAmount > 0) // only unpaid bills
//                   .map(b => ({
//                     value: b._id,
//                     label: `${b.billId} - Due: ${formatCurrency(b.dueAmount)}`,
//                   }))
//                 }
//               />
//             )}

//             {customerBills.length === 0 && formData.customer && (
//               <div className="p-3 bg-gray-100 text-gray-700 rounded">No unpaid bills for this customer</div>
//             )}

//             <Input
//               label="Amount"
//               type="number"
//               // Ensure value is displayed as string for input compatibility
//               value={formData.amount.toString()} 
//               onChange={(e) => handleAmountChange(e.target.value)}
//               step="0.01" // Allow floating point numbers
//             />

//             <Select
//               label="Payment Mode"
//               value={formData.modeOfPayment}
//               onChange={(e) => setFormData(prev => ({ ...prev, modeOfPayment: e.target.value }))}
//               options={[
//                 { value: 'Cash', label: 'Cash' },
//                 { value: 'UPI', label: 'UPI' },
//                 { value: 'Net Banking', label: 'Net Banking' },
//                 { value: 'Cheque', label: 'Cheque' },
//                 { value: 'Card', label: 'Card' },
//               ]}
//             />

//             <Input
//               label="Transaction Date"
//               type="date"
//               value={formData.transactionDate}
//               onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
//             />

//             <Input
//               label="Notes"
//               value={formData.notes}
//               onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
//             />

//             <div className="flex justify-end gap-3">
//               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
//               <Button type="submit" isLoading={isSubmitting} disabled={!formData.bill || formData.amount <= 0}>Record Payment</Button>
//             </div>
//           </form>
//         </Modal>

//         {/* VIEW PAYMENT MODAL */}
//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Details">
//           {selectedPayment && (
//             <div className="space-y-2">
//               <p><b>Transaction ID:</b> {selectedPayment.transactionId}</p>
//               <p><b>Date:</b> {formatDate(selectedPayment.transactionDate)}</p>
//               <p><b>Customer:</b> {selectedPayment.customer?.shopName}</p>
//               <p><b>Bill:</b> {selectedPayment.bill?.billId}</p>
//               <p><b>Amount:</b> {formatCurrency(selectedPayment.amount)}</p>
//               <p><b>Mode:</b> {selectedPayment.modeOfPayment}</p>
//               {selectedPayment.notes && <p><b>Notes:</b> {selectedPayment.notes}</p>}
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
// import { paymentsAPI, customersAPI, billsAPI } from '@/lib/api';
// import { Payment, Customer, Bill } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Eye, Trash2 } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';


// export default function PaymentsPage() {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [customerBills, setCustomerBills] = useState<Bill[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     bill: '',
//     amount: 0,
//     modeOfPayment: '',
//     transactionDate: new Date().toISOString().split('T')[0],
//     notes: '',
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [paymentsRes, customersRes] = await Promise.all([
//         paymentsAPI.getAll(),
//         customersAPI.getAll(),
//       ]);
//       setPayments(paymentsRes.data);
//       setCustomers(customersRes.data);
//     } catch (error) {
//       console.error('Error loading:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCustomerBills = async (customerId: string) => {
//     try {
//       const res = await billsAPI.getByCustomer(customerId);
      
//       const allBills = res.data;
      
//       // 1. Filter only bills with a due amount and sort by date (oldest first)
//       const outstandingBills = allBills
//         .filter(b => b.dueAmount > 0)
//         .sort((a, b) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime());

//       let billsToShow: Bill[] = [];
//       let firstPendingBill: Bill | undefined;

//       // 2. Apply backend sequential payment logic:
//       if (outstandingBills.length > 0) {
//         firstPendingBill = outstandingBills[0];
//         // If there's more than one outstanding bill, the backend only allows payment 
//         // against the oldest one (firstPendingBill).
//         if (outstandingBills.length > 1) {
//              // Only show the oldest bill (which the backend requires to be paid first)
//              billsToShow = [firstPendingBill];
//         } else {
//             // If only one bill is outstanding, show it.
//             billsToShow = outstandingBills;
//         }
//       }
      
//       setCustomerBills(billsToShow);

//       // 3. Auto-select the bill and set amount
//       if (firstPendingBill) {
//         setFormData(prev => ({
//           ...prev,
//           bill: firstPendingBill!._id,
//           amount: firstPendingBill!.dueAmount || 0,
//         }));
//       } else {
//         setFormData(prev => ({ ...prev, bill: '', amount: 0 }));
//       }
      
//     } catch (error) {
//       console.error('Error loading bills:', error);
//       setCustomerBills([]);
//       setFormData(prev => ({ ...prev, bill: '', amount: 0 }));
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       bill: '',
//       amount: 0,
//       modeOfPayment: '',
//       transactionDate: new Date().toISOString().split('T')[0],
//       notes: '',
//     });
//     setCustomerBills([]);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const viewPayment = (payment: Payment) => {
//     setSelectedPayment(payment);
//     setIsViewModalOpen(true);
//   };

//   const handleCustomerChange = (customerId: string) => {
//     setFormData(prev => ({ ...prev, customer: customerId, bill: '', amount: 0 }));
//     if (customerId) loadCustomerBills(customerId);
//     else setCustomerBills([]);
//   };

//   const handleBillChange = (billId: string) => {
//     const bill = customerBills.find(b => b._id === billId);
//     setFormData(prev => ({
//       ...prev,
//       bill: billId,
//       amount: bill?.dueAmount || 0,
//     }));
//   };
  
//   const handleAmountChange = (value: string) => {
//     // Safely convert input string to float for amount
//     const newAmount = parseFloat(value) || 0;
//     setFormData(prev => ({ ...prev, amount: newAmount }));
//   }


//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Front-end sanity checks
//     if (!formData.bill) {
//       alert("Please select a bill.");
//       return;
//     }
//     if (formData.amount <= 0) {
//       alert("Amount must be greater than 0.");
//       return;
//     }


//     try {
//       setIsSubmitting(true);
//       await paymentsAPI.create(formData);
//       await loadData();
//       closeModal();
//     } catch (error: any) {
//       // Display the actual message from backend validation errors
//       const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Error recording payment';
//       alert(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this payment? Bill status will be affected.")) return;
//     try {
//       await paymentsAPI.delete(id);
//       await loadData();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error deleting payment');
//     }
//   };

//   const getModeColor = (mode: string) => {
//     const colors: any = {
//       Cash: 'success',
//       UPI: 'info',
//       'Net Banking': 'info',
//       Cheque: 'warning',
//       Card: 'default',
//     };
//     return colors[mode] || 'default';
//   };

//   const canEdit = hasRole(['Admin', 'Sales Man']);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">

//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Payments</h1>
//           {canEdit && (
//             <Button onClick={openModal} className="flex items-center gap-2">
//               <Plus className="h-4 w-4" /> Record Payment
//             </Button>
//           )}
//         </div>

//         {/* PAYMENTS TABLE */}
//         <Card className="animate-fadeIn">
//           <CardContent>
//             {loading ? (
//               <div className="py-8 text-center">Loading...</div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Txn ID</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Bill</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Mode</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {payments.map(payment => (
//                     <TableRow key={payment._id} className="hover:bg-gray-50 transition-all duration-300">
//                       <TableCell>{payment.transactionId}</TableCell>
//                       <TableCell>{formatDate(payment.transactionDate)}</TableCell>
//                       <TableCell>
//                         <p>{payment.customer?.shopName}</p>
//                         <p className="text-sm text-gray-500">{payment.customer?.firstName} {payment.customer?.lastName}</p>
//                       </TableCell>
//                       <TableCell>{payment.bill?.billId}</TableCell>
//                       <TableCell className="text-green-600 font-medium">{formatCurrency(payment.amount)}</TableCell>
//                       <TableCell>
//                         <Badge variant={getModeColor(payment.modeOfPayment)}>
//                           {payment.modeOfPayment}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Eye className="cursor-pointer text-blue-600 hover:text-blue-800 transition-all" onClick={() => viewPayment(payment)} />
//                           {canEdit && (
//                             <Trash2 className="cursor-pointer text-red-600 hover:text-red-800 transition-all" onClick={() => handleDelete(payment._id)} />
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {payments.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center text-gray-500">No payments found</TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </Card>

//         {/* PAYMENT FORM MODAL */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title="Record Payment" size="lg">
//           <form onSubmit={onSubmit} className="space-y-4">
//             <Select
//               label="Customer"
//               value={formData.customer}
//               onChange={(e) => handleCustomerChange(e.target.value)}
//               options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}

//             />

//             {customerBills.length > 0 && (
//               <Select
//                 label="Bill"
//                 value={formData.bill}
//                 onChange={(e) => handleBillChange(e.target.value)}
//                 options={customerBills
//                   .map(b => ({
//                     value: b._id,
//                     label: `${b.billId} - Due: ${formatCurrency(b.dueAmount)}`,
//                   }))
//                 }
//               />
//             )}

//             {customerBills.length === 0 && formData.customer && (
//               <div className="p-3 bg-gray-100 text-gray-700 rounded">
//                 No unpaid bills for this customer.
//                 {/* Check for the specific backend sequential rule error state */}
//                 {customerBills.length === 0 && customerBills.some(b => b.dueAmount > 0) && (
//                      <p className="mt-1 text-sm text-red-600">
//                         Note: Only the oldest outstanding bill is available for payment due to sequential payment rules.
//                      </p>
//                 )}
//               </div>
//             )}

//             <Input
//               label="Amount"
//               type="number"
//               value={formData.amount.toString()} 
//               onChange={(e) => handleAmountChange(e.target.value)}
//               step="0.01" 
//             />

//             <Select
//               label="Payment Mode"
//               value={formData.modeOfPayment}
//               onChange={(e) => setFormData(prev => ({ ...prev, modeOfPayment: e.target.value }))}
//               options={[
//                 { value: 'Cash', label: 'Cash' },
//                 { value: 'UPI', label: 'UPI' },
//                 { value: 'Net Banking', label: 'Net Banking' },
//                 { value: 'Cheque', label: 'Cheque' },
//                 { value: 'Card', label: 'Card' },
//               ]}
//             />

//             <Input
//               label="Transaction Date"
//               type="date"
//               value={formData.transactionDate}
//               onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
//             />

//             <Input
//               label="Notes"
//               value={formData.notes}
//               onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
//             />

//             <div className="flex justify-end gap-3">
//               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
//               <Button type="submit" isLoading={isSubmitting} disabled={!formData.bill || formData.amount <= 0}>Record Payment</Button>
//             </div>
//           </form>
//         </Modal>

//         {/* VIEW PAYMENT MODAL */}
//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Details">
//           {selectedPayment && (
//             <div className="space-y-2">
//               <p><b>Transaction ID:</b> {selectedPayment.transactionId}</p>
//               <p><b>Date:</b> {formatDate(selectedPayment.transactionDate)}</p>
//               <p><b>Customer:</b> {selectedPayment.customer?.shopName}</p>
//               <p><b>Bill:</b> {selectedPayment.bill?.billId}</p>
//               <p><b>Amount:</b> {formatCurrency(selectedPayment.amount)}</p>
//               <p><b>Mode:</b> {selectedPayment.modeOfPayment}</p>
//               {selectedPayment.notes && <p><b>Notes:</b> {selectedPayment.notes}</p>}
//             </div>
//           )}
//         </Modal>

//       </div>
//     </DashboardLayout>
//   );
// }

'use client';

import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { paymentsAPI, customersAPI, billsAPI } from '@/lib/api';
import { Payment, Customer, Bill } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';


export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  // customerBills will now store ALL outstanding bills
  const [customerBills, setCustomerBills] = useState<Bill[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasRole } = useAuth();

  const [formData, setFormData] = useState({
    customer: '',
    bill: '',
    amount: 0,
    modeOfPayment: '',
    transactionDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  
  // State for showing sequential payment error in UI
  const [sequentialPaymentError, setSequentialPaymentError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsRes, customersRes] = await Promise.all([
        paymentsAPI.getAll(),
        customersAPI.getAll(),
      ]);
      setPayments(paymentsRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerBills = async (customerId: string) => {
    try {
      const res = await billsAPI.getByCustomer(customerId);
      
      // 1. Filter only bills with a due amount and sort by date (oldest first)
      const outstandingBills = res.data
        .filter(b => b.dueAmount > 0)
        .sort((a, b) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime());

      // Store ALL outstanding bills for display
      setCustomerBills(outstandingBills);

      // 2. Auto-select the oldest bill and set amount if available
      const firstPendingBill = outstandingBills.length > 0 ? outstandingBills[0] : null;
      
      if (firstPendingBill) {
        setFormData(prev => ({
          ...prev,
          bill: firstPendingBill._id,
          amount: firstPendingBill.dueAmount || 0,
        }));
      } else {
        setFormData(prev => ({ ...prev, bill: '', amount: 0 }));
      }
      
      setSequentialPaymentError(null); // Clear error on load
      
    } catch (error) {
      console.error('Error loading bills:', error);
      setCustomerBills([]);
      setFormData(prev => ({ ...prev, bill: '', amount: 0 }));
      setSequentialPaymentError(null);
    }
  };

  // Find the ID of the single bill that is eligible for payment
  const firstUnpaidBillId = useMemo(() => {
    // outstandingBills is already sorted by date (oldest first)
    const outstandingBills = customerBills.filter(b => b.dueAmount > 0);
    if (outstandingBills.length > 0) {
      return outstandingBills[0]._id;
    }
    return null;
  }, [customerBills]);


  const openModal = () => {
    setFormData({
      customer: '',
      bill: '',
      amount: 0,
      modeOfPayment: '',
      transactionDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setCustomerBills([]);
    setSequentialPaymentError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const viewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const handleCustomerChange = (customerId: string) => {
    setFormData(prev => ({ ...prev, customer: customerId, bill: '', amount: 0 }));
    setSequentialPaymentError(null);
    if (customerId) loadCustomerBills(customerId);
    else setCustomerBills([]);
  };

  const handleBillChange = (billId: string) => {
    const bill = customerBills.find(b => b._id === billId);
    
    // UI Logic Check for Sequential Payment
    if (firstUnpaidBillId && billId !== firstUnpaidBillId) {
        const firstBill = customerBills.find(b => b._id === firstUnpaidBillId);
        setSequentialPaymentError(`Payment for this bill is restricted. Please pay Bill ${firstBill?.billId} first.`);
        // Set the bill ID, but leave amount to the due amount for UI clarity, 
        // the form submission will still be blocked by the error.
    } else {
        setSequentialPaymentError(null);
    }
    
    setFormData(prev => ({
      ...prev,
      bill: billId,
      amount: bill?.dueAmount || 0,
    }));
  };
  
  const handleAmountChange = (value: string) => {
    // Safely convert input string to float for amount
    const newAmount = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, amount: newAmount }));
  }


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frontend sanity checks
    if (!formData.bill) {
      alert("Please select a bill.");
      return;
    }
    if (formData.amount <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }
    // Final check for the sequential payment rule before hitting the backend
    if (firstUnpaidBillId && formData.bill !== firstUnpaidBillId) {
        const firstBill = customerBills.find(b => b._id === firstUnpaidBillId);
        alert(`Payment rejected. The backend requires Bill ${firstBill?.billId} to be paid first.`);
        return;
    }


    try {
      setIsSubmitting(true);
      await paymentsAPI.create(formData);
      await loadData();
      closeModal();
    } catch (error: any) {
      // Display the actual message from backend validation errors
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Error recording payment';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payment? Bill status will be affected.")) return;
    try {
      await paymentsAPI.delete(id);
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error deleting payment');
    }
  };

  const getModeColor = (mode: string) => {
    const colors: any = {
      Cash: 'success',
      UPI: 'info',
      'Net Banking': 'info',
      Cheque: 'warning',
      Card: 'default',
    };
    return colors[mode] || 'default';
  };

  const canEdit = hasRole(['Admin', 'Sales Man']);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Payments</h1>
          {canEdit && (
            <Button onClick={openModal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Record Payment
            </Button>
          )}
        </div>

        {/* PAYMENTS TABLE */}
        <Card className="animate-fadeIn">
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Txn ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Bill</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {payments.map(payment => (
                    <TableRow key={payment._id} className="hover:bg-gray-50 transition-all duration-300">
                      <TableCell>{payment.transactionId}</TableCell>
                      <TableCell>{formatDate(payment.transactionDate)}</TableCell>
                      <TableCell>
                        <p>{payment.customer?.shopName}</p>
                        <p className="text-sm text-gray-500">{payment.customer?.firstName} {payment.customer?.lastName}</p>
                      </TableCell>
                      <TableCell>{payment.bill?.billId}</TableCell>
                      <TableCell className="text-green-600 font-medium">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={getModeColor(payment.modeOfPayment)}>
                          {payment.modeOfPayment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Eye className="cursor-pointer text-blue-600 hover:text-blue-800 transition-all" onClick={() => viewPayment(payment)} />
                          {canEdit && (
                            <Trash2 className="cursor-pointer text-red-600 hover:text-red-800 transition-all" onClick={() => handleDelete(payment._id)} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">No payments found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* PAYMENT FORM MODAL */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Record Payment" size="lg">
          <form onSubmit={onSubmit} className="space-y-4">
            <Select
              label="Customer"
              value={formData.customer}
              onChange={(e) => handleCustomerChange(e.target.value)}
              options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}

            />

            {customerBills.length > 0 && (
              <Select
                label="Bill"
                value={formData.bill}
                onChange={(e) => handleBillChange(e.target.value)}
                options={[
                    { value: '', label: 'Select Bill' }, 
                    ...customerBills.map(b => ({
                        value: b._id,
                        label: `${b.billId} - Due: ${formatCurrency(b.dueAmount)}`,
                        // Disable non-eligible bills in the dropdown
                        disabled: firstUnpaidBillId && b._id !== firstUnpaidBillId
                    }))
                ]}
              />
            )}

            {customerBills.length === 0 && formData.customer && (
              <div className="p-3 bg-gray-100 text-gray-700 rounded">
                No outstanding bills for this customer.
              </div>
            )}
            
            {/* Sequential Payment Error Message */}
            {sequentialPaymentError && (
                 <div className="p-3 bg-red-100 text-red-700 rounded font-medium">
                    {sequentialPaymentError}
                 </div>
            )}

            <Input
              label="Amount"
              type="number"
              value={formData.amount.toString()} 
              onChange={(e) => handleAmountChange(e.target.value)}
              step="0.01" 
              // Disable amount input if an invalid bill is selected
              disabled={!!sequentialPaymentError}
            />

            <Select
              label="Payment Mode"
              value={formData.modeOfPayment}
              onChange={(e) => setFormData(prev => ({ ...prev, modeOfPayment: e.target.value }))}
              options={[
                { value: 'Cash', label: 'Cash' },
                { value: 'UPI', label: 'UPI' },
                { value: 'Net Banking', label: 'Net Banking' },
                { value: 'Cheque', label: 'Cheque' },
                { value: 'Card', label: 'Card' },
              ]}
              // Disable mode input if an invalid bill is selected
              disabled={!!sequentialPaymentError}
            />

            <Input
              label="Transaction Date"
              type="date"
              value={formData.transactionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, transactionDate: e.target.value }))}
              disabled={!!sequentialPaymentError}
            />

            <Input
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              disabled={!!sequentialPaymentError}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button 
                type="submit" 
                isLoading={isSubmitting} 
                // Final submission disabled if: no bill, amount is zero/negative, OR sequential error is active
                disabled={!formData.bill || formData.amount <= 0 || !!sequentialPaymentError}
              >
                Record Payment
              </Button>
            </div>
          </form>
        </Modal>

        {/* VIEW PAYMENT MODAL */}
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Details">
          {selectedPayment && (
            <div className="space-y-2">
              <p><b>Transaction ID:</b> {selectedPayment.transactionId}</p>
              <p><b>Date:</b> {formatDate(selectedPayment.transactionDate)}</p>
              <p><b>Customer:</b> {selectedPayment.customer?.shopName}</p>
              <p><b>Bill:</b> {selectedPayment.bill?.billId}</p>
              <p><b>Amount:</b> {formatCurrency(selectedPayment.amount)}</p>
              <p><b>Mode:</b> {selectedPayment.modeOfPayment}</p>
              {selectedPayment.notes && <p><b>Notes:</b> {selectedPayment.notes}</p>}
            </div>
          )}
        </Modal>

      </div>
    </DashboardLayout>
  );
}
// ... (The API and Backend router code remains unchanged)