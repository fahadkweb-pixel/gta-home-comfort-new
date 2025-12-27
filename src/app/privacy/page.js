import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | GTA Home Comfort',
  description: 'Our commitment to protecting your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <main className='py-16 px-6 md:px-12 max-w-4xl mx-auto'>
      <div className='prose prose-rose max-w-none'>
        <h1 className='text-4xl font-bold text-rose-950 mb-8'>Privacy Policy</h1>
        <p className='text-slate-500 text-sm mb-8'>
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-rose-900 mb-4'>1. Introduction</h2>
          <p className='text-slate-700 leading-relaxed'>
            GTA Home Comfort ("we," "our," or "us") respects your privacy and is committed to
            protecting the personal information you share with us. This Privacy Policy explains how
            we collect, use, and safeguard your data when you visit our website or use our services.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-rose-900 mb-4'>2. Information We Collect</h2>
          <p className='text-slate-700 leading-relaxed mb-4'>
            We collect information you provide directly to us, such as when you request a quote,
            book an appointment, or contact customer support. This may include:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-slate-700'>
            <li>
              <strong>Personal Details:</strong> Name, phone number, and email address.
            </li>
            <li>
              <strong>Property Details:</strong> Service address, postal code, and information about
              your HVAC equipment (e.g., age of furnace, type of home).
            </li>
            <li>
              <strong>Communications:</strong> Messages you send us via our contact forms.
            </li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-rose-900 mb-4'>3. How We Use Your Information</h2>
          <p className='text-slate-700 leading-relaxed mb-4'>
            We use the information we collect to:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-slate-700'>
            <li>Provide, maintain, and improve our HVAC services.</li>
            <li>Process your quote requests and schedule appointments.</li>
            <li>Send you transaction receipts, booking confirmations, and service reminders.</li>
            <li>Respond to your comments and questions.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-rose-900 mb-4'>4. Information Sharing</h2>
          <p className='text-slate-700 leading-relaxed'>
            <strong>We do not sell your personal data.</strong> We may share your information with
            trusted third-party service providers who assist us in operating our website, conducting
            our business, or servicing you (e.g., email delivery services, scheduling software), so
            long as those parties agree to keep this information confidential.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-rose-900 mb-4'>5. Data Security</h2>
          <p className='text-slate-700 leading-relaxed'>
            We implement reasonable security measures to maintain the safety of your personal
            information. However, no method of transmission over the Internet or electronic storage
            is 100% secure, so we cannot guarantee absolute security.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-rose-900 mb-4'>6. Contact Us</h2>
          <p className='text-slate-700 leading-relaxed'>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className='mt-4 p-6 bg-slate-50 rounded-xl border border-slate-100'>
            <p className='font-bold text-rose-950'>GTA Home Comfort</p>
            <p className='text-slate-600'>416-678-2131</p>
            <p className='text-slate-600'>info@gtahomecomfort.com</p>
          </div>
        </section>

        <div className='pt-8 border-t border-slate-200'>
          <Link href='/' className='text-rose-600 font-semibold hover:underline'>
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
