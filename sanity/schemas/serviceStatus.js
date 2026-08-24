export default {
  name: 'serviceStatus',
  title: 'Service Status',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Service Status',
      readOnly: true,
    },
    {
      name: 'isAvailable',
      title: 'Available for Service',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle ON if available for service/freelance work, or OFF if unavailable.',
    },
    {
      name: 'statusText',
      title: 'Status Note / Tooltip (Optional)',
      type: 'string',
      description: 'Custom tooltip text shown when hovering the status icon.',
    },
  ],
};
