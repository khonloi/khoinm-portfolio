export default {
  name: 'cdDrive',
  title: 'CD Drive Configuration',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'CD Drive Configuration',
      readOnly: true,
    },
    {
      name: 'label',
      title: 'CD Drive Label',
      type: 'string',
      initialValue: 'CD Drive',
    },
    {
      name: 'fileContent',
      title: 'CD Media URL (YouTube or Video Link)',
      type: 'string',
      description: 'The URL of the YouTube playlist/video or a direct video link.',
    },
  ],
};
