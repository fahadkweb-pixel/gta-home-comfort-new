import { defineField, defineType } from 'sanity';

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // --- BRANDING ---
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      initialValue: 'GTA Home Comfort',
    }),
    defineField({
      name: 'logo',
      title: 'Desktop Logo',
      description: 'The main logo displayed on large screens.',
      type: 'image',
      options: { hotspot: true },
    }),
    // NEW: Mobile Logo Field
    defineField({
      name: 'mobileLogo',
      title: 'Mobile Logo',
      description:
        'Optional. A smaller/simplified logo for mobile screens (e.g., just the flame icon).',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'footerLogo',
      title: 'Footer Logo (Dark Background)',
      description: 'Upload a white/light version of the logo for the dark footer background.',
      type: 'image',
      options: { hotspot: true },
    }),

    // --- CONTACT INFO (Global Source of Truth) ---
    defineField({
      name: 'email',
      title: 'Support Email',
      type: 'string',
      initialValue: 'info@gtahomecomfort.com',
    }),
    defineField({
      name: 'phone',
      title: 'Support Phone',
      type: 'string',
      initialValue: '416-678-2131',
    }),
    defineField({
      name: 'address',
      title: 'Office Location',
      type: 'string',
      initialValue: 'Scarborough, ON',
    }),

    // --- SOCIAL MEDIA ---
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
  ],
});
