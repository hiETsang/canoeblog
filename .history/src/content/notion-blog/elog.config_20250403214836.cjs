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
        plugin: './r2-uploader.js',
        r2: {
            accessKeyId: process.env.R2_ACCESSKEYID,
            secretAccessKey: process.env.R2_SECRET_ACCESSKEY,
            bucket: process.env.R2_BUCKET,
            endpoint: process.env.R2_ENDPOINT,
            host: process.env.R2_HOST,
            prefixKey: 'blog'
        }
    }
}
