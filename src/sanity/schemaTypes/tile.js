import { defineField, defineType } from 'sanity';

export const tileType = defineType({
  name: 'tile',
  title: 'Control Tile',
  type: 'object', // It's an object, not a document (it lives inside the Homepage)
  fields: [
    defineField({
      name: 'label',
      title: 'Label Text',
      type: 'string', // e.g. "No Heat"
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'The exact name of the Lucide icon (e.g. "Flame", "Snowflake", "Wrench")',
      initialValue: 'Circle',
    }),
    defineField({
      name: 'variant',
      title: 'Color Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Orange (Heat)', value: 'orange' },
          { title: 'Blue (Cool)', value: 'blue' },
          { title: 'Rose (Emergency)', value: 'rose' },
          { title: 'Gray (Standard)', value: 'gray' },
        ],
        layout: 'radio', // Shows as nice buttons
      },
      initialValue: 'gray',
    }),
    defineField({
      name: 'layout',
      title: 'Grid Size',
      type: 'string',
      options: {
        list: [
          { title: 'Small (1x1)', value: 'col-span-1' },
          { title: 'Wide (2x1)', value: 'col-span-2' },
          { title: 'Tall (1x2)', value: 'row-span-2' }, // For future flexibility
        ],
        layout: 'radio',
      },
      initialValue: 'col-span-1',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'variant',
    },
  },
});
