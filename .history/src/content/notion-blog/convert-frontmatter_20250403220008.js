const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// 文件夹路径
const docsFolder = path.join(__dirname, 'docs');
const outputFolder = path.join(__dirname, '../blog');

// 确保输出文件夹存在
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

// 辅助函数：安全处理字符串，避免YAML解析问题
function escapeString(str) {
    if (!str) return '';

    // 替换单引号为转义的单引号
    return str.replace(/'/g, '\\\'')
        .replace(/\n/g, ' ') // 移除换行符
        .replace(/\r/g, '');  // 移除回车符
}

// 读取并处理所有md文件
const files = fs.readdirSync(docsFolder).filter(file => file.endsWith('.md'));
console.log(`找到 ${files.length} 个Markdown文件待处理`);

let successCount = 0;
let errorCount = 0;

files.forEach(file => {
    const filePath = path.join(docsFolder, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // 解析frontmatter和正文
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
        console.log(`⚠️ 跳过文件 ${file}，未找到有效的frontmatter`);
        errorCount++;
        return;
    }

    const frontmatterContent = frontmatterMatch[1];
    const markdownContent = frontmatterMatch[2];

    try {
        // 解析YAML frontmatter
        const frontmatter = yaml.load(frontmatterContent);

        // 创建一个适合文件命名的slug
        let slug = frontmatter.urlname || file.replace(/\.md$/, '');
        // 移除非法文件名字符
        slug = slug.replace(/[/\\?%*:|"<>]/g, '-');

        // 创建新的frontmatter
        const newFrontmatter = {
            title: escapeString(frontmatter.title || '无标题'),
            slug: slug,
            description: escapeString(frontmatter.summary || ''),
            pubDate: frontmatter.date || new Date().toISOString().split('T')[0],
            category: escapeString(frontmatter.category || '')
        };

        // 处理tags
        let tagsArray = [];
        if (Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0) {
            tagsArray = frontmatter.tags.map(tag => escapeString(tag));
        }

        // 创建新的frontmatter字符串
        let newFrontmatterStr = `---
title: '${newFrontmatter.title}'
slug: '${newFrontmatter.slug}'
description: '${newFrontmatter.description}'
tags: ${JSON.stringify(tagsArray)}
pubDate: '${newFrontmatter.pubDate}'
category: '${newFrontmatter.category}'
---`;

        // 创建新的文件内容
        const newContent = `${newFrontmatterStr}\n${markdownContent}`;

        // 创建基于slug的文件夹和文件
        const newFolderPath = path.join(outputFolder, slug);

        if (!fs.existsSync(newFolderPath)) {
            fs.mkdirSync(newFolderPath, { recursive: true });
        }

        const newFilePath = path.join(newFolderPath, 'index.md');
        fs.writeFileSync(newFilePath, newContent);

        console.log(`✅ 已转换: ${file} -> ${slug}/index.md`);
        successCount++;
    } catch (error) {
        console.error(`❌ 处理文件 ${file} 时出错:`, error);
        errorCount++;
    }
});

console.log('======= 转换完成 =======');
console.log(`成功: ${successCount} 文件`);
console.log(`失败: ${errorCount} 文件`);
console.log(`转换后的文件已保存到: ${outputFolder}`); 