export default {
  name: 'onlineAccountList',
  title: 'Online Accounts (JSON)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Online Accounts',
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
