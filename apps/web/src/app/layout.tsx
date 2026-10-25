import type { Metadata } from 'next';
import './globals.scss';

import { Navbar, Footer } from '@/components/ui/layout';

export const metadata: Metadata = {
  title: 'Bench',
  description: 'Yerel ve gizli dosya, belge ve veri araç seti.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <div className="mx-auto flex min-h-dvh w-full max-w-225 flex-col px-6 py-4 sm:px-3.5">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
