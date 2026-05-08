export default {
  name: 'certificateList',
  title: 'My Certificates (JSON)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'My Certificates',
      readOnly: true,
    },
    {
      name: 'jsonContent',
      title: 'JSON Configuration',
      type: 'text',
      description: 'Paste your items array here. e.g. [{"id": "cert1", "label": "Network", "filetype": "txt", "content": "..."}]',
      rows: 20,
    },
  ],
};
