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
  title: 'Toronto HVAC, Furnace & AC Repair | GTA Home Comfort',
  description:
    'Expert heating and cooling services in Toronto & the GTA. Fast repairs for furnaces, AC, and water heaters. Start your free Smart Quote online today.',
  openGraph: {
    title: 'Toronto HVAC, Furnace & AC Repair | GTA Home Comfort',
    description: 'Expert heating and cooling services in Toronto & the GTA.',
    type: 'website',
  },
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
