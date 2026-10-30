export const createJsonListSchema = ({
  name,
  title,
  initialValue = title,
  description = 'Paste your items array here.',
}) => ({
  name,
  title: `${title} (JSON)`,
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue,
      readOnly: true,
    },
    {
      name: 'jsonContent',
      title: 'JSON Configuration',
      type: 'text',
      description,
      rows: 20,
    },
  ],
});

export default createJsonListSchema;

