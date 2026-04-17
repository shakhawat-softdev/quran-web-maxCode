import type { Metadata } from 'next';
import { SettingsProvider } from '@/context/SettingsContext';
import '@/styles/index.css';

export const metadata: Metadata = {
  title: 'Quran App - Read & Reflect',
  description: 'A modern, elegant Quran web application for reading and reflecting on the Holy Quran',
  keywords: ['Quran', 'Islam', 'Reading', 'Arabic', 'Translation'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
