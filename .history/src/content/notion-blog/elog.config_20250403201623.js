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
  },
  deploy: {
    platform: 'local',
    local: {
      outputDir: './docs',
      filename: 'index',
      format: 'markdown',
      catalog: false,
      formatExt: '',
      frontMatter: {
        enable: true,
        format: 'yaml',
      },
      docStyle: {
        fold: true,  // 启用文件夹模式
        style: 'date-slug',  // 使用日期-slug格式
        properties: {
          date: 'date',
          slug: 'slug'
        }
      }
    }
  },
  image: {
    enable: true,
    platform: 'local',
    local: {
      outputDir: './src/content/notion-blog',
      prefixKey: '',
      pathFollowDoc: true, // 图片跟随文档路径
    }
  }
}
