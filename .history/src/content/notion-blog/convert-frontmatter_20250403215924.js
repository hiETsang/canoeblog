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

// 读取并处理所有md文件
const files = fs.readdirSync(docsFolder).filter(file => file.endsWith('.md'));

files.forEach(file => {
    const filePath = path.join(docsFolder, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // 解析frontmatter和正文
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
        console.log(`跳过文件 ${file}，未找到有效的frontmatter`);
        return;
    }

    const frontmatterContent = frontmatterMatch[1];
    const markdownContent = frontmatterMatch[2];

    try {
        // 解析YAML frontmatter
        const frontmatter = yaml.load(frontmatterContent);

        // 创建新的frontmatter
        const newFrontmatter = {
            title: frontmatter.title || '',
            slug: frontmatter.urlname || '',
            description: frontmatter.summary || '',
            // 将tags转为JSON数组格式
            tags: Array.isArray(frontmatter.tags)
                ? JSON.stringify(frontmatter.tags)
                : '[]',
            pubDate: frontmatter.date || '',
            category: frontmatter.category || ''
        };

        // 移除tags的引号
        let tagsStr = newFrontmatter.tags;
        tagsStr = tagsStr.replace(/"/g, '\'');

        // 创建新的frontmatter字符串
        let newFrontmatterStr = `---
title: '${newFrontmatter.title}'
slug: '${newFrontmatter.slug}'
description: '${newFrontmatter.description}'
tags: ${tagsStr}
pubDate: '${newFrontmatter.pubDate}'
category: '${newFrontmatter.category}'
---`;

        // 创建新的文件内容
        const newContent = `${newFrontmatterStr}\n${markdownContent}`;

        // 创建基于slug的文件夹和文件
        const slug = newFrontmatter.slug || file.replace('.md', '');
        const newFolderPath = path.join(outputFolder, slug);

        if (!fs.existsSync(newFolderPath)) {
            fs.mkdirSync(newFolderPath, { recursive: true });
        }

        const newFilePath = path.join(newFolderPath, 'index.md');
        fs.writeFileSync(newFilePath, newContent);

        console.log(`已转换: ${file} -> ${slug}/index.md`);
    } catch (error) {
        console.error(`处理文件 ${file} 时出错:`, error);
    }
});

console.log('转换完成！'); 