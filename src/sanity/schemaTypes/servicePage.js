import { defineField, defineType } from 'sanity';

export const servicePage = defineType({
  name: 'servicePage',
  title: 'Service Pages',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title (Internal)', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),

    // --- HERO ---
    defineField({ name: 'heroHeading', title: 'Hero Heading', type: 'string' }),
    defineField({ name: 'heroSubheading', title: 'Hero Subheading', type: 'text', rows: 3 }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
    }),

    // --- REPAIR VS REPLACE ---
    defineField({
      name: 'showSplitSection',
      title: 'Show "Repair vs Replace"?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'repairTitle',
      title: 'Repair Title',
      type: 'string',
      hidden: ({ parent }) => !parent?.showSplitSection,
    }),
    defineField({
      name: 'repairText',
      title: 'Repair Text',
      type: 'text',
      rows: 3,
      hidden: ({ parent }) => !parent?.showSplitSection,
    }),
    defineField({
      name: 'installTitle',
      title: 'Install Title',
      type: 'string',
      hidden: ({ parent }) => !parent?.showSplitSection,
    }),
    defineField({
      name: 'installText',
      title: 'Install Text',
      type: 'text',
      rows: 3,
      hidden: ({ parent }) => !parent?.showSplitSection,
    }),

    // --- NEW: THE PROCESS (How it Works) ---
    defineField({
      name: 'process',
      title: 'How It Works (3 Steps)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Step Title' },
            { name: 'description', type: 'text', title: 'Description', rows: 2 },
          ],
        },
      ],
      validation: (Rule) => Rule.max(3).warning('Best to keep it to 3 steps!'),
    }),

    // --- MAIN CONTENT ---
    defineField({
      name: 'content',
      title: 'Main Body Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),

    // --- NEW: REVIEWS TOGGLE ---
    defineField({
      name: 'showReviews',
      title: 'Show Reviews Carousel?',
      type: 'boolean',
      initialValue: true,
    }),

    // --- NEW: FAQ ---
    defineField({
      name: 'faq',
      title: 'Frequently Asked Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', title: 'Answer', rows: 3 },
          ],
        },
      ],
    }),
  ],
});
