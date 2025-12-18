import { defineField, defineType } from 'sanity';

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage Setup',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Home Control Panel',
      readOnly: true,
    }),
    defineField({
      name: 'heroTiles',
      title: 'Control Grid Tiles',
      type: 'array',
      of: [{ type: 'tile' }], // This refers to the object we made in Step 1
      description: 'Drag and drop to reorder the grid.',
    }),
  ],
});
