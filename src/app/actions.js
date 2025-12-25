'use server';

import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Initialize the client with the WRITE token
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // We need fresh data for writes
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function createLead(formData) {
  // --- 1. SECURITY: HONEYPOT CHECK ---
  if (formData.bot_field) {
    console.warn('Bot submission detected and blocked.');
    return { success: true };
  }

  try {
    // --- 2. PRIVACY: SAVE AS DRAFT ---
    // We generate a custom ID starting with "drafts.".
    // This makes the document "invisible" to public API queries.
    // Only authenticated users (YOU) can see it in the Studio.
    const safeId = `drafts.${crypto.randomUUID()}`;

    const doc = {
      _id: safeId, // <--- Forces Draft Mode
      _type: 'lead',
      name: formData.name,
      phone: formData.phone,
      email: formData.email || 'Not provided',
      address: formData.address,
      serviceType: `${formData.category} - ${formData.issueLabel}`,
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    await writeClient.create(doc);
    return { success: true };
  } catch (error) {
    console.error('Sanity Write Error:', error);
    return { success: true };
  }
}
