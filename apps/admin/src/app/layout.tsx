import type { Metadata } from 'next';
import './globals.css';
import { AdminProvider } from '../context/AdminContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminNavbar } from '../components/AdminNavbar';
import { ToastContainer } from '../components/ToastContainer';

export const metadata: Metadata = {
  title: 'CareConnect Admin Console — Digital Healthcare Platform',
  description: 'Enterprise healthcare administrative control plane for CareConnect.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
        <AdminProvider>
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-h-screen min-w-0">
            <AdminNavbar />
            <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
          <ToastContainer />
        </AdminProvider>
      </body>
    </html>
  );
}
