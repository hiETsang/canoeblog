---
title: 关于 DeepSeek，知道这些就够了
slug: about-deepseek-know-these-enough
description: ''
tags:
  - AI
  - 工具
pubDate: 2025-02-07
category: 思考
---

最近 DeepSeek 是真的火，每天的信息流被 DeepSeek 资讯塞满了，什么"DeepSeek 免费版血虐付费版 Claude"，"本地化部署 DeepSeek 教程" 一大堆。


不可否认， DeepSeek 非常牛逼，也很好用，但是高涨的热度多多少少让一些自媒体操作变形，各种蹭热度的论调都来了。其实对于我们普通人而言，知道 DeepSeek 是个什么东西，怎么用，怎么用好就够了。


作为一个天天和 AI 打交道的程序员，今天我就从科普和使用的角度快速简要的为大家讲清楚 DeepSeek。


## 什么是 DeepSeek？它为什么这么火？


DeepSeek 是一个类似 chatgpt 的生成式人工智能对话平台，同时也提供 API 供各种应用调用。


它现在主打两个版本：V3 和 R1。


V3 是去年12月底发布的，用了一个叫"专家混合"(MoE)的架构，简单说就是让 AI 变得又快又省。而今年1月刚发布的 R1 才是重头戏，这货直接让 AI 具备了超强的推理能力。


**V3 vs R1 怎么选？**


![image.png](https://image.xcanoe.top/blog/60b216c95d101edcf4311a867f1269f7.png)


这一波真正爆火的是 R1 模型，首先因为它是一个推理模型，能够像人一样拆解问题，分析问题，因果推断，不对，应该说在分析推理方面它做的比大部分人都要好。


其次是它完全开源，连蒸馏版模型都开放下载，这意味着所有人所有公司都能直接免费用它的模型，对应的 chatgpt 的 o1 你必须每个月花 20 美元成为 plus 会员才能使用，且每周只有50次的使用权限，效果上甚至 R1 更胜一筹，这简直是对 openai 的啪啪打脸。


最后是官网还支持联网查询，弥补了知识库的时效性问题，对中文也有专门的优化，在中文语境下的理解和生成能力优于多数西方模型。


对于普通人来说，DeepSeek 让你可以免费使用目前世界上最顶级的带推理能力能联网的 AI，对于企业来说，可以免费基于 R1 模型做微调和蒸馏，部署，不需要考虑隐私安全和价格因素。可以说 DeepSeek 简直就是活菩萨，凭一己之力推动了整个社会的智能化进程。


## 怎么用上 DeepSeek？


说了这么多，一般人怎么用上 DeepSeek 呢？这可能是大家最关心的问题了。使用方式按照我的优先级给你排个序：

1. 官网直接用（但最近经常被挤爆，我已经对服务器繁忙 ptsd 了）
2. 秘塔 AI（搜索内置了 R1，体验还不错）
3. 硅基流动 + Cherry Studio （注册硅基流动获取 API Key，Cherry Studio 来调用 DeepSeek 的 API）
4. Cursor （内置 R1，但目前也经常报错）

具体咋用，网上教程一大堆，稍微搜一下就知道了，不行就问题下其他的 AI，也是分分钟搞定。需要注意的是官网对话需要选中深度思考(R1)才是使用推理模型，否则是使用的V3。


![image.png](https://image.xcanoe.top/blog/a91890d80c06a8558e06c4569727110e.png)


最近看到好多自媒体在教怎么本地部署 DeepSeek，我直接笑出声。本地部署的版本跟官方版本差太多了，我上面说的使用方式都是满血版，本地部署由于设备的限制，部署的基本都是「青春版」，不仅缺失联网等核心功能，对硬件要求还贼高。一般人要的很简单，就是用上地表最强 AI，那直接选现成服务，别瞎折腾。


![image.png](https://image.xcanoe.top/blog/49fce75385efe3f1c404e980d14e622b.png)


## 怎么用好 DeepSeek？


之前那些"角色扮演"、"思维链提示"之类的花里胡哨的提示词技巧，在 DeepSeek 这儿统统用不上！这也是 DeepSeek 推理模型的一大好处，只需要表达清楚你的需求就行。


我现在跟 DeepSeek 聊天就三个原则：

1. 说清楚你的需求，背景和目标（不要：「写网站用户增长方案」而是：「给日销 5 万的美妆独立站设计 30 天用户增长方案，要求包含 TikTok 引流策略和 ROI 测算」）
2. 想要什么风格就直说（比如："用李佳琦直播话术风格写防晒霜文案"）
3. 多给点你的知识状态（"这是给完全不懂技术的老年人看的"、"用小学生能理解的方式说明"）

总之就是：说人话！不要搞那些花里胡哨的东西，但要详细明确。


![image.png](https://image.xcanoe.top/blog/741260e6919f2071fb05db0c08c76079.png)


## 总结


当全网还在研究如何「调教」AI 时，DeepSeek 已让技术回归本质----


你说人话，它干人事。


这种「去魔法化」的革新，或许才是 AI 普惠的真谛。
