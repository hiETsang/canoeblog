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
      },
    },
    image: {
      enable: false,
      platform: 'local',
      local: {
        outputDir: './docs/images',
        prefixKey: '/images',
        pathFollowDoc: false,
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
