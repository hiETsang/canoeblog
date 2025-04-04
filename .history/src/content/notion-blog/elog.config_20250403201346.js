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
      outputDir: './src/content/notion-blog',
      filename: 'title',
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
    },
    halo: {
      endpoint: process.env.HALO_ENDPOINT,
      token: process.env.HALO_TOKEN,
      policyName: process.env.HALO_POLICY_NAME,
      rowType: 'html',
      needUploadImage: true,
    },
    confluence: {
      user: process.env.CONFLUENCE_USER,
      password: process.env.WORDPRESS_PASSWORD,
      endpoint: process.env.WORDPRESS_ENDPOINT,
      spaceKey: process.env.CONFLUENCE_SPACE_KEY,
      rootPageId: process.env.CONFLUENCE_ROOT_PAGE_ID, // 可选
    },
    wordpress: {
      username: process.env.WORDPRESS_USERNAME,
      password: process.env.WORDPRESS_PASSWORD,
      endpoint: process.env.WORDPRESS_ENDPOINT,
    }
  },
  image: {
    enable: true,
    platform: 'local',
    local: {
      outputDir: './src/content/notion-blog',
      prefixKey: '',
      pathFollowDoc: true, // 图片跟随文档路径
    },
    oss: {
      secretId: process.env.OSS_SECRET_ID,
      secretKey: process.env.OSS_SECRET_KEY,
      bucket: process.env.OSS_BUCKET,
      region: process.env.OSS_REGION,
      host: process.env.OSS_HOST,
      prefixKey: '',
    },
    cos: {
      secretId: process.env.COS_SECRET_ID,
      secretKey: process.env.COS_SECRET_KEY,
      bucket: process.env.COS_BUCKET,
      region: process.env.COS_REGION,
      host: process.env.COS_HOST,
      prefixKey: '',
    },
    qiniu: {
      secretId: process.env.QINIU_SECRET_ID,
      secretKey: process.env.QINIU_SECRET_KEY,
      bucket: process.env.QINIU_BUCKET,
      region: process.env.QINIU_REGION,
      host: process.env.QINIU_HOST,
      prefixKey: '',
    },
    upyun: {
      user: process.env.UPYUN_USER,
      password: process.env.UPYUN_PASSWORD,
      bucket: process.env.UPYUN_BUCKET,
      host: process.env.UPYUN_HOST,
      prefixKey: '',
    },
    github: {
      token: process.env.GITHUB_TOKEN,
      user: process.env.ELOG_GITHUB_USER,
      repo: process.env.ELOG_GITHUB_REPO,
      prefixKey: '',
    }
  }
}
