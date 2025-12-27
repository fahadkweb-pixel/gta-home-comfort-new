'use server';

import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { Resend } from 'resend'; // Import Resend
import { AdminEmail, CustomerEmail } from './emails/templates'; // Import Templates

// Initialize Clients
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createLead(formData) {
  // --- 1. SECURITY: HONEYPOT CHECK ---
  if (formData.bot_field) {
    console.warn('Bot submission detected and blocked.');
    return { success: true };
  }

  try {
    // --- Helper: Convert Arrays to Strings ---
    const formatList = (val) => (Array.isArray(val) ? val.join(', ') : val);

    // --- Helper: Format Tech Specs ---
    const getTechSpecs = () => {
      const parts = [];
      if (formData.hasGasToHome) parts.push(`Gas: ${formData.hasGasToHome}`);
      if (formData.panelSize) parts.push(`Panel: ${formData.panelSize}`);
      if (formData.existingBrand) parts.push(`Brand: ${formData.existingBrand}`);
      return parts.join(' | ');
    };

    // --- 2. PREPARE DOCUMENT ---
    const doc = {
      _id: `drafts.${crypto.randomUUID()}`,
      _type: 'lead',
      status: 'new',
      submittedAt: new Date().toISOString(),
      category: formData.category,

      // Contact
      name: formData.name,
      phone: formData.phone,
      email: formData.email || 'Not provided',
      address: formData.address,

      // High Level Context
      serviceType: Array.isArray(formData.issue)
        ? formatList(formData.issue)
        : formData.issueLabel || 'General Inquiry',
      selectedSystems: formatList(formData.system),

      // Property Context
      propertyType: formData.propertyType,
      ownerOrTenant: formData.ownerOrTenant,
      sqftRange: formData.sqftRange,
      levels: formData.levels,
      accessLocation: formData.accessLocation,
      petsInHome: formData.petsInHome,
      accessNotes: formData.accessNotes,

      // System / Technical
      installScenario: formData.installScenario,
      systemStatus: formData.systemRunning || formData.systemRunningNormally,
      issueStart: formData.whenStarted,
      systemAge: formData.existingAge || formData.systemAgeApprox,
      lastService: formData.lastServiceWhen,
      fuelType: formData.existingFuel,
      ductwork: formData.ductwork,
      technicalDetails: getTechSpecs(),

      // Preferences
      priority: formData.priority,
      timeline: formData.timeline,
      preferredContact: formData.preferredContact,
      preferredTime: formData.bestTimeWindow || formData.preferredAppointmentWindow,
      addOns: formatList(formData.addOnInterest),
    };

    // --- 3. SAVE TO SANITY ---
    await writeClient.create(doc);

    // --- 4. SEND EMAILS ---

    // A. Send Notification to YOU (Admin)
    await resend.emails.send({
      from: 'GTA Website <system@gtahomecomfort.com>', // Use your verified domain
      to: ['info@gtahomecomfort.com'], // Where you want to receive leads
      subject: `🔥 New Lead: ${formData.name} (${formData.category})`,
      react: AdminEmail({ data: formData }),
    });

    // B. Send Confirmation to CUSTOMER
    if (formData.email && formData.email.includes('@')) {
      await resend.emails.send({
        from: 'GTA Home Comfort <info@gtahomecomfort.com>', // Must be verified in Resend
        to: [formData.email],
        subject: 'We received your request - GTA Home Comfort',
        react: CustomerEmail({ data: formData }),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Submission Error:', error);
    // Even if email fails, we return success if Sanity worked (or fail gracefully)
    return { success: true };
  }
}
