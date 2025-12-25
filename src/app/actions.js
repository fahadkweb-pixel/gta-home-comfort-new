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
  // If the hidden "bot_field" has ANY value, it is a bot.
  // We return { success: true } so the bot thinks it succeeded, but we do nothing.
  if (formData.bot_field) {
    console.warn('Bot submission detected and blocked.');
    return { success: true };
  }

  try {
    const doc = {
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
    // We return success: true to prevent blocking the user's UI if the logging fails
    return { success: true };
  }
}
