module.exports = {
  write: {
    platform: 'notion',
    notion: {
      token: process.env.NOTION_TOKEN,
      databaseId: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'type',
        select: {
          equals: 'Post'
        },
      }
    },
    deploy: {
      platform: 'local',
      local: {
        outputDir: './docs',
        filename: 'title',
        format: 'markdown',
        frontMatter: {
          enable: true,
          include: ['title', 'slug', 'summary', 'category', 'tags', 'date']
        },
        catalog: true,
        formatExt: '',
      }
    },
    image: {
      enable: true,
      platform: 'local',
      local: {
        outputDir: './docs/images',
        prefixKey: '/images',
        pathFollowDoc: false,
      }
    }
  }
}
