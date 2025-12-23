import { defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string', initialValue: 'About Us' }),

    // HERO SECTION
    defineField({ name: 'heroHeading', title: 'Hero Heading', type: 'string' }),
    defineField({ name: 'heroSubheading', title: 'Hero Subheading', type: 'text', rows: 3 }),

    // ORIGIN STORY
    defineField({ name: 'storyHeading', title: 'Story Heading', type: 'string' }),
    defineField({
      name: 'storyText',
      title: 'Story Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'storyImage',
      title: 'Team/Founder Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'storyQuote', title: 'Highlight Quote', type: 'string' }),

    // STATS
    defineField({ name: 'stat1Number', title: 'Stat 1 Number', type: 'string' }),
    defineField({ name: 'stat1Label', title: 'Stat 1 Label', type: 'string' }),
    defineField({ name: 'stat2Number', title: 'Stat 2 Number', type: 'string' }),
    defineField({ name: 'stat2Label', title: 'Stat 2 Label', type: 'string' }),

    // VALUES
    defineField({
      name: 'values',
      title: 'Core Values (4 Items)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'description', type: 'text', rows: 2 },
          ],
        },
      ],
    }),
  ],
});
