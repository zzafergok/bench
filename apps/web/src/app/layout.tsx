import type { Metadata } from 'next';
import './globals.css';

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
        <div className="app-viewport">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
