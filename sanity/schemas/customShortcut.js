export default {
  name: 'customShortcut',
  title: 'Custom Desktop Shortcuts (JSON)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Custom Shortcuts',
      readOnly: true,
    },
    {
      name: 'jsonContent',
      title: 'JSON Configuration',
      type: 'text',
      description: 'Paste your custom shortcut JSON array here (e.g., [{ "id": "custom", "label": "My Link", "iconSrc": "winInternationalIcon", "fileContent": "https..." }]).',
      rows: 20,
    },
  ],
};
