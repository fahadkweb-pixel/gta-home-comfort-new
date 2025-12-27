'use server';

import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

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
      _id: `drafts.${crypto.randomUUID()}`, // Draft mode
      _type: 'lead',

      // Core Data
      status: 'new',
      submittedAt: new Date().toISOString(),
      category: formData.category,

      // Contact
      name: formData.name,
      phone: formData.phone,
      email: formData.email || 'Not provided',
      address: formData.address, // This now includes postal code from SmartQuote logic

      // High Level Context
      // If "issue" is array (Maint/Service), join it. If string, use label.
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
      // Map both "existingAge" (Install) and "systemAgeApprox" (Maint/Service)
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

    await writeClient.create(doc);
    return { success: true };
  } catch (error) {
    console.error('Sanity Write Error:', error);
    return { success: true };
  }
}
