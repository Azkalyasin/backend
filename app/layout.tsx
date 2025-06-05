'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import SignOutButton from '@/components/SignOutButton';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    // Check if current page is login or register
    setIsAuthPage(
      pathname === '/login' ||
      pathname === '/register'
    );
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        {isAuthPage ? (
          // Auth pages layout (login/register)
          <div className="flex items-center justify-center min-h-screen">
            {children}
          </div>
        ) : (
          // Main layout with sidebar and sign out button
          <SidebarProvider>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto bg-white">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <SidebarTrigger />
                    <SignOutButton />
                  </div>
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        )}
      </body>
    </html>
  );
}