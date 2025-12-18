import { defineField, defineType } from 'sanity';

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage Setup',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Home Control Panel',
      readOnly: true,
    }),
    // --- NEW HEADER FIELDS ---
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      initialValue: 'Good Morning,',
    }),
    defineField({
      name: 'subheading',
      title: 'Highlighted Subheading',
      type: 'string',
      initialValue: 'Toronto.',
      description: 'This text will appear in the accent color.',
    }),
    defineField({
      name: 'headerAlignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'text-left' },
          { title: 'Center', value: 'text-center items-center' },
        ],
        layout: 'radio',
      },
      initialValue: 'text-left',
    }),
    // -------------------------
    defineField({
      name: 'heroTiles',
      title: 'Control Grid Tiles',
      type: 'array',
      of: [{ type: 'tile' }],
    }),
  ],
});
