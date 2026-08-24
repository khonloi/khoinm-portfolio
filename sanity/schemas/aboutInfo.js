export default {
  name: 'aboutInfo',
  title: 'About Information',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      initialValue: 'Nguyen Minh Khoi'
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string'
    },
    {
      name: 'isAvailable',
      title: 'Available for Service',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle whether you are currently available or unavailable for service/work.'
    },
    {
      name: 'portrait',
      title: 'Portrait Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'aboutMe',
      title: 'About Me (Bio)',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'experience',
      title: 'Experience',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'experienceItem',
          fields: [
            { name: 'jobTitle', title: 'Job Title', type: 'string' },
            { name: 'company', title: 'Company', type: 'string' },
            { name: 'date', title: 'Date Range', type: 'string' },
            {
              name: 'bullets',
              title: 'Description Bullets',
              type: 'array',
              of: [{ type: 'string' }]
            }
          ]
        }
      ]
    }
  ]
}
