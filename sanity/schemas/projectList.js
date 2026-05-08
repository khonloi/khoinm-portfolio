export default {
  name: 'projectList',
  title: 'My Projects (JSON)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'My Projects',
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
