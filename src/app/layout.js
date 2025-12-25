import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import TrustBar from './components/TrustBar';
import Footer from './components/Footer';
import { GoogleTagManager } from '@next/third-parties/google'; // <--- Import the library

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: {
    default: 'Toronto HVAC, Furnace & AC Repair | GTA Home Comfort',
    template: '%s | GTA Home Comfort',
  },
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
        <main className='flex-1 w-full relative z-0'>{children}</main>
        <Footer />

        {/* --- GOOGLE TAG MANAGER --- */}
        {/* This loads your existing GTM container on every page view. */}
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      </body>
    </html>
  );
}
