import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'PolyDilettante — The Connected Ideas Playground & Bioluminescent VKMS',
  description:
    'A living, tactile, bilingual digital laboratory where quantitative trading, automation, robotics, and AI are explored through physics-driven nodes and interactive micro-simulators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[#05050A] text-slate-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
