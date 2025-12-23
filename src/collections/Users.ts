import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: true,
  
  admin: {
    useAsTitle: 'email',
  },

  access: {
    admin: ({ req }) => Boolean(req.user),
  },

  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
  ],
}
