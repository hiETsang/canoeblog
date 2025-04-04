---
title: SwiftUI 新特性 - WWDC22
slug: swiftui-new-features-wwdc22
description: ''
tags:
  - swiftUI
  - swift
  - iOS
  - WWDC
pubDate: 2022-06-24
category: 技术
---

[bookmark](https://developer.apple.com/videos/play/wwdc2022/10052)


这个 session 主要介绍了 swiftUI 相关的新特性。


参考文档：

- [SwiftUI Index/Changelog](https://mackuba.eu/swiftui/changelog)
- [WWDC22 SwiftUI 和 UI 库相关专题](https://developer.apple.com/wwdc22/topics/swiftui-ui-frameworks/)
- [Learnning SwiftUI](https://developer.apple.com/tutorials/swiftui-concepts)
- [SwiftUI 主题](https://developer.apple.com/xcode/swiftui/)
- [SwiftUI Session](https://developer.apple.com/videos/swiftui-ui-frameworks)
- [SwiftUI 文档](https://developer.apple.com/documentation/SwiftUI)
- [Food Truck: Building a SwiftUI multiplatform app](https://developer.apple.com/documentation/swiftui/food_truck_building_a_swiftui_multiplatform_app) 一套代码适配 Mac、iPad 和 iPhone 的官方示例
- [Reda Lemeden 整理的 WWDC22 所有 SwiftUI 相关内容](https://redalemeden.com/collections/swiftui-2022/)
- [WWDC22 笔记](http://www.starming.com/2022/06/10/wwdc22-notes/#SwiftUI-2)
- [What's New In SwiftUI － 小专栏](https://xiaozhuanlan.com/topic/3615907284)

今年的 swiftUI 又新增了很多新的特性和功能，如果想要开始学习使用 swiftUI，现在是比较好的时机，用来开发简单的 app 已经没有什么问题，但是要用在正式的项目中还是得慎重。下面我分别介绍下 swiftUI 的新特性。


![SwiftUI_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_SwiftUI-20220801221715371.png](https://image.xcanoe.top/blog/36cae7b1a3d2930ac0f4a9fe65e73d25.png)


## Swift Charts


目前 iOS 如果想要绘制图表，我第一个想到的应该是 github 上排第一的 [GitHub - danielgindi/Charts](https://github.com/danielgindi/Charts)，底层使用 CoreGraphics，非常强大，但是缺点是对 Accessibility 支持有限。苹果新推出的 Swift Charts 可视化数据，使用 SwiftUI 语法来创建，还可以使用 ChartRenderer 接口将图标渲染成图。
关于 Swift Charts，官方文档 [Swift Charts](https://developer.apple.com/documentation/Charts)，入门 Session： [Hello Swift Charts](https://developer.apple.com/videos/play/wwdc2022/10136/)，Apple 官方介绍 [Creating a chart using Swift Charts](https://developer.apple.com/documentation/Charts/Creating-a-chart-using-Swift-Charts)。高级定制和创建更精细图表，可以看这个 Session: [Swift Charts: Raise the bar](https://developer.apple.com/videos/play/wwdc2022/10137)，这个 session 也会提到如何在图表中进行交互。这里是 session 对应的代码示例 [Visualizing your app’s data](https://developer.apple.com/documentation/charts/visualizing_your_app_s_data) 。关于图表设计的 session，[Design an effective chart](https://developer.apple.com/videos/play/wwdc2022-110340) 和 [Design app experiences with charts](https://developer.apple.com/videos/play/wwdc2022-110342) 。
一些特性：

- 可以装载数据，BarMark 用于创建条形图，LineMark 用于创建折线图。PointMark、AxisMarks、AreaMark、RectangularMark 和 RuleMark 用于创建不同类型的图表。
- API 使用非常简单清晰，代码量非常少，对开发者很友好。
- 支持自动深色模式。

社区做的更多 Swift Charts 范例 [Swift Charts Examples](https://github.com/jordibruin/Swift-Charts-Examples) 。


## Navigation and windows


navigation bar 有新的默认行为，如果没有提供标题，导航栏默认为 inline title 显示模式。使用 `navigationBarTitleDisplayMode(_:)` 改变显示模式。如果 navigation bar 没有标题、工具栏项或搜索内容，它就会自动隐藏。使用 `.toolbar(.visible)` modifier 可以显示一个空 navigation bar。


### Stacks


`NavigationStack` 是一个新的用于 push 和 pop 的导航栏容器。替代了 `NavigationView`，现在使用新的数据驱动的 API `.navigationDestination(for: ...)`，`NavigationLink` 现在可以传入代表目的地的值，不止如此，我们可以通过传入 `path` 给 `NavigationStack` 来实现控制导航控制器的堆栈。
新的导航方案废弃了 `NavigationView`, 引入了 `NavigationStack` 和 `NavigationSplitView` 来实现导航功能。采用导航路径数据驱动视图的方式，而不再需要我们手动逐个管理 `NavigationLink` 的状态，成功地解决了导航路径状态难以管理的难题。与此同时，新方案提出了 `NavigationLink` 和目标视图分离的方案，解决了目标视图会被重复创建的诟病。


### Split Views


SwiftUI 为了方便在大屏上做分屏显示，提供了一个非常便利的分屏视图 `NavigationSplitView`, 它能根据不同平台屏幕的尺寸把视图分两列或者三列显示。在小屏幕上显示时，自动折叠成单列。而 `NavigationStack` 即使在大屏上，也只是单列显示。其实也就是对应了 UIKit 中的 `UISplitViewController`。


关于 `NavigationStack` 和 `NavigationSplitView` 的详细使用示例，可以看[【WWDC22 10054】SwiftUI 新导航方案 － 小专栏](https://xiaozhuanlan.com/topic/7841259603)。


参考：

- [Migrating to New Navigation Types](https://developer.apple.com/documentation/swiftui/migrating-to-new-navigation-types?changes=latest_minor) 官方迁移指南
- [NavigationStack](https://developer.apple.com/documentation/swiftui/navigationstack?changes=latest_minor)
- [NavigationSplitView](https://developer.apple.com/documentation/swiftui/navigationsplitview)
- [The SwiftUI cookbook for navigation](https://developer.apple.com/videos/play/wwdc2022/10054/)

### Window


SwiftUI app 的结构是由 App， Scene 和 View 共同组成的统一的所有制层次结构。App 包含一个或多个 Scene，而 Scene 作为 View 的容器包含了很多的 View。Scene 是一个协议，我们目前最常用的 WindowGroup 就是符合 Scene 协议的 scene type，系统会根据 Scene type，平台特性及上下文以不同的方式调整 Scene 的展示行为, 可能会填满整个屏幕或部分屏幕等，在诸如 iPadOS 和 macOS 这样支持多窗口的平台上，一个 WindowGroup 可以包含多个相同类型的窗口。
现有的 Scene types。

- **WindowGroup** - 这个 Scene 提供了一种跨 Apple 平台的构建数据驱动 app 的方法；
- **DocumentGroup** - 可以在 iOS 和 macOS 上构建 document-based apps;
- **Settings** - 可以定义一个在 macOS 中进行应用设置的 Window。

这次新增了两个 scene types：

1. **Window**，在 MacOS 上表示一个唯一的，单一的 Scene；
2. **MenuBarExtra**，在 macOS 系统的菜单栏中呈现为常驻控件。

如果你的应用在 mac 上限制了只展示一个窗口，就可以使用新的 Window，例如游戏。


```swift
@main
struct PartyPlanner: App {
  var body: some Scene {
    WindowGroup("Party Planner") {
      PartyPlannerHome()
    }

    // 👇🏻 🆕
    Window("Party Budget", id: "budget") {
      Text("Budget View")
    }
    .keyboardShortcut("0")
  }
}
```


MenuBarExtra 这是显示在右上角状态栏下方的窗口，在 app 运行的时候显示，也可以单独提供一个 MenuBarExtra 做为主要的 scene 。


```swift
@main
struct PartyPlanner: App {
  var body: some Scene {
    Window("Party Budget", id: "budget") {
      Text("Budget View")
    }

    MenuBarExtra("Bulletin Board", systemImage: "quote.bubble") {
      BulletinBoard()
    }
    .menuBarExtraStyle(.window)
  }
}
```


## Advanced controls


### Forms


新增 `.formStyle(.grouped)` 用来改进在 macOS 上的表单，今年 MacOS 的控制中心，字体册，还有系统设置的大部分都是使用 swiftUI 进行开发。


### Controls

- `TextField` 和 `Text` 可以限制行数，最小行和最大行。

```swift
Text("Hello World")
    .lineLimt(2...3)

TextField("Description", text: $description, axis: .vertical)
    .lineLimit(5...10)
```

- `MultiDatePicker` 日期选择器支持多选。
- 使用`DisclosureGroup`将多个状态组合成一个，统一管理。

```swift
DisclosureGroup {
    Toggle("Balloons", isOn: $includeBalloons)
    Toggle("Confetti", isOn: $includeConfetti)
    Toggle("Inflatables", isOn: $includeInflatables)
    Toggle("Party Horns", isOn: $includePartyHorns)    
} label: {
    Toggle("All Decorations", isOn: [
        $includeBalloons,
        $includeConfetti,
        $includeInflatables,
        $includePartyHorns
    ])
}
```


![SwiftUI_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_SwiftUI-20220803211355863.png](https://image.xcanoe.top/blog/3eb24da286d75c036ad7916eda574c06.png)

- Button Styles 现在支持应用到类似按钮外观的控件，包括 toggle, menu, 和 picker。
- `Stepper` 新增 format 的能力，支持多种类型，例如百分比。现在也可以在 watchOS 上使用。
- SwiftUI 引入一个新显示进度的视图 Gauge。

### Tables

- `Table` 现在支持 iOS 和 iPadOS。
- 默认在 iOS 中只显示首列，性能和 List 差不多，估计只是为了兼容 MacOS 代码。
- 允许定义高级的上下文菜单。
- 在 iPadOS 上有新的 ToolBar，可以和 MacOS 一样自定义顶部 Toolbar。

### Search

- 搜索框现在支持搜索字段，通过新的搜索修饰符。
- `.searchable` 支持 token 和 scope。

```swift
struct PSearchTokensAndScopes: View {
    enum AttendanceScope {
        case inPerson, online
    }
    @State private var queryText: String
    @State private var queryTokens: [InvitationToken]
    @State private var scope: AttendanceScope
    
    var body: some View {
        invitationCountView()
            .searchable(text: $queryText, tokens: $queryTokens, scope: $scope) { token in
                Label(token.diplayName, systemImage: token.systemImage)
            } scopes: {
                Text("In Person").tag(AttendanceScope.inPerson)
                Text("Online").tag(AttendanceScope.online)
            }
    }
}
```


## Sharing


### Photos Picker

- 支持图片选择器。
- 可以对选择的内容进行过滤和自定义。

### Sharing

- 新的 `ShareLink` API，来使用系统的分享功能，和 `UIActivityViewController` 类似，可以针对多个平台自动适配。
- 使用 `dropDestination` 来接收外部传入的数据，支持 `String`, `Data`, `URL`, `Attributed String` 以及 `Image` 等类型的数据。
- 只要遵循 `Transferable` 协议，其他类型的数据也可以传递。

## Graphics and layout


### ImageRenderer


可以将 SwiftUI 的 View 生成图片。
官方参考文档 [ImageRenderer](https://developer.apple.com/documentation/swiftui/imagerenderer)


### SF Symbol

- SF Symbol 4.0 支持变量值，可以通过设置 variableValue 来填充不同部分，比如 wifi 图标，不同值会亮不同部分，`Image(systemName: "wifi", variableValue: 0.5)` 。
- 并且新增了阴影和渐变，可以通过代码自定义。

### Text


Text 现在可以在修改字重，风格还有布局的时候通过动画过渡，只需要使用 `withAnimation`。


### Layout

- 新增了 Grid 视图，来同时满足 VStack 和 HStack，`Grid` 提供了一种新的布局方式，不再局限于 `LazyVGrid/LazyHGrid`，开放了 `GridRow` 与 `.gridCellColumns(count)`。

```swift
var body: some View {
    Grid {
        GridRow {
            NameHeadline()
                .gridCellColums(2)
        }
        GridRow {
            CalendarIcon()
            SymbolGrid()
        }
    }
}
```


![SwiftUI_%E6%96%B0%E7%89%B9%E6%80%A7_-_Whats_new_in_SwiftUI-20220803215718928.png](https://image.xcanoe.top/blog/b03aedb6e039807be1ec8f46c6353eda.png)

- 可以通过自定义 `Layout` 满足更多的布局要求，与 UIKit 中的自定义 `UICollectionFlowLayout` 类似，遵循 `Layout` 协议，提供每个元素所在位置，并且根据协议提供的子视图来返回父视图所需空间即可完成。相关使用：[The Layout Protocol](https://talk.objc.io/episodes/S01E308-the-layout-protocol) 。
- `ViewThatFits` 允许根据适合的大小放视图。`ViewThatFits` 会自动选择对于当前屏幕大小合适的子视图进行显示。[示例效果](https://twitter.com/ryanlintott/status/1534706352177700871) ，对应示例代码 [LayoutThatFits.swift](https://gist.github.com/ryanlintott/d03140dd155d0493a758dcd284e68eaa)。

更多 swift 布局相关的资料可以参考[在 SwiftUI 中组合各种自定义布局](https://xiaozhuanlan.com/topic/1507368249)。


## 总结


今年的 swiftUI 又是一次大的更新，很明显 apple 的重心正在往这种现代化布局框架迁移，但是有一说一，目前的稳定性还达不到正式在项目中使用的程度，况且 iOS16 的新特性如果要上线使用至少也要两年后。不过提前学习了解一定对将来有帮助。
