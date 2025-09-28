import './globals.css';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

export const metadata: Metadata = {
  title: 'Lateral Thinking',
  description: 'Portfolio website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BackgroundGradientAnimation containerClassName="fixed inset-0 z-10" />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
