---
title: UIKit 新特性 - WWDC22
slug: uikit-new-features-wwdc22
description: ''
tags:
  - iOS
  - WWDC
pubDate: 2022-06-09
category: 技术
---

## 相关 Session


[bookmark](https://developer.apple.com/videos/play/wwdc2022/10068/)


## 强化生产力


### 改进了导航栏类型


在 iOS16 中，为了更好的适应 iPadOS 中桌面类型的应用 `desktop-class`，UIKit 引入了两种新的导航栏风格。

- Browser 用于浏览的导航栏。

    ![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609133602390.png](https://image.xcanoe.top/blog/9a197f80fbd461ed7bed477891f8df43.png)

- Editor 用于编辑的导航栏。
新的 navigationBarItem 可以支持拖动排序，类似于 mac 上的工具栏。
同时新增了一个标题菜单，和新的导航栏样式一起工作，并且支持一些标准功能，复制，移动，重命名等。只需要实现协议就可以直接展示在菜单中，也可以自定义显示的内容。

    ![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609133655427.png](https://image.xcanoe.top/blog/b1ff8bf4a52ac7feec6d2a098f54e344.png)


    ![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609134439780.png](https://image.xcanoe.top/blog/a7415081e5032ebac8f0196a79bdb394.png)


### 查找和替换文本


在 iOS16 中，我们只需要设置一个属性，就可以支持全局文本的查找和替换，在不同的应用程序之间一致的修改文本。支持的控件有 `UITextView`, `WkWebView` 等。


### 编辑菜单重大更新


选中文本的编辑菜单现在得到了更新，样式和交互体验更优秀。为了让不同平台上的体验更统一，现在引入了 `UIEditMenuInteractive` 用来替代 `UIMenuController`。新版本中 `UIMenuController` 被标记为废弃。这里具体的信息可以在 [Adopt desktop-class editing interactions](https://developer.apple.com/videos/play/wwdc2022/10071) 查看。


**以上这些是针对生产力进行的更新，这个 session 并没有说的很详细，想要了解具体实现方案，参考：**

- [Adopt desktop-class editing interactions](https://developer.apple.com/videos/play/wwdc2022/10071)
- [Build a desktop-class iPad app](https://developer.apple.com/videos/play/wwdc2022/10070)
- [Meet desktop-class iPad](https://developer.apple.com/videos/play/wwdc2022/10069)

## UI 控件增强


### UICalendarView 新的日历控件


![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609140539042.png](https://image.xcanoe.top/blog/62d034199793e9ab90092d1d5ae1cb19.png)


新的日历控件支持日期的单选和多选，可以进行标记和设置是否可选，相对于之前的日期选择控件，多了一些自定义，更加的灵活了。需要注意的是在创建 UICalendarView 的时候需要指定日期类型，比如公历。


![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609140846402.png](https://image.xcanoe.top/blog/e04ad174ed95e87c0aff271b58797d5e.png)


对每一个日期样式的定制，有一点需要注意下，customView 不允许交互，并且在指定的区域内展示，超出的会被裁切：


![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609140954306.png](https://image.xcanoe.top/blog/46c0c56e33445955470752ccca1cd917.png)


### UIPageControl 增强


UIPageControl 现在支持展示不同的排列方向了，横向竖向，从左到右从右到左。并且可以自定义图片了 (早该支持了)。


### 剪贴板隐私优化


在 iOS15 的时候，增加了剪贴板获取时的横幅通知，在 iOS16 上，这个逻辑再次调整了，现在变成了一个弹窗提示，而不是横幅提示，需要用户允许，应用才可以获取剪贴板的内容。为了优化用户的体验，我们可以使用新的系统控件 `UIPasteControl`，外观和行为类似于 button，点击之后获取剪贴板数据。


## API 完善


### UISheetPresentationController 增强


现在可以指定 sheet 的高度和百分比了，不过这些第三方库早就实现了，苹果做的也太慢了点，从 iOS16开始算起，至少还要两年才能用上。


### SF Symbols 新特性


现在系统提供的 SF Symbols 图标支持四种呈现模式，单色 `Monochrome`，多色 `multicolor`，分层


`hierarchical`，调色 `palette`。


![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609143848176.png](https://image.xcanoe.top/blog/b16452e92721338dfd4288440551366f.png)


在 iOS15 中，默认使用单色模式渲染，现在 iOS16 中，如果不指定渲染模式的话，不同的符号有不同的呈现方式，例如一些设备图标，会默认使用分层模式呈现。同时我们也可以自己指定不同的渲染模式。
`UIImage.SymbolConfiguration.preferringMonochrome()`


UIKit 也增加了对于可变符号的支持，允许 app 根据从 0 到 1 动态的呈现符号的变化。


![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609144515548.png](https://image.xcanoe.top/blog/84957d26ac1107d60ce4d7b2d0e30939.png)


现在也支持我们自己定义可变符号。可以在 [Adopt Variable Color in SF Symbols](https://developer.apple.com/videos/play/wwdc2022/10158)和[What's new in SF Symbols 4](https://developer.apple.com/videos/play/wwdc2022/10157)了解更多。


### Stage Manager


在 iOS16上，应用默认支持台前调度。如果使用了旧版本的 UIScreen API，我们还需要进行适配。现在不能假定应用运行在主屏幕上，应该用 UIScene API。


![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609145257060.png](https://image.xcanoe.top/blog/8f59f60fc7ef647e91f0cdc8437fe85b.png)


现在 `UICollectionView` 和 `UITableView` 多了一个属性，`selfSizingInvalidation` 单元格大小自适应，默认开启，当可见的单元格内内容发生变化的时候，cell 将会自动调整大小适应内容显示。
它的工作原理如下: 当启用 `selfSizingInvalidation` 时，单元格可以通过其包含的集合或表视图请求调整大小。
如果使用 `UIListContentConfiguration` 配置单元格，则自适应将在单元格的配置更改时自动发生。对于任何其他情况，可以调用 `cell` 或其 `contentView` 上的 `ValidateintrinsicContentSize` 方法来调整单元格的大小。默认情况下，单元格将使用动画来调整大小，但是我们可以在 `PerformWithoutAnimation` 中包装对 `validateintrinsicContentSize` 的调用，可以关闭动画。


## 使用 swiftUI 来构建 cell


现在已经将两个布局框架放在一起使用很简单，在 iOS16 中，我们有一种全新的方式让 swiftUI 来构建 Cell。


![UIKit_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_UIKit-20220609150933767.png](https://image.xcanoe.top/blog/9cb99c1e956ca9440c90f59e246f9db3.png)


简简单单一句话，就可以做到 UIKit 和 swiftUI 融合，这也太酷了，但是为什么要 iOS16 才能用！
更多的使用方式可以看 [Use SwiftUI with UIKit](https://developer.apple.com/videos/play/wwdc2022/10072)。


## UIDevice 废弃的属性


UIDevice. Name 现在不支持返回用户自定义的设备名，只返回通用的设备名。
UIDevice. Orientation 现在不支持了，使用 UIViewController 的 API，比如 `preferredInterfaceOrientation` 来获取界面方向。
