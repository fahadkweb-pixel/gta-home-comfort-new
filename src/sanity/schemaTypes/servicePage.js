import { defineField, defineType } from 'sanity';

export const servicePage = defineType({
  name: 'servicePage',
  title: 'Service Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO & Social' },
  ],
  fields: [
    // --- META ---
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' },
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    // --- HERO ---
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
    }),

    // --- REPAIR VS REPLACE ---
    defineField({
      name: 'showSplitSection',
      title: 'Show Repair/Replace Cards?',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    }),
    defineField({
      name: 'repairTitle',
      title: 'Repair Card Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'repairText',
      title: 'Repair Card Text',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'installTitle',
      title: 'Install Card Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'installText',
      title: 'Install Card Text',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    // --- THE PROCESS (Array) ---
    defineField({
      name: 'process',
      title: 'The Process Steps',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Step Title' },
            { name: 'description', type: 'text', rows: 2, title: 'Description' },
          ],
        },
      ],
    }),

    // --- MAIN CONTENT ---
    defineField({
      name: 'content',
      title: 'Main Body Content',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
    }),

    // --- EXTRAS ---
    defineField({
      name: 'showReviews',
      title: 'Show Reviews Carousel?',
      type: 'boolean',
      initialValue: true,
      group: 'content',
    }),

    // --- FAQ (Array) ---
    defineField({
      name: 'faq',
      title: 'Frequently Asked Questions',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', rows: 3, title: 'Answer' },
          ],
        },
      ],
    }),

    // --- SEO FIELDS (New Group) ---
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (Browser Tab)',
      type: 'string',
      description: 'E.g., "Furnace Repair Scarborough | GTA Home Comfort"',
      group: 'seo',
      validation: (Rule) => Rule.max(60).warning('Keep under 60 characters'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'The snippet shown in Google results.',
      group: 'seo',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters'),
    }),
    defineField({
      name: 'seoImage',
      title: 'Social Share Image',
      type: 'image',
      group: 'seo',
    }),
  ],
});
