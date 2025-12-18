import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import TrustBar from './components/TrustBar';
import Footer from './components/Footer'; // Import the new Footer

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'GTA Home Comfort | Total Climate Control',
  description: 'Advanced HVAC Diagnostics & Repair',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${inter.variable} antialiased font-sans min-h-screen flex flex-col transition-colors duration-300 bg-[#fdf2f0] text-[#290f0f]`}
      >
        <TrustBar />
        <Navbar />
        {/* Main takes available space, pushing Footer to bottom if content is short */}
        <main className='flex-1 w-full relative z-0'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
