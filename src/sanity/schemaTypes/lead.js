import { User } from 'lucide-react';

export default {
  name: 'lead',
  title: 'Inbound Leads',
  type: 'document',
  icon: User,
  fieldsets: [
    { name: 'details', title: 'Lead Details' },
    { name: 'property', title: 'Property & Access' },
    { name: 'system', title: 'System Information' },
    { name: 'preferences', title: 'Preferences & Timeline' },
  ],
  fields: [
    // --- CORE INFO ---
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Booked', value: 'booked' },
          { title: 'Lost', value: 'lost' },
        ],
      },
      initialValue: 'new',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'submittedAt',
      title: 'Submission Time',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'category',
      title: 'Category', // INSTALLATION, SERVICE, MAINTENANCE
      type: 'string',
      readOnly: true,
    },
    {
      name: 'serviceType',
      title: 'Primary Issue / Goal', // e.g. "Annual Tune-Up" or "No Heat"
      type: 'string',
      readOnly: true,
    },
    {
      name: 'selectedSystems',
      title: 'Systems Involved', // e.g. "Furnace, AC"
      type: 'string',
      readOnly: true,
    },

    // --- CUSTOMER DETAILS ---
    {
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      readOnly: true,
      fieldset: 'details',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      readOnly: true,
      fieldset: 'details',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
      fieldset: 'details',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      readOnly: true,
      fieldset: 'details',
    },

    // --- PROPERTY CONTEXT ---
    {
      name: 'propertyType',
      title: 'Property Type',
      type: 'string',
      fieldset: 'property',
      readOnly: true,
    },
    {
      name: 'ownerOrTenant',
      title: 'Owner/Tenant',
      type: 'string',
      fieldset: 'property',
      readOnly: true,
    },
    {
      name: 'accessNotes',
      title: 'Access Notes',
      type: 'text',
      fieldset: 'property',
      readOnly: true,
      rows: 2,
    },
    {
      name: 'sqftRange',
      title: 'Square Footage',
      type: 'string',
      fieldset: 'property',
      readOnly: true,
    },
    {
      name: 'levels',
      title: 'Levels',
      type: 'string',
      fieldset: 'property',
      readOnly: true,
    },
    {
      name: 'accessLocation',
      title: 'Equipment Location',
      type: 'string',
      fieldset: 'property',
      readOnly: true,
    },
    {
      name: 'petsInHome',
      title: 'Pets?',
      type: 'string',
      fieldset: 'property',
      readOnly: true,
    },

    // --- SYSTEM & TECHNICAL ---
    {
      name: 'installScenario',
      title: 'Install Scenario', // Existing vs New
      type: 'string',
      fieldset: 'system',
      readOnly: true,
    },
    {
      name: 'systemStatus',
      title: 'System Running?',
      type: 'string',
      fieldset: 'system',
      readOnly: true,
    },
    {
      name: 'issueStart',
      title: 'Issue Started',
      type: 'string',
      fieldset: 'system',
      readOnly: true,
    },
    {
      name: 'systemAge',
      title: 'System Age',
      type: 'string',
      fieldset: 'system',
      readOnly: true,
    },
    {
      name: 'lastService',
      title: 'Last Service Date',
      type: 'string',
      fieldset: 'system',
      readOnly: true,
    },
    {
      name: 'fuelType',
      title: 'Fuel Type',
      type: 'string',
      fieldset: 'system',
      readOnly: true,
    },
    {
      name: 'ductwork',
      title: 'Has Ductwork?',
      type: 'string',
      fieldset: 'system',
      readOnly: true,
    },
    {
      name: 'technicalDetails',
      title: 'Tech Specs', // Gas/Panel info combined
      type: 'string',
      fieldset: 'system',
      readOnly: true,
    },

    // --- PREFERENCES ---
    {
      name: 'priority',
      title: 'Priority',
      type: 'string',
      fieldset: 'preferences',
      readOnly: true,
    },
    {
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
      fieldset: 'preferences',
      readOnly: true,
    },
    {
      name: 'preferredContact',
      title: 'Preferred Contact',
      type: 'string',
      fieldset: 'preferences',
      readOnly: true,
    },
    {
      name: 'preferredTime',
      title: 'Preferred Time',
      type: 'string',
      fieldset: 'preferences',
      readOnly: true,
    },
    {
      name: 'addOns',
      title: 'Interested Add-Ons',
      type: 'string',
      fieldset: 'preferences',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || 'New Lead',
        subtitle: `${status?.toUpperCase()} | ${subtitle || 'Unknown'}`,
      };
    },
  },
};
