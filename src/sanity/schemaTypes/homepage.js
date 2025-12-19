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
    }),
    // --- NEW FIELD: Paragraph Text ---
    defineField({
      name: 'description',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 3,
      description: 'Text that appears below the main heading.',
    }),
    // ---------------------------------
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
    defineField({
      name: 'heroTiles',
      title: 'Control Grid Tiles',
      type: 'array',
      of: [{ type: 'tile' }],
    }),
  ],
});
