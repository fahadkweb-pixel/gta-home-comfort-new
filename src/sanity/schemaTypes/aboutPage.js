import { defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Page Content', default: true },
    { name: 'seo', title: 'SEO & Social' },
  ],
  fields: [
    // --- SEO FIELDS ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for Google (e.g., "About Us | GTA Home Comfort")',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Short summary for search engines.',
      group: 'seo',
    }),
    defineField({
      name: 'seoImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image shown when sharing on Facebook/Twitter',
      group: 'seo',
    }),

    // --- EXISTING CONTENT ---
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'About Us',
      group: 'content',
    }),

    // HERO SECTION
    defineField({ name: 'heroHeading', title: 'Hero Heading', type: 'string', group: 'content' }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    // ORIGIN STORY
    defineField({ name: 'storyHeading', title: 'Story Heading', type: 'string', group: 'content' }),
    defineField({
      name: 'storyText',
      title: 'Story Content',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
    }),
    defineField({
      name: 'storyImage',
      title: 'Team/Founder Photo',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
    }),
    defineField({ name: 'storyQuote', title: 'Highlight Quote', type: 'string', group: 'content' }),

    // STATS
    defineField({ name: 'stat1Number', title: 'Stat 1 Number', type: 'string', group: 'content' }),
    defineField({ name: 'stat1Label', title: 'Stat 1 Label', type: 'string', group: 'content' }),
    defineField({ name: 'stat2Number', title: 'Stat 2 Number', type: 'string', group: 'content' }),
    defineField({ name: 'stat2Label', title: 'Stat 2 Label', type: 'string', group: 'content' }),

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
      group: 'content',
    }),
  ],
});
