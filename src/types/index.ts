export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  aadharNumber?: string;
  address?: string;
  roles: ('Admin' | 'Manager' | 'Sales Man')[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  brandName: string;
  productName: string;
  hsnNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Stock {
  _id: string;
  product: Product;
  location: string;
  quantity: number;
  expiryDate: string;
  manufactureDate: string;
  weight: number;
  weightUnit: 'g' | 'kg' | 'ml' | 'l';
  mrp: number;
  discount: number;
  batchNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shopName: string;
  gst?: string;
  address: string;
  creditLimit: number;
  totalDue: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  stock?: Stock;
  quantity: number;
  expiryDate?: string;
  mrp: number;
  discount: number;
  discountAmount?: number;
  subtotal?: number;
}

export interface Order {
  _id: string;
  orderId: string;
  orderDate: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Billed' | 'Cancelled';
  createdBy?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  hsnNumber?: string;
  product: Product;
  productDetails: string;
  quantity: number;
  mrp: number;
  discount: number;
  amount: number;
}

export interface Bill {
  _id: string;
  billId: string;
  billDate: string;
  customer: Customer;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerGST?: string;
  customerAddress: string;
  companyName: string;
  companyPhone: string;
  companyEmail?: string;
  companyGST?: string;
  companyAddress: string;
  items: BillItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'Unpaid' | 'Partial' | 'Paid';
  order?: Order;
  createdBy?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  transactionId: string;
  transactionDate: string;
  customer: Customer;
  bill: Bill;
  amount: number;
  modeOfPayment: 'Cash' | 'UPI' | 'Net Banking' | 'Cheque' | 'Card';
  notes?: string;
  createdBy?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  address: string;
  gst?: string;
  phone: string;
  email?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalBills: number;
  lowStockCount: number;
  totalRevenue: number;
  totalDue: number;
  totalPaid: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (roles: string[]) => boolean;
  refreshUser: () => Promise<void>;
}
