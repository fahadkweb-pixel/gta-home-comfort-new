'use server';

import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // This uses the token you just created
});

export async function createLead(formData) {
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
    // We return success:true anyway so we don't block the user's UI if saving fails
    return { success: true };
  }
}
