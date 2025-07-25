---
title: 没学过设计，我用这种方法给App做了个不错的Logo
slug: app-logo-design-method-for-non-designers
description: '分享一个简单实用的App Logo设计方法，即使没有专业设计背景也能做出不错的效果'
tags:
  - 设计
  - App开发
  - 工具
  - 独立开发
pubDate: 2025-06-19
category: 设计
---

# 没学过设计，我用这种方法给App做了个不错的Logo

先看看成果：

![](https://image.xcanoe.top/blog/1750346900.png)

这是我给即写设计的Logo，有着类似iOS原生应用的渐变和阴影，支持亮色暗色模式，自适应iOS 26的液态玻璃效果，还能生成各种不同色调的图标变体。

我不是专业设计师，没有很高的设计水平，但我还挺喜欢这个最终效果的。关键是，**这个方法真的很简单**，学会之后你也能快速设计出想要的Logo。

> **关于即写**：这是我正在开发的一款文字处理App，目前内测中。我想把它打造成文字处理的第一站，让任何碎片文字通过简单的2-3步（导入→编辑/AI处理→导出）快速变成成品内容。

## 为什么不用AI生图了

之前我一直用ChatGPT生图来做应用图标，效果也还行，但有几个让人头疼的问题：

- **没有矢量图**，不能根据需要动态调整
- **图片放大后细节模糊**，不够清晰
- **不能生成不同色调**，比如亮色暗色版本

下面左边我之前用ChatGPT生成的图标，效果还可以，但是想要微调难度较大：

![](https://image.xcanoe.top/blog/1750346914.png)

最近我发现 WWDC上，苹果发布了一款图标制作应用 —— [Icon Composer](https://developer.apple.com/documentation/Xcode/creating-your-app-icon-using-icon-composer)。没错，**这就是我们这次的主角**，有了它我们就能非常方便地制作适配iOS 26液态玻璃效果的图标。

## 设计思路：从产品特点出发

在动手之前，我先想清楚了几个问题：

**即写要传达什么感觉？**

- 轻盈、简洁
- 打开即写的特点
- 像便签、草稿纸的感觉
- 让人联想到现实中熟悉的物品

**怎么遵循Apple的设计风格？**

- 图层不要太多
- 通过叠加体现层级
- 简洁但有细节

基于这些思考，我想到用**矩形表示纸张**，通过叠加来营造层次感。

## 具体制作过程

### 第一步：在Figma中创建基础图形

我在Figma中创建了两个圆角矩形，通过一定角度叠在一起：

![](https://image.xcanoe.top/blog/1750346922.png)

- **渐变背景**：营造整体氛围
- **黄色矩形**：代表正在编辑的便签
- **白色矩形**：代表底部干净的草稿纸

这就是最基础的版本了，没有任何细节，并且总感觉缺点什么，太单调了。

**这里有个小技巧**：如果你要做复杂一点的图标，可以到[iconify.design](https://iconify.design/)这些icon库搜索SVG图标，拖进Figma调整就行，不用自己画。

### 第二步：添加产品特色元素

我想到给便签加个**输入光标**，让人有正在编辑的感觉：

![](https://image.xcanoe.top/blog/1750346929.png)

就是一个简单的圆角矩形，但瞬间让整个图标有了"正在使用"的感觉。

基础图标主体就完成了。说实话，这也是我在Figma里能做的极限了，再往下的细节、质感、毛玻璃效果我就不太会了。但还好我们有Icon Composer。

### 第三步：Icon Composer魔法时间

将Figma中的三个图层**导出为SVG**，新建Icon Composer文件，拖入进去：

![](https://image.xcanoe.top/blog/1750346937.png)

界面很简单：

- **左边**：图层管理
- **中间**：预览和背景切换
- **右边**：参数调整

**重要提示**：官方建议一个图片放一个图层，方便单独调整效果。

调整位置，恢复我们在 Figma 中的排版效果：

![](https://image.xcanoe.top/blog/1750346948.png)

**神奇的是**，我几乎不用怎么调，整个Logo的效果已经非常优雅了！此时我们可以在中间预览区域调整画布的背景和玻璃光线角度，模拟真实设备效果。

### 第四步：精细调整

图片和 Group都能在右侧调整不同的参数，例如是否应用镜面反射，模糊程度，透明度，阴影等等，可以根据自己喜欢的效果大胆的去调整。

![](https://image.xcanoe.top/blog/1750346957.png)

可以点击预览区域右下角查看**不同模式下的效果**，每个模式的参数都是独立的，可以针对性优化。比如暗色模式下可能需要调亮一些，亮色模式下阴影可以重一点。

完成后选择最上级文件，调整整个应用的背景色，保存为 **.icon文件**。

## 如何在项目中使用

### Xcode 26中使用

**直接拖入项目**：

1. 将.icon文件拖入项目（文件夹目录，不是assets）
2. 在Target中设置App Icon为对应名称

我建议命名为`AppIcon.icon`，这样能和assets里的AppIcon统一。**Xcode 26以下版本会用assets里的图标，新版会自动使用.icon文件**。

### 导出为图片

如果需要在其他地方使用，可以在Icon Composer中**导出所有变体图标**：

![](https://image.xcanoe.top/blog/1750346966.png)

**注意**：导出的图标是带圆角的。如果要用在旧版本上，需要去掉透明通道。我用即梦或Figma插件去掉背景，保持主体，然后手动加矩形背景再导出。

## 一些思考

最后谈谈我的想法，其实用什么工具不重要，**重要的是你想表达什么**。

好的 Logo 不需要太复杂，不需要多炫酷，而是能让人一眼看出你的产品特点。即写的 Logo 很简单——两张纸+一个光标，它想传达的信息很清楚：这是个让你专注写作的工具。

有了Icon Composer这样的工具，我们可以把更多精力放在**思考产品特性**上，而不是纠结设计上的实现。

如果你也在做独立应用，不妨试试这个方法。先想清楚你的产品是什么，想解决什么问题，然后用最简单直接的方式表达出来。

---

**参考文档**：[使用 Icon Composer 构建图标 - WWDC25](https://developer.apple.com/cn/videos/play/wwdc2025/361/)