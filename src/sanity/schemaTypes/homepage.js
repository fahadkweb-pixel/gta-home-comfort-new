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
    }),
    defineField({
      name: 'subheading',
      title: 'Highlighted Subheading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 3,
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
    // --- NEW FIELD: Grid Density Control ---
    defineField({
      name: 'desktopGridCols',
      title: 'Desktop Grid Layout',
      description:
        'Choose "3 Columns" if you have 3, 6, or 9 tiles. Choose "4 Columns" for 4, 8, 12.',
      type: 'string',
      options: {
        list: [
          { title: '3 Columns (Good for 6 items)', value: 'md:grid-cols-3' },
          { title: '4 Columns (Good for 4 or 8 items)', value: 'md:grid-cols-4' },
        ],
        layout: 'radio',
      },
      initialValue: 'md:grid-cols-4',
    }),
    // ---------------------------------------
    defineField({
      name: 'heroTiles',
      title: 'Control Grid Tiles',
      type: 'array',
      of: [{ type: 'tile' }],
    }),
  ],
});
