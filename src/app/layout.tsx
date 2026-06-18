import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { DataProvider } from '@/context/DataContext';
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BTP | Predictive Command Center',
  description: 'Bengaluru Traffic Police AI-powered predictive traffic event command dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <DataProvider>
          {children}
          <Toaster position="top-right" theme="dark" />
        </DataProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
