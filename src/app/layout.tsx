import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/use-toast'; // <-- import here

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sales Management System',
  description: 'Comprehensive sales, stock, and customer management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider> {/* <-- wrap children with ToastProvider */}
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
