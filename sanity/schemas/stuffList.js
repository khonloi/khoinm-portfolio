export default {
  name: 'stuffList',
  title: 'Random Stuff (JSON)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Random Stuff',
      readOnly: true,
    },
    {
      name: 'jsonContent',
      title: 'JSON Configuration',
      type: 'text',
      description: 'Paste your items array here.',
      rows: 20,
    },
  ],
};
