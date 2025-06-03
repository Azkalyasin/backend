// app/layout.tsx
'use client';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    // Deteksi apakah halaman ini auth page
    setIsAuthPage(
      pathname?.startsWith('/sign-in') ||
      pathname?.startsWith('/sign-up')
    );
  }, [pathname]);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} min-h-screen bg-gray-50`}>
          {isAuthPage ? (
            // Tanpa sidebar untuk halaman sign-in / sign-up
            <div className="flex items-center justify-center min-h-screen">
              {children}
            </div>
          ) : (
            // Layout utama dengan sidebar
            <SidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto bg-white">
                  <div className="p-4">
                    <SidebarTrigger />
                    {children}
                  </div>
                </main>
              </div>
            </SidebarProvider>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
