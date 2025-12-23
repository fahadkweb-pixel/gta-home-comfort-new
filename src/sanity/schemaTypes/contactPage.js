import { defineField, defineType } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string', initialValue: 'Contact Us' }),

    // HEADER
    defineField({ name: 'heading', title: 'Main Heading', type: 'string' }),
    defineField({ name: 'introText', title: 'Intro Text', type: 'text', rows: 3 }),

    // CONTACT DETAILS
    defineField({ name: 'phoneNumber', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'email', title: 'Email Address', type: 'string' }),

    // --- MAP SECTION ---
    defineField({
      name: 'serviceAreaTitle',
      title: 'Service Area Title',
      type: 'string',
      initialValue: 'Service Area',
    }),
    defineField({
      name: 'serviceAreaText',
      title: 'Service Area Description',
      type: 'text',
      rows: 3,
    }),

    // *** NEW FIELD: MAP IMAGE ***
    defineField({
      name: 'serviceAreaImage',
      title: 'Map Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload a screenshot of your service area map here.',
    }),

    // TRIAGE CARDS
    defineField({ name: 'emergencyCardText', title: 'Emergency Card Text', type: 'text', rows: 2 }),
    defineField({ name: 'quoteCardText', title: 'Quote Card Text', type: 'text', rows: 2 }),
    defineField({
      name: 'generalCardText',
      title: 'General Inquiry Card Text',
      type: 'text',
      rows: 2,
    }),
  ],
});
