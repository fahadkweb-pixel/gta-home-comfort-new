import { defineField, defineType } from 'sanity';

export const tileType = defineType({
  name: 'tile',
  title: 'Control Tile',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Exact name from Lucide (e.g. Flame, Snowflake, Wrench)',
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
        layout: 'radio',
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
          { title: 'Desktop Wide (4x1)', value: 'md:col-span-2' },
        ],
        layout: 'radio',
      },
      initialValue: 'col-span-1',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'variant',
      media: 'backgroundImage',
    },
  },
});
