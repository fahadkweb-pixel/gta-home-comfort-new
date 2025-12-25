import { User } from 'lucide-react';

export default {
  name: 'lead',
  title: 'Inbound Leads',
  type: 'document',
  icon: User,
  fields: [
    {
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'serviceType',
      title: 'Service Needed',
      type: 'string',
      readOnly: true, // e.g. "HEATING - NO HEAT"
    },
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
    },
    {
      name: 'submittedAt',
      title: 'Submission Time',
      type: 'datetime',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'serviceType',
    },
  },
};
