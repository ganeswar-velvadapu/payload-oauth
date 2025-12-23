import { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Enter post title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Enter post description',
    },
  ],
}
