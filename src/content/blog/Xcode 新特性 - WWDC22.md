---
title: Xcode 新特性 - WWDC22
slug: xcode-new-features-wwdc22
description: ''
tags:
  - iOS
  - WWDC
pubDate: 2022-06-12
category: 技术
---

[bookmark](https://developer.apple.com/videos/play/wwdc2022/110427/)


这个 session 主要介绍了 Xcode 相关更新，其中包含了 swift5.7，对泛型和协议有了大的改进。


相关文档：

- [WWDC22 开发工具专题](https://developer.apple.com/wwdc22/topics/developer-tools/#current)
- [配置多平台应用程序](https://developer.apple.com/documentation/Xcode/configuring-a-multiplatform-app-target)
- [使用 DocC 给应用程序、框架、包创建文档](https://developer.apple.com/documentation/Xcode/documenting-apps-frameworks-and-packages)
- [在设备上启用开发者模式](https://developer.apple.com/documentation/Xcode/enabling-developer-mode-on-a-device)
- [Xcode 14 Beta Release Notes](https://developer.apple.com/documentation/Xcode-Release-Notes/xcode-14-release-notes)
- [Demystify parallelization in Xcode builds](https://developer.apple.com/videos/play/wwdc2022/110364/)
- [Use Xcode to develop a multiplatform app](https://developer.apple.com/videos/play/wwdc2022-110371)
- [Use Xcode for server-side development](https://developer.apple.com/videos/play/wwdc2022-110360)
- [Simplify C++ templates with concepts](https://developer.apple.com/videos/play/wwdc2022-110367)

Xcode 做为 iOS 开发指定 IDE，苹果生态的开发者对它的态度很多都是无奈吐槽，缺点确实有很多，例如智能提示不够智能，包体积大，编译时间长，preview 不好用，还偶尔耍脾气崩溃，简直让人无语。吐槽归吐槽，我们也不得不用它，也是一直期待它能越来越好，Xcode 毕竟历经十多年了，工程架构之庞大我们肯定无法想象，在其之上每年更新优化难度也可想而知。这几年 Xcode 的确也在不断的变化，例如 UI 变得越来越好看，一些缺点也在慢慢改进。今年 Xcode14 也是一次大的提升，让我们来看看有哪些更新吧。


## Xcode 自身优化

- 安装包体积缩小了 30%，watchOS 和 tvOS 平台可选安装。
- 编译速度提高 25%，编译时的串行流程尽可能的并行化，充分利用了多核并行处理能力。
- 测试速度优化，同样使用并行技术来优化测试速度。
- 改进了在 iOS 设备上调试 Swift 程序的性能。
- 可以在 assets 中提供一个 1024 的 logo，Xcode 会自动生成其他大小的。
- 发布 macOS 应用程序在 Xcode 14 中更快。
- 针对 xib 和 storyBoard，打开相关 nib 文件速度提升了 50%，在设备栏中切换 iPhone、iPad 速度提升了 30%。
- Xcode Organizer 中新增 Hang 报告，用来提供主线程上发生挂起的调用堆栈信息，以及提供设备和 iOS 版本信息等统计信息。
- Xcode 14 现在支持为 iPadOS 开发 DriverKit 驱动程序。
- 创建新 C++ 项目，Clang 默认使用 C++20。已经实现了几篇 C++20 和 C++2b 论文。
- iOS、tvOS 和 watchOS 的构建默认不再包含 bitcode。
- legacy 构建系统被删除，LLVM 14 也不再支持 legacy。
- 不再支持Xcode Server。

## 编辑器优化

- 滚动时置顶类、结构体和函数名。错误消息在重新处理时会变暗。
- Xcode 搜索和替换栏中可以使用正则表达式。
- 代码提示更加智能，比如写 struct 的 init 可以自动完成。Codable 的 encode 也可以自动完成。
- 优化了方法被调用展示的 UI。
- 支持了 Regex 表达式语法高亮。`Editor > Refactoring > Convert to Regex Builder` 可以将正则文本转成等效 Regex builder。

## Xcode Preview

- preview 增强，默认交互式，可以自动刷新界面，迅速响应改变。
- 预览界面新增不同的 mode 切换按钮，不需要代码创建 preview，例如 darkMode，不同方向等。

## Swift Packages

- 引入新参数 moduleAliases 来为冲突的模块定义唯一名称，并以新名称构建而不用改代码。注意的是起别名的模块要是纯 Swift 模块。
- 允许使用 Swift Package command plugins。Xcode 为 Swift Package plugins 提供了 XcodeProjectPlugin 接口，这个接口扩展了 Swift Package Manager 的 PackagePlugin 接口。用这个接口可以获得 Xcode 项目结构的简化描述。

session 有 [Meet Swift Package plugins](https://developer.apple.com/videos/play/wwdc2022-110359) 和 [Create Swift Package plugins](https://developer.apple.com/videos/play/wwdc2022-110401) 。


## 编译时间可视化


Xcode 14 中已经集成了 timeLine 功能，通过对编译 timeLine 的查看，我们可以很直观的了解到整个构建流程各个任务的耗时大小、串行阻塞、并行数量等信息，有了这些信息，我们就可以做些点对点的优化，这将大大降低我们的优化成本。


![Xcode__-_Whats_new_in_Xcode14-20220731181201713.png](https://image.xcanoe.top/blog/300ccd1caf87dc5c73788d69a3f47e2a.png)


在编译日志页面，选中右上角 `Assistant` 就能看到构建的时间线（可以查看历史的构建）


## 多平台


Xcode 14 专为多平台而生，现在，我们可以使用单一的 target 来定义我们的应用程序以及需要支持的平台，这样我们只需要处理每个平台特殊的配置而不必保持设置和文件间的同步  。
Xcode 14 中，单一的 SwiftUI 界面，在 iOS、iPadOS、macOS 和 Apple tvOS 上均可使用，这样我们的代码在易于维护的同时也可以达到利用每个平台的独特功能的目的。
更多关于使用 Xcode 构建多平台 App 参考：[Session 110371 - Use Xcode to develop a multiplatform app](https://developer.apple.com/videos/play/wwdc2022/110371/)


## 调试

- 内存调试器增强。
- LLDB 可以显示命令执行进度。
- 可以使用 `xcrun crashlog <path/to/crash>` 来调用 LLDB 的崩溃日志脚本。
- 在 Xcode 14 中，当我们调试应用程序时，线程性能检查器会在问题导航器和源代码编辑器中显示运行时的性能问题，我们可以在应用程序 target 的 Run Scheme 中打开线程性能检查器来开启此功能。
- Xcode 14 中展示了一个新的启动日志，这个日志中会包含 Xcode 在 app 安装、启动和调试阶段的各项操作。
- LLDB 新增命令： `swift-healthcheck`，当某个 swift 表达式不生效时，可以用这个命令直接访问编译器进行诊断。
- Hangs可以用来检测线上应用的卡顿情况。session：[Session 10082 - Track down hangs with Xcode and on-device detection](https://developer.apple.com/videos/play/wwdc2022/10082/)

## Instrument

- Hang Tracing 工具，可以显示应用程序的主线程什么时候无法长时间处理传入事件，从而导致 UI 卡住。
- Runloop 工具，显示 runloop 的使用和单独的迭代，视觉上区分了进程中所有 runloop 的 runloop sleep 和 busy interval。
- Instrument 新模板更方便调试 distributed actors 和其它 Swift concurrency 特性。
- memory graph 调试器可以显示 memory graph 的所有传入和传出引用。
- Instrument 现有一个新的 Swift Concurrency 模板，用于跟踪 swift concurrency 的使用。这个模板包括 Swift Tasks 工具，可显示随时间变化的 task 的状态，总结 task 状态，提供详细的 task 描述，task 关系和 task 创建 callstacks 的调用树结构。还有 Swift Actors 工具，可以跟踪 actor 之间的 task 行为，显示每个 actor 的 task 队列，并帮助诊断 actor-isolated 代码等问题。
- Instrument 里的代码查看更好显示包含了性能数据。Interleave 模式，可以同时查看源码和关联的反汇编。源码查看现在会在源码和反汇编判断显示 CPU 计数器，PMC 事件和动态公式。

## 总结


这次 Xcode 更新可以说是超大杯，相信能给 apple 生态的开发者们带来更好的开发体验, 不过还是那句话，基础体验做好一些，内存占用降低一些，流畅一些，崩溃少一些就是最好的优化，希望正式上线之后不要让我们失望。最后，大家对 Xcode14 感兴趣的可以下载体验。


[bookmark](https://developer.apple.com/download/applications/)
