import { defineField, defineType } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Page Content', default: true },
    { name: 'seo', title: 'SEO & Social' },
  ],
  fields: [
    // --- SEO FIELDS ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'seoImage',
      title: 'Social Share Image',
      type: 'image',
      group: 'seo',
    }),

    // --- EXISTING CONTENT ---
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Contact Us',
      group: 'content',
    }),

    // HEADER
    defineField({ name: 'heading', title: 'Main Heading', type: 'string', group: 'content' }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    // CONTACT DETAILS
    defineField({ name: 'phoneNumber', title: 'Phone Number', type: 'string', group: 'content' }),
    defineField({ name: 'email', title: 'Email Address', type: 'string', group: 'content' }),

    // --- MAP SECTION ---
    defineField({
      name: 'serviceAreaTitle',
      title: 'Service Area Title',
      type: 'string',
      initialValue: 'Service Area',
      group: 'content',
    }),
    defineField({
      name: 'serviceAreaText',
      title: 'Service Area Description',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'serviceAreaImage',
      title: 'Map Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload a screenshot of your service area map here.',
      group: 'content',
    }),

    // TRIAGE CARDS
    defineField({
      name: 'emergencyCardText',
      title: 'Emergency Card Text',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'quoteCardText',
      title: 'Quote Card Text',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'generalCardText',
      title: 'General Inquiry Card Text',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
  ],
});
