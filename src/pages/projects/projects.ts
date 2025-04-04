import { getRepositoryDetails } from "../../utils";

export interface Project {
  name: string;
  demoLink: string;
  tags?: string[],
  description?: string;
  postLink?: string;
  demoLinkRel?: string;
  [key: string]: any;
}

export const projects: Project[] = [
  {
    name: 'FocusFour',
    description: '一款基于四象限任务管理法的提醒事项增强工具，帮你把握重要的事',
    demoLink: 'https://apps.apple.com/us/app/focusfour-task-daily-planner/id6661031104',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ['Productivity', 'App']
  },
  {
    name: 'Phorase',
    description: '一款如魔术般的 AI 修图工具，轻松消除照片中的杂物与干扰',
    demoLink: 'https://apps.apple.com/sg/app/phorase/id6497569235',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ['AI', 'Photo', 'App']
  },
  {
    name: 'IndieTO',
    description: '由我精心筛选的独立开发全流程实用工具集，帮助你快速启动和发布产品',
    demoLink: 'https://indieto.com/',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ['Tools', 'IndieHacker']
  },
  {
    name: 'LinkToMarkdown',
    description: '一个简单且现代化的免费工具，从链接中提取文档并生成 Markdown',
    demoLink: 'https://linktomarkdown.com/',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ['Tools', 'Markdown']
  },
  {
    name: 'LET\'S VISION 2025',
    description: '国内首个空间计算+AI融合的顶级技术盛会，参与组织以及负责网站搭建',
    demoLink: 'https://letsvision.swiftgg.team/',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ['Event', 'Spatial Computing', 'AI']
  },
  {
    name: 'Let\'s visionOS 2024',
    description: '一场属于全世界的visionOS创造者大会，参与组织和以及负责网站搭建',
    demoLink: 'https://letsvisionos24.swiftgg.team/',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ['Event', 'visionOS']
  },
  {
    name: 'Twine by SwiftGG',
    description: '参与开发的一款帮助开发者更轻松地学习苹果官方文档的浏览器插件',
    demoLink: 'https://github.com/SwiftGGTeam/swiftgg-trans-plugin',
    demoLinkRel: 'nofollow noopener noreferrer',
    tags: ['Plugin', 'iOS', 'SwiftGG']
  }
]
