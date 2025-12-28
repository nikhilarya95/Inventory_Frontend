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
import { Plus, Eye, Trash2, Edit, Search, Filter, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';


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
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredPayments = useMemo(() => {
    return payments.filter(p =>
      (filterMode === 'All' || p.modeOfPayment === filterMode) &&
      (searchField === 'All' ? (
        (p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.customer?.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.customer?.firstName + ' ' + p.customer?.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.bill?.billId?.toLowerCase().includes(searchQuery.toLowerCase()))
      ) : searchField === 'Transaction ID' ? (
        p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
      ) : searchField === 'Customer' ? (
        (p.customer?.firstName + ' ' + p.customer?.lastName).toLowerCase().includes(searchQuery.toLowerCase())
      ) : searchField === 'Shop' ? (
        p.customer?.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
      ) : searchField === 'Bill ID' ? (
        p.bill?.billId?.toLowerCase().includes(searchQuery.toLowerCase())
      ) : true)
    );
  }, [payments, filterMode, searchField, searchQuery]);

  const paginatedPayments = useMemo(() => {
    return filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

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
        .filter((b: Bill) => b.dueAmount > 0)
        .sort((a: Bill, b: Bill) => new Date(a.billDate).getTime() - new Date(b.billDate).getTime());

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
    setSelectedPayment(null);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
    setStatusMessage(null);
  };

  const openEditModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      customer: payment.customer?._id || '',
      bill: payment.bill?._id || '',
      amount: payment.amount,
      modeOfPayment: payment.modeOfPayment,
      transactionDate: payment.transactionDate ? payment.transactionDate.split('T')[0] : new Date().toISOString().split('T')[0],
      notes: payment.notes || '',
    });
    if (payment.bill) {
      setCustomerBills([payment.bill]);
    }
    setSequentialPaymentError(null);
    setIsModalOpen(true);
  };

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
    setStatusMessage(null);

    // Frontend sanity checks
    if (!formData.bill) {
      setStatusMessage({ type: 'error', text: "Please select a bill." });
      return;
    }
    if (formData.amount <= 0) {
      setStatusMessage({ type: 'error', text: "Amount must be greater than 0." });
      return;
    }
    // Final check for the sequential payment rule before hitting the backend
    if (firstUnpaidBillId && formData.bill !== firstUnpaidBillId) {
      const firstBill = customerBills.find(b => b._id === firstUnpaidBillId);
      setStatusMessage({ type: 'error', text: `Payment rejected. The backend requires Bill ${firstBill?.billId} to be paid first.` });
      return;
    }


    try {
      setIsSubmitting(true);
      if (selectedPayment) {
        await paymentsAPI.update(selectedPayment._id, formData);
      } else {
        await paymentsAPI.create(formData);
      }
      await loadData();
      setStatusMessage({ type: 'success', text: 'Payment recorded successfully!' });
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error: any) {
      // Display the actual message from backend validation errors
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Error recording payment';
      setStatusMessage({ type: 'error', text: errorMessage });
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
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error deleting payment' });
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
    <DashboardLayout moduleName="Payments">
      <div className="space-y-6 w-full animate-fade-in">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-40">
            <Select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              options={[
                { value: 'All', label: 'All Fields' },
                { value: 'Transaction ID', label: 'Transaction ID' },
                { value: 'Customer', label: 'Customer Name' },
                { value: 'Shop', label: 'Shop Name' },
                { value: 'Bill ID', label: 'Bill ID' }
              ]}
              className="h-10"
            />
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              options={[
                { value: 'All', label: 'All Modes' },
                { value: 'Cash', label: 'Cash' },
                { value: 'UPI', label: 'UPI' },
                { value: 'Bank Transfer', label: 'Bank Transfer' },
                { value: 'Cheque', label: 'Cheque' }
              ]}
              className="h-10"
            />
          </div>
          {canEdit && (
            <Button
              onClick={openModal}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 h-10"
            >
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          )}
        </div>

        {/* PAYMENTS TABLE */}
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
                      <TableHead className="font-semibold text-gray-700">Txn ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                      <TableHead className="font-semibold text-gray-700">Bill</TableHead>
                      <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-700">Mode</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedPayments.map(payment => (
                      <TableRow key={payment._id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 animate-slide-up">
                        <TableCell className="font-medium text-gray-900">{payment.transactionId}</TableCell>
                        <TableCell className="text-gray-600">{formatDate(payment.transactionDate)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{payment.customer?.shopName}</span>
                            <span className="text-xs text-gray-500">{payment.customer?.firstName} {payment.customer?.lastName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{payment.bill?.billId}</TableCell>
                        <TableCell className="text-green-600 font-bold">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={getModeColor(payment.modeOfPayment)}>
                            {payment.modeOfPayment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewPayment(payment)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {hasRole(['Admin']) && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditModal(payment)}
                                  className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(payment._id)}
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {payments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center p-8">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No payments found</p>
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

        {!loading && filteredPayments.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredPayments.length}
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

      {/* PAYMENT FORM MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedPayment ? 'Edit Payment' : 'Record Payment'} size="lg">
        <form onSubmit={onSubmit} className="space-y-4">
          {statusMessage && (
            <div className={`p-4 rounded-xl text-sm font-medium border animate-fade-in ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
              {statusMessage.text}
            </div>
          )}
          <Select
            label="Customer"
            value={formData.customer}
            onChange={(e) => handleCustomerChange(e.target.value)}
            options={[{ value: '', label: 'Select Customer' }, ...customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))]}
            disabled={!!selectedPayment}
          />

          {customerBills.length > 0 && (
            <Select
              label="Bill"
              value={formData.bill}
              onChange={(e) => handleBillChange(e.target.value)}
              options={[
                { value: '', label: 'Select Bill' },
                ...customerBills.map(b => ({
                  value: b?._id,
                  label: b ? `${b.billId} - Due: ${formatCurrency(b.dueAmount)}` : '',
                  // Disable non-eligible bills in the dropdown (only for new payments)
                  disabled: !selectedPayment && firstUnpaidBillId && b?._id !== firstUnpaidBillId
                }))
              ]}
              disabled={!!selectedPayment}
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
            // Disable amount input if an invalid bill is selected OR if editing
            disabled={!!sequentialPaymentError || !!selectedPayment}
          />

          <Select
            label="Payment Mode"
            value={formData.modeOfPayment}
            onChange={(e) => setFormData(prev => ({ ...prev, modeOfPayment: e.target.value }))}
            options={[
              { value: 'Select Payment Mode', label: 'Select Payment Mode' },
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

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              // Final submission disabled if: no bill, amount is zero/negative, OR sequential error is active (only for new payments)
              disabled={!formData.bill || formData.amount <= 0 || (!selectedPayment && !!sequentialPaymentError)}
            >
              {selectedPayment ? 'Update Payment' : 'Record Payment'}
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
    </DashboardLayout>
  );
}
// ... (The API and Backend router code remains unchanged)