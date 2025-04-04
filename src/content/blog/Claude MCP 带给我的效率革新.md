---
title: Claude MCP 带给我的效率革新
slug: claude-mcp-efficiency-revolution
description: ''
tags:
  - AI
  - 工具
pubDate: 2024-12-14
category: 经验
---

最近一段时间，在使用 Claude 的过程中发现了一个牛逼的新功能 - MCP（模型上下文协议）。这是一个让 AI 能够与外部数据和服务安全交互的新特性，具体是啥呢，可以理解为 USB 接口，你的数据就是不同的硬盘， Claude 客户端就是计算机，只要有人帮你做好了数据线（MCP Server），你就能直接和 Claude 聊天让他帮你管理不同地方的数据了。


再简单直接点，每个 MCP Server可以理解为就是 Claude 客户端的一个工具，你安装一个工具，Claude 就多一项技能。


## 为什么要关注 MCP？


之前在使用 AI 工具时，我们通常面临两个困境：要么把所有数据上传到对话中，这既不安全又受限；要么给 AI 完全的系统访问权限，这风险太大。MCP 很好地解决了这个问题 - 它在 AI 和数据之间建立了一个安全的桥梁，我们可以根据需要给他权限。


以及目前其实大多数都是生成式和对话式 AI，你可以和他聊天，让他帮你解决问题，但是实际操作还得自己来。


但人类是懒惰的，最好是我跟你提要求，你直接给我干了，而不是你告诉我怎么做然后我还得自己来，这也是未来 AI 要走的方向。


目前很火的 AI 编程 IDE，可以主动帮你执行命令行和写代码就是在往这方面发展，但这毕竟是针对少数人群，大多数人并没有这种编码需求，但也希望 AI 能够做一些简单的事，例如帮我整理文件夹，帮我自动把 excel 里面的一组数据删掉然后发给领导。


而这些，就可以靠 MCP  Server 做到，你只要和 Claude 聊聊天，他就能帮你干活。


## 我的常用 MCP 工具箱


先说一下目前我配置了几个非常实用的 MCP 服务：

1. [Notion Server](https://github.com/suekou/mcp-notion-server)
- 可以让 Claude 直接读写我的 Notion 内容
- 帮我整理笔记、更新数据库
- 最常用来帮我整理学习笔记，写小红书产品宣传文案
2. [**Exa.ai 搜索**](https://github.com/exa-labs/exa-mcp-server)
- 直接在对话中完成网络搜索
- 不用切换窗口查找资料
- 搜索结果更有针对性
3. [**本地文件管理**](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- 批量处理文件
- 智能分类整理
- 自动重命名
4. [**命令行助手**](https://github.com/g0t4/mcp-server-commands)
- 帮我生成和执行命令
- 自动编写简单脚本
- 特别适合我这样的“命令行恐惧症”患者
5. **思维链工具**
- 让复杂任务变得清晰
- 帮助理清思路
- 类似 GPT-4O 的深度思考能力

还有很多的 MCP 服务，你可以在这里找到 [https://glama.ai/mcp/servers](https://glama.ai/mcp/servers)。


### 实际应用案例


分享一个最近的使用场景：


我需要整理一个技术博客的所有文章。以前我可能需要：

1. 写一个爬虫脚本
2. 处理格式转换
3. 手动分类整理

现在只需要：


```javascript
我：帮我获取这个博客的所有文章，整理成 Markdown 格式
Claude：好的，我来帮你：
1. 编写脚本获取文章
2. 转换格式
3. 按主题分类存储
[几分钟后]
已经完成了，文章都在 posts 文件夹中
```


![image.png](https://image.xcanoe.top/blog/58df0a22eb17cefedd2847afba68ddd9.png)


### 怎么用上 MCP


最好的教学当然是看[官方文档](https://modelcontextprotocol.io/introduction)，但是对很多人来说，没有必要也不想去了解原理，只想快速的用上。那下面是一种简单快速的使用方法。使用 [https://mcp-get.com/](https://mcp-get.com/)。mcp-get 可帮助你轻松安装和管理这些协议服务器。

1. 安装 Claude 客户端。
2. 在 mcp-get 中找到你想要安装的服务。
3. 复制命令到命令行中运行。

![image.png](https://image.xcanoe.top/blog/97e306db58934dc1f5a38e22a9b27ec6.png)

1. 遇到啥问题再搜索答案或者问 AI。
2. 安装完点击这个按钮看到你安装的服务就代表安装成功了。

![image.png](https://image.xcanoe.top/blog/005eb070dc7656c1d9216a0bf23d0971.png)


![image.png](https://image.xcanoe.top/blog/c63e5bfd75977e4bbaef92500b3b2c04.png)

1. 在对话中让 AI 使用某个工具执行，或者由他自己判断是否调用工具。

### 写在最后


MCP 给我最大的感受是：它让 AI 从一个单纯的对话工具，变成了一个真正的助手。虽然还有很多可以改进的地方，但这个方向很令人期待，未来一定也会有更多的增强和简化。如果你也在寻找提升工作效率的方法，不妨试试。从一个小任务开始，慢慢探索它的可能性。
