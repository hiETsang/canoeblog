#!/bin/bash

# 复制package.json
cp convert-package.json package.json

# 安装依赖
npm install

# 运行转换脚本
node convert-frontmatter.js

echo "文章转换成功! 请查看 ../blog 目录" 