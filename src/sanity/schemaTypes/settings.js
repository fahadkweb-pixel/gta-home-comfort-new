import { defineField, defineType } from 'sanity';

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Navigation Logo',
      type: 'image',
      description: 'Upload your company logo here. SVG or PNG with transparent background is best.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      initialValue: 'GTA Home Comfort',
    }),
  ],
});
