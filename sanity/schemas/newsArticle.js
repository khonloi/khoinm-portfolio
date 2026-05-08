export default {
  name: 'newsArticle',
  title: 'News Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'Revolutionary Activities',
          'Politics',
          'Economy',
          'Social',
          'Military',
          'International',
          'South Korea'
        ]
      }
    },
    {
      name: 'isLeadership',
      title: 'Leadership Activities?',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      initialValue: 'KCNA'
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: (new Date()).toISOString()
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }]
    }
  ]
}
