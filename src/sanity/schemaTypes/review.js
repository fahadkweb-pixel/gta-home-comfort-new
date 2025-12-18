import { defineField, defineType } from 'sanity';

export const reviewType = defineType({
  name: 'review',
  title: 'Customer Review',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Customer Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stars',
      title: 'Star Rating (1-5)',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'text',
      title: 'Review Text',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date of Review',
      type: 'string',
      description: 'e.g. "1 week ago" or "Dec 12, 2025"',
    }),
  ],
});
