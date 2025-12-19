import { defineField, defineType } from 'sanity';

export const tileType = defineType({
  name: 'tile',
  title: 'Control Tile',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Main Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    // --- NEW FIELD: Subtitle ---
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Smaller text below the label (e.g. "Furnace / Boiler")',
    }),
    // ---------------------------
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      initialValue: 'Circle',
    }),
    defineField({
      name: 'variant',
      title: 'Color Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Orange (Heat)', value: 'orange' },
          { title: 'Blue (Cooling)', value: 'blue' },
          { title: 'Rose (Emergency)', value: 'rose' },
          { title: 'Cyan (Water)', value: 'cyan' },
          { title: 'Purple (Noise)', value: 'purple' },
          { title: 'Amber (Warning)', value: 'amber' },
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
          { title: 'Desktop Half (2 cols)', value: 'col-span-2 md:col-span-2' },
          { title: 'Billboard (4x2)', value: 'col-span-2 md:col-span-4 row-span-2' },
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
      subtitle: 'subtitle', // Show subtitle in the CMS list too
      media: 'backgroundImage',
    },
  },
});
