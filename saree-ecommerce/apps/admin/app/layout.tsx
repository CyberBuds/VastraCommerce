import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders'; // Import AppProviders

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aero Enterprise Admin Portal',
  description: 'An enterprise-grade administration foundation dashboard built on Next.js 15, React 19, and TailwindCSS.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased text-slate-800 dark:text-zinc-200">
        <AppProviders>{children}</AppProviders> {/* Wrap children with AppProviders */}
      </body>
    </html>
  );
}
