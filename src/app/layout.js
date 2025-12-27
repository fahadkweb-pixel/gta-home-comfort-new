import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import TrustBar from './components/TrustBar';
import Footer from './components/Footer';
import Analytics from './components/Analytics'; // <--- Import your wrapper
import CookieBanner from './components/CookieBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'GTA Home Comfort | HVAC, Heating & Cooling Services Toronto',
  description:
    'Trusted HVAC experts serving Toronto & the GTA. Furnace, AC, water heaters & air quality services. Fast, honest, local service.',
  metadataBase: new URL('https://gtahomecomfort.com'),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://gtahomecomfort.com',
    siteName: 'GTA Home Comfort',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      {/* Use the custom Analytics component. 
         This handles the logic to BLOCK GTM inside the Studio.
      */}
      <Analytics />

      <body
        className={`${inter.variable} antialiased font-sans min-h-screen flex flex-col transition-colors duration-300 bg-[#fdf2f0] text-[#290f0f]`}
      >
        <TrustBar />
        <Navbar />
        <main className='flex-1 w-full relative z-0'>{children}</main>

        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
