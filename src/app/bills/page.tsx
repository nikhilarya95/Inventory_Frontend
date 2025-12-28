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

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { billsAPI, customersAPI } from '@/lib/api';
import { Bill, Customer } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Eye, Download, Trash2, Search, Filter } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const filteredBills = useMemo(() => {
    return bills.filter(bill =>
      (filterStatus === 'All' || bill.status === filterStatus) &&
      (searchField === 'All' ? (
        (bill.billId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bill.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bill.customer?.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          formatDate(bill.billDate).toLowerCase().includes(searchQuery.toLowerCase()))
      ) : searchField === 'Bill ID' ? (
        bill.billId?.toLowerCase().includes(searchQuery.toLowerCase())
      ) : searchField === 'Customer' ? (
        bill.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      ) : searchField === 'Shop' ? (
        bill.customer?.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
      ) : searchField === 'Date' ? (
        formatDate(bill.billDate).toLowerCase().includes(searchQuery.toLowerCase())
      ) : true)
    );
  }, [bills, filterStatus, searchField, searchQuery]);

  const paginatedBills = useMemo(() => {
    return filteredBills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredBills, currentPage, itemsPerPage]);

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
      setStatusMessage({ type: 'success', text: 'Bill(s) deleted successfully' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Error deleting bill(s)' });
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
    // Invoice Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('TAX INVOICE', pageWidth / 2, 15, { align: 'center' });

    // Bill Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Bill No: ${bill.billId}`, 14, 25);
    doc.text(`Date: ${formatDate(bill.billDate)}`, 14, 30);

    // Bill From
    doc.setFont('helvetica', 'bold');
    doc.text('Bill From:', 14, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(bill.companyName || 'Shop Name', 14, 45);
    doc.text(bill.companyAddress || 'Shop Address', 14, 50);
    doc.text(`Phone: ${bill.companyPhone || ''}`, 14, 55);
    doc.text(`Email: ${bill.companyEmail || 'N/A'}`, 14, 60);
    doc.text(`GST: ${bill.companyGST || 'N/A'}`, 14, 65);

    // Customer Info (Bill To)
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 120, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`${bill.customerName}`, 120, 45);
    doc.text(`${bill.customerAddress || ''}`, 120, 50);
    doc.text(`Phone: ${bill.customerPhone || ''}`, 120, 55);
    doc.text(`Email: ${bill.customerEmail || 'N/A'}`, 120, 60);
    doc.text(`GST: ${bill.customerGST || 'N/A'}`, 120, 65);

    // Items Table
    const tableData = bill.items.map((item, index) => [
      index + 1,
      item.hsnNumber || '-',
      item.productDetails,
      item.quantity,
      `Rs. ${item.mrp.toFixed(2)}`,
      `${item.discount || 0}%`,
      `Rs. ${item.amount.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['#', 'HSN', 'Product', 'Qty', 'Rate', 'Disc', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10 },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: Rs. ${bill.totalAmount.toFixed(2)}`, 140, finalY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Paid Amount: Rs. ${bill.paidAmount.toFixed(2)}`, 140, finalY + 6);
    doc.text(`Due Amount: Rs. ${bill.dueAmount.toFixed(2)}`, 140, finalY + 12);

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
    <DashboardLayout moduleName="Bills & Invoices">
      <div className="space-y-6 w-full animate-fade-in">
        {statusMessage && (
          <div className={`p-4 rounded-xl text-sm font-medium border animate-fade-in ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {statusMessage.text}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-40">
            <Select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              options={[
                { value: 'All', label: 'All Fields' },
                { value: 'Bill ID', label: 'Bill ID' },
                { value: 'Customer', label: 'Customer Name' },
                { value: 'Shop', label: 'Shop Name' },
                { value: 'Date', label: 'Bill Date' }
              ]}
              className="h-10"
            />
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search bills..."
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
                { value: 'Paid', label: 'Paid' },
                { value: 'Partial', label: 'Partial' },
                { value: 'Unpaid', label: 'Unpaid' }
              ]}
              className="h-10"
            />
          </div>
          {selectedBills.length > 0 && canEdit && (
            <Button
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
              className="w-full sm:w-auto h-10 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedBills.length})
            </Button>
          )}
        </div>

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
                      <TableHead className="w-10">
                        <input
                          type="checkbox"
                          checked={selectedBills.length === filteredBills.length && filteredBills.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">Bill ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                      <TableHead className="font-semibold text-gray-700">Total</TableHead>
                      <TableHead className="font-semibold text-gray-700">Paid</TableHead>
                      <TableHead className="font-semibold text-gray-700">Due</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBills.map(bill => (
                      <TableRow key={bill._id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 animate-slide-up">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedBills.includes(bill._id)}
                            onChange={() => toggleSelectBill(bill._id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{bill.billId}</TableCell>
                        <TableCell className="text-gray-600">{formatDate(bill.billDate)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col max-w-xs">
                            <span className="font-medium text-gray-900 truncate">{bill.customerName}</span>
                            <span className="text-xs text-gray-500 truncate">{bill.customer?.shopName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">{formatCurrency(bill.totalAmount)}</TableCell>
                        <TableCell className="text-green-600 font-medium">{formatCurrency(bill.paidAmount)}</TableCell>
                        <TableCell className="text-red-600 font-medium">{formatCurrency(bill.dueAmount)}</TableCell>
                        <TableCell>{getStatusBadge(bill.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewBill(bill)}
                              title="View Details"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadPDF(bill)}
                              title="Download PDF"
                              className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedBills([bill._id]);
                                  setDeleteModalOpen(true);
                                }}
                                title="Delete Bill"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredBills.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center p-8">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No bills found</p>
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

        {!loading && filteredBills.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredBills.length}
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

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Delete">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-900">Are you sure?</p>
              <p className="text-sm text-red-700 mt-1">
                {selectedBills.length > 1
                  ? `You are about to delete ${selectedBills.length} bills. This action cannot be undone.`
                  : 'You are about to delete this bill. This action cannot be undone.'}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete()}
              className="w-full sm:w-auto shadow-lg"
            >
              {selectedBills.length > 1 ? `Delete ${selectedBills.length} Bills` : 'Delete Bill'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Bill Details" size="lg">
        {selectedBill && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-500">Bill ID</p>
                <p className="font-bold text-gray-900">{selectedBill.billId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-gray-900">{formatDate(selectedBill.billDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold text-gray-900">{selectedBill.customerName}</p>
                <p className="text-xs text-gray-500">{selectedBill.customerAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                {getStatusBadge(selectedBill.status)}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-lg mb-4">Items</h4>
              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>HSN</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBill.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm">{item.hsnNumber || '-'}</TableCell>
                        <TableCell className="text-sm font-medium">{item.productDetails}</TableCell>
                        <TableCell className="text-sm">{item.quantity}</TableCell>
                        <TableCell className="text-sm">{formatCurrency(item.mrp)}</TableCell>
                        <TableCell className="text-sm font-bold text-right">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex flex-col items-end pt-4 border-t border-gray-100 gap-1">
              <div className="flex justify-between w-full sm:w-1/2 text-sm text-gray-600">
                <span>Total Amount</span>
                <span className="font-bold text-gray-900">{formatCurrency(selectedBill.totalAmount)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-1/2 text-sm text-green-600">
                <span>Paid Amount</span>
                <span className="font-bold">{formatCurrency(selectedBill.paidAmount)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-1/2 text-base text-red-600 pt-2 border-t border-dashed border-gray-100">
                <span className="font-bold">Due Amount</span>
                <span className="font-extrabold">{formatCurrency(selectedBill.dueAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                onClick={() => downloadPDF(selectedBill)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}