import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/sonner';
import { StoreProvider } from '@/providers/store';
import { GeistSans } from 'geist/font';

import './globals.css';

export const metadata: Metadata = {
  description: 'Pimega Annotator',
  title: 'pianno',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <StoreProvider>
          {children}
          <Toaster richColors />
        </StoreProvider>
      </body>
    </html>
  );
}
