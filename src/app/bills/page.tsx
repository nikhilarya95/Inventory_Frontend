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
// import { billsAPI, customersAPI, productsAPI, stockAPI } from '@/lib/api';
// import { Bill, Customer, Product, Stock } from '@/types';
// import { useAuth } from '@/contexts/AuthContext';
// import { Plus, Eye, Download, Trash2 } from 'lucide-react';
// import { formatCurrency, formatDate } from '@/lib/utils';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// export default function BillsPage() {
//   const [bills, setBills] = useState<Bill[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [stocks, setStocks] = useState<Stock[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [creditCheck, setCreditCheck] = useState<any>(null);
//   const { hasRole } = useAuth();

//   const [formData, setFormData] = useState({
//     customer: '',
//     billDate: new Date().toISOString().split('T')[0],
//     items: [{ product: '', hsnNumber: '', productDetails: '', quantity: 1, mrp: 0, stock: '' }],
//   });

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [billsRes, customersRes, productsRes, stocksRes] = await Promise.all([
//         billsAPI.getAll(),
//         customersAPI.getAll(),
//         productsAPI.getAll(),
//         stockAPI.getAll(),
//       ]);
//       setBills(billsRes.data);
//       setCustomers(customersRes.data);
//       setProducts(productsRes.data);
//       setStocks(stocksRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkCustomerCredit = async (customerId: string) => {
//     try {
//       const response = await billsAPI.checkCredit(customerId);
//       setCreditCheck(response.data);
//     } catch (error) {
//       console.error('Error checking credit:', error);
//     }
//   };

//   const openModal = () => {
//     setFormData({
//       customer: '',
//       billDate: new Date().toISOString().split('T')[0],
//       items: [{ product: '', hsnNumber: '', productDetails: '', quantity: 1, mrp: 0, stock: '' }],
//     });
//     setCreditCheck(null);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCreditCheck(null);
//   };

//   const viewBill = (bill: Bill) => {
//     setSelectedBill(bill);
//     setIsViewModalOpen(true);
//   };

//   const addItem = () => {
//     setFormData({
//       ...formData,
//       items: [...formData.items, { product: '', hsnNumber: '', productDetails: '', quantity: 1, mrp: 0, stock: '' }],
//     });
//   };

//   const removeItem = (index: number) => {
//     const items = formData.items.filter((_, i) => i !== index);
//     setFormData({ ...formData, items });
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     const items = [...formData.items];
//     items[index] = { ...items[index], [field]: value };
    
//     if (field === 'product') {
//       const product = products.find(p => p._id === value);
//       if (product) {
//         items[index].hsnNumber = product.hsnNumber || '';
//         items[index].productDetails = `${product.brandName} - ${product.productName}`;
//       }
//     }
    
//     setFormData({ ...formData, items });
//   };

//   const handleCustomerChange = (customerId: string) => {
//     setFormData({ ...formData, customer: customerId });
//     if (customerId) {
//       checkCustomerCredit(customerId);
//     } else {
//       setCreditCheck(null);
//     }
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (creditCheck && !creditCheck.canCreateBill) {
//       alert(creditCheck.reason);
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       const billData = {
//         ...formData,
//         items: formData.items.map(item => ({
//           ...item,
//           amount: item.quantity * item.mrp,
//         })),
//       };
//       await billsAPI.create(billData);
//       await loadData();
//       closeModal();
//     } catch (error: any) {
//       alert(error.response?.data?.message || 'Error creating bill');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm('Are you sure you want to delete this bill?')) {
//       try {
//         await billsAPI.delete(id);
//         await loadData();
//       } catch (error: any) {
//         alert(error.response?.data?.message || 'Error deleting bill');
//       }
//     }
//   };

//   const downloadPDF = (bill: Bill) => {
//     const doc = new jsPDF();
    
//     doc.setFontSize(20);
//     doc.text(bill.companyName || 'Company Name', 105, 20, { align: 'center' });
    
//     doc.setFontSize(10);
//     doc.text(bill.companyAddress || '', 105, 28, { align: 'center' });
//     doc.text(`GST: ${bill.companyGST || 'N/A'} | Phone: ${bill.companyPhone || ''}`, 105, 34, { align: 'center' });
    
//     doc.setFontSize(16);
//     doc.text('INVOICE', 105, 48, { align: 'center' });
    
//     doc.setFontSize(10);
//     doc.text(`Bill No: ${bill.billId}`, 14, 60);
//     doc.text(`Date: ${formatDate(bill.billDate)}`, 14, 66);
    
//     doc.text('Bill To:', 120, 60);
//     doc.text(bill.customerName, 120, 66);
//     doc.text(bill.customerAddress || '', 120, 72);
//     doc.text(`GST: ${bill.customerGST || 'N/A'}`, 120, 78);
//     doc.text(`Phone: ${bill.customerPhone}`, 120, 84);

//     const tableData = bill.items.map((item, index) => [
//       index + 1,
//       item.hsnNumber || '',
//       item.productDetails,
//       item.quantity,
//       formatCurrency(item.mrp),
//       formatCurrency(item.amount),
//     ]);

//     autoTable(doc, {
//       startY: 95,
//       head: [['#', 'HSN', 'Product Details', 'Qty', 'Rate', 'Amount']],
//       body: tableData,
//       theme: 'grid',
//       headStyles: { fillColor: [59, 130, 246] },
//     });

//     const finalY = (doc as any).lastAutoTable.finalY + 10;
//     doc.text(`Total Amount: ${formatCurrency(bill.totalAmount)}`, 140, finalY);
//     doc.text(`Paid Amount: ${formatCurrency(bill.paidAmount)}`, 140, finalY + 6);
//     doc.text(`Due Amount: ${formatCurrency(bill.dueAmount)}`, 140, finalY + 12);

//     doc.save(`${bill.billId}.pdf`);
//   };

//   const getStatusBadge = (status: string) => {
//     const variants: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
//       Unpaid: 'danger',
//       Partial: 'warning',
//       Paid: 'success',
//     };
//     return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
//   };

//   const canEdit = hasRole(['Admin', 'Manager']);

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-900">Bills & Invoices</h1>
//           {canEdit && (
//             <Button onClick={openModal}>
//               <Plus className="h-4 w-4 mr-2" />
//               Create Bill
//             </Button>
//           )}
//         </div>

//         <Card>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Bill ID</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Customer</TableHead>
//                     <TableHead>Total</TableHead>
//                     <TableHead>Paid</TableHead>
//                     <TableHead>Due</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {bills.map((bill) => (
//                     <TableRow key={bill._id}>
//                       <TableCell className="font-medium">{bill.billId}</TableCell>
//                       <TableCell>{formatDate(bill.billDate)}</TableCell>
//                       <TableCell>
//                         <div>
//                           <p>{bill.customerName}</p>
//                           <p className="text-sm text-gray-500">{bill.customer?.shopName}</p>
//                         </div>
//                       </TableCell>
//                       <TableCell>{formatCurrency(bill.totalAmount)}</TableCell>
//                       <TableCell className="text-green-600">{formatCurrency(bill.paidAmount)}</TableCell>
//                       <TableCell className="text-red-600">{formatCurrency(bill.dueAmount)}</TableCell>
//                       <TableCell>{getStatusBadge(bill.status)}</TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <button onClick={() => viewBill(bill)} className="text-gray-600 hover:text-gray-800">
//                             <Eye className="h-4 w-4" />
//                           </button>
//                           <button onClick={() => downloadPDF(bill)} className="text-blue-600 hover:text-blue-800">
//                             <Download className="h-4 w-4" />
//                           </button>
//                           {canEdit && bill.paidAmount === 0 && (
//                             <button onClick={() => handleDelete(bill._id)} className="text-red-600 hover:text-red-800">
//                               <Trash2 className="h-4 w-4" />
//                             </button>
//                           )}
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {bills.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={8} className="text-center text-gray-500">No bills found</TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </Card>

//         <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Bill" size="xl">
//           <form onSubmit={onSubmit} className="space-y-4">
//             {creditCheck && !creditCheck.canCreateBill && (
//               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
//                 {creditCheck.reason}
//               </div>
//             )}
            
//             <div className="grid grid-cols-2 gap-4">
//               <Select
//                 label="Customer"
//                 value={formData.customer}
//                 onChange={(e) => handleCustomerChange(e.target.value)}
//                 options={customers.map(c => ({ value: c._id, label: `${c.shopName} - ${c.firstName} ${c.lastName}` }))}
//               />
//               <Input label="Bill Date" type="date" value={formData.billDate} onChange={(e) => setFormData({ ...formData, billDate: e.target.value })} />
//             </div>

//             {creditCheck && (
//               <div className="bg-gray-50 p-3 rounded-lg text-sm">
//                 <p>Unpaid Bills: {creditCheck.unpaidBillsCount} | Total Due: {formatCurrency(creditCheck.totalDue)} | Unpaid: {creditCheck.unpaidPercentage}%</p>
//               </div>
//             )}

//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-medium">Bill Items</h4>
//                 <Button type="button" variant="secondary" size="sm" onClick={addItem}>Add Item</Button>
//               </div>
//               {formData.items.map((item, index) => (
//                 <div key={index} className="grid grid-cols-5 gap-3 items-end">
//                   <Select
//                     label={index === 0 ? "Product" : undefined}
//                     value={item.product}
//                     onChange={(e) => updateItem(index, 'product', e.target.value)}
//                     options={products.map(p => ({ value: p._id, label: `${p.brandName} - ${p.productName}` }))}
//                   />
//                   <Input label={index === 0 ? "HSN" : undefined} value={item.hsnNumber} onChange={(e) => updateItem(index, 'hsnNumber', e.target.value)} />
//                   <Input label={index === 0 ? "Quantity" : undefined} type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))} />
//                   <Input label={index === 0 ? "MRP" : undefined} type="number" step="0.01" value={item.mrp} onChange={(e) => updateItem(index, 'mrp', parseFloat(e.target.value))} />
//                   {formData.items.length > 1 && (
//                     <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)}>Remove</Button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-end space-x-3">
//               <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
//               <Button type="submit" isLoading={isSubmitting} disabled={creditCheck && !creditCheck.canCreateBill}>Create Bill</Button>
//             </div>
//           </form>
//         </Modal>

//         <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Bill Details" size="lg">
//           {selectedBill && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Bill ID</p>
//                   <p className="font-medium">{selectedBill.billId}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Date</p>
//                   <p className="font-medium">{formatDate(selectedBill.billDate)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Customer</p>
//                   <p className="font-medium">{selectedBill.customerName}</p>
//                   <p className="text-sm text-gray-500">{selectedBill.customerAddress}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Status</p>
//                   {getStatusBadge(selectedBill.status)}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="font-medium mb-2">Items</h4>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>HSN</TableHead>
//                       <TableHead>Product</TableHead>
//                       <TableHead>Qty</TableHead>
//                       <TableHead>Rate</TableHead>
//                       <TableHead>Amount</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {selectedBill.items?.map((item, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{item.hsnNumber || '-'}</TableCell>
//                         <TableCell>{item.productDetails}</TableCell>
//                         <TableCell>{item.quantity}</TableCell>
//                         <TableCell>{formatCurrency(item.mrp)}</TableCell>
//                         <TableCell>{formatCurrency(item.amount)}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//               <div className="border-t pt-4 space-y-1 text-right">
//                 <p>Total: <span className="font-bold">{formatCurrency(selectedBill.totalAmount)}</span></p>
//                 <p className="text-green-600">Paid: {formatCurrency(selectedBill.paidAmount)}</p>
//                 <p className="text-red-600">Due: {formatCurrency(selectedBill.dueAmount)}</p>
//               </div>
//               <div className="flex justify-end">
//                 <Button onClick={() => downloadPDF(selectedBill)}>
//                   <Download className="h-4 w-4 mr-2" />
//                   Download PDF
//                 </Button>
//               </div>
//             </div>
//           )}
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
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { billsAPI, customersAPI } from '@/lib/api';
import { Bill, Customer } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Eye, Download, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { hasRole } = useAuth();
  const canEdit = hasRole(['Admin', 'Manager']);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [billsRes, customersRes] = await Promise.all([billsAPI.getAll(), customersAPI.getAll()]);
      setBills(billsRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectBill = (id: string) => {
    setSelectedBills(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedBills.length === bills.length) setSelectedBills([]);
    else setSelectedBills(bills.map(b => b._id));
  };

  const handleDelete = async (id?: string) => {
    try {
      if (id) await billsAPI.delete(id);
      else if (selectedBills.length) await Promise.all(selectedBills.map(bid => billsAPI.delete(bid)));
      setSelectedBills([]);
      setDeleteModalOpen(false);
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error deleting bill(s)');
    }
  };

  const viewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsViewModalOpen(true);
  };

  const downloadPDF = (bill: Bill) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const rupee = '\u20B9';
  // Fonts & Colors
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(33, 33, 33);

  // Company Header
  doc.text(bill.companyName || 'Your Company Name', pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(bill.companyAddress || 'Company Address', pageWidth / 2, 20, { align: 'center' });
  doc.text(`Phone: ${bill.companyPhone || ''} | Email: ${bill.companyEmail || ''} | GST: ${bill.companyGST || 'N/A'}`, pageWidth / 2, 25, { align: 'center' });

  // Invoice Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TAX INVOICE', pageWidth / 2, 35, { align: 'center' });

  // Bill Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Bill No: ${bill.billId}`, 14, 45);
  doc.text(`Date: ${formatDate(bill.billDate)}`, 14, 50);

  // Customer Info
  doc.text('Bill To:', 120, 45);
  doc.text(`${bill.customerName}`, 120, 50);
  doc.text(`${bill.customerAddress || ''}`, 120, 55);
  doc.text(`Phone: ${bill.customerPhone || ''} | GST: ${bill.customerGST || 'N/A'}`, 120, 60);

  // Items Table
  const tableData = bill.items.map((item, index) => [
    index + 1,
    item.hsnNumber || '-',
    item.productDetails,
    item.quantity,
    formatCurrency(item.mrp),
    formatCurrency(item.amount),
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['#', 'HSN', 'Product', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10 },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
doc.text(`Total Amount: ${rupee}${formatCurrency(bill.totalAmount)}`, 140, finalY);
doc.setFont('helvetica', 'normal');
doc.text(`Paid Amount: ${rupee}${formatCurrency(bill.paidAmount)}`, 140, finalY + 6);
doc.text(`Due Amount: ${rupee}${formatCurrency(bill.dueAmount)}`, 140, finalY + 12);
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Thank you for your business!', pageWidth / 2, 280, { align: 'center' });

  doc.save(`${bill.billId}.pdf`);
};

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
      Unpaid: 'danger',
      Partial: 'warning',
      Paid: 'success',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Bills & Invoices</h1>
          {selectedBills.length > 0 && canEdit && (
            <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>Delete Selected</Button>
          )}
        </div>

        <Card>
          <CardContent>
            {loading ? <div>Loading...</div> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><input type="checkbox" checked={selectedBills.length === bills.length} onChange={toggleSelectAll} /></TableHead>
                    <TableHead>Bill ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map(bill => (
                    <TableRow key={bill._id}>
                      <TableCell><input type="checkbox" checked={selectedBills.includes(bill._id)} onChange={() => toggleSelectBill(bill._id)} /></TableCell>
                      <TableCell>{bill.billId}</TableCell>
                      <TableCell>{bill.customerName}</TableCell>
                      <TableCell>{formatCurrency(bill.totalAmount)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(bill.paidAmount)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency(bill.dueAmount)}</TableCell>
                      <TableCell>{getStatusBadge(bill.status)}</TableCell>
                      <TableCell className="flex space-x-2">
                        <Button variant="ghost" onClick={() => viewBill(bill)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" onClick={() => downloadPDF(bill)}><Download className="h-4 w-4" /></Button>
                        {canEdit && bill.paidAmount === 0 && (
                          <Button variant="danger" onClick={() => handleDelete(bill._id)}><Trash2 className="h-4 w-4" /></Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {bills.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500">No bills found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Delete Modal */}
        <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete">
          <p>Are you sure you want to delete selected bills?</p>
          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete()}>Delete</Button>
          </div>
        </Modal>

        {/* View Modal */}
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Bill Details" size="lg">
          {selectedBill && (
            <div className="space-y-4">
              <p><strong>Bill ID:</strong> {selectedBill.billId}</p>
              <p><strong>Customer:</strong> {selectedBill.customerName}</p>
              <p><strong>Status:</strong> {selectedBill.status}</p>
              <p><strong>Total:</strong> {formatCurrency(selectedBill.totalAmount)}</p>
              <p><strong>Paid:</strong> {formatCurrency(selectedBill.paidAmount)}</p>
              <p><strong>Due:</strong> {formatCurrency(selectedBill.dueAmount)}</p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>HSN</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBill.items.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{it.hsnNumber}</TableCell>
                      <TableCell>{it.productDetails}</TableCell>
                      <TableCell>{it.quantity}</TableCell>
                      <TableCell>{formatCurrency(it.mrp)}</TableCell>
                      <TableCell>{formatCurrency(it.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end mt-4">
                <Button onClick={() => downloadPDF(selectedBill)}>
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
