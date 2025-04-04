---
title: 使用 UISplitViewController 优化大屏分栏式体验
slug: optimize-split-view-controller-for-large-screen
description: ''
tags:
  - iOS
pubDate: 2021-06-17
category: 技术
---

在日常的使用中，我们可能会注意到 iOS 系统应用以及一些优秀应用在 iPad 以及一些宽屏设备上拥有着良好的体验效果，和在 iPhone 上的单页面不同，他们展示的效果是分栏式的，左右两边排布着两个页面，在大屏设备上可以很好的提高我们的使用效率以及良好的视觉感受。


最直观的效果，我们可以打开手机的自动屏幕旋转，然后打开设置 app，横屏使用。


![pRZvlko5t2K6x7m.png](https://image.xcanoe.top/blog/da499d97b58b8e39916aebcf7a8461eb.png)


这种效果可以更好的适配宽屏，最大化的利用屏幕空间，也可以让一些 iOS app 在 iPad 上看起来不那么奇怪，并且苹果也发布了M1芯片的 mac，让所有的 app 可以不需要做任何操作直接在 mac 上 Appstore 下载运行，如果我们不对当前的 app 进行一定的适配，在 Mac 上将不能拉伸窗口，只能通过一个固定的尺寸使用，随着 M1的普及以及 iPad 的生产力增强，app 在各种尺寸的屏幕上适配也是大势所趋。一看之下感觉开发起来很难成本很高，从控制一个页面变成两个页面甚至多个页面似乎要做很多界面上的处理，但实际上系统提供的 UISplitViewController 可以很好的满足我们的需求，接下来将介绍如何通过UISplitViewController 在各种屏幕上塑造良好的应用体验。


## 一、基础知识


### 基本概念 Compact & Regular


![SMuNlHWGpxDT6h2.png](https://image.xcanoe.top/blog/c07a1d9c7ed3a583bf6aebb10ff5ecd2.png)


首先我们了解一些基础的概念，UIKit 在 iOS8上提出了 SizeClass 的方式，来帮助开发者解决屏幕适配的问题。SizeClass 中包含两个类型 Compact 和 Regular，可以理解为 UIInterface 宽度或者高度有一个默认的高度值和宽度值，高于这个值就被认为是 Regular 常规尺寸，低于这个就被认为 Compact 紧凑尺寸。

- Compact 指的是紧凑型，意味着有限的空间，分别在宽高上对应着 wC 和 hC。
- Regular 指的是 常规型，意味着无限的空间，分别在宽高上对应着 wR 和 hR。

我们也可以在 xib 上看到这些值的身影，例如字体和颜色，通过针对其进行特殊的设置，可以实现不同类型的界面上显示不同的颜色和字体。


![6K1GgyokWjAsTw2.png](https://image.xcanoe.top/blog/8f7861b0c571efb83dc14cdff21d2afd.png)


知道了 Compact 和 Regular 的含义，我们就可以知道什么状态下显示分栏，什么时候显示单页面了。UISplitViewController 会在屏幕宽度为 Compact 的时候显示单页面，在 Regular 的时候显示分栏，这是系统默认控制的。


### 了解控制器 UISplitViewController


UISplitViewController 继承自 UIViewController，为了方便理解，中文将它称为分栏控制器，如果我们需要使用它，苹果建议将他设置为 rootViewController。在 iOS14 上，苹果对 UISplitViewController 新增了很多的API，之前只支持两列，分别为 primary **主控制器**，secondary **二级控制器** ，iOS14 可以支持三列，分别为 primary **主控制器**，supplementary **附加控制器** ，secondary **二级控制器**，因为大多数的应用还需要支持 iOS14 之前的版本，并且新增的 API 都很简单，下面就以 iOS14之前的 API 为主。


![jwDidzvtgXCT4yB.png](https://image.xcanoe.top/blog/63b111ac743f9eb8688cb334299506bc.png)


UISplitViewController 有一个 Bool 类型的属性 [`isCollapsed`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/1623185-iscollapsed)，表示是否折叠，这个属性对应着两种状态，一个是 _collapsed/折叠_，以及 _expanded/展开_，在 Compact 紧凑型视图上是折叠的，这个时候默认会展示 primary **主控制器** ，此时是没有分栏效果的，就是单页面展示，在 Regular 常规型视图上是展开的，也就是能够分栏展示。[`isCollapsed`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/1623185-iscollapsed) 是只读的，我们不能手动设置，是系统根据当前视图是 compact 或者 Regular 来自动控制的。


在分栏控制器展开状态下，我们可以注意到不同的 app 分栏的展示形式不太一样，有的是并排展示，有的是屏幕边缘右滑触发显示，如下图，这是因为分栏控制器有着不同的显示模式，对应的属性为 [`UISplitViewController.DisplayMode`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymode)。我们可以通过赋值[`preferredDisplayMode`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/1623170-preferreddisplaymode)来设置我们偏好的显示模式，系统会尽量满足我们的偏好，如果不设置的话，默认为 automatic，这种情况下在 iPad 竖直状态 primary **主控制器**是隐藏在侧边栏，也就是 oneOverSecondary状态，横屏模式下是默认并排展开，也就是 oneBesideSecondary。下图就是 iOS14支持的一些显示模式，iOS14之前只支持下图中的[`secondaryOnly`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymode/secondaryonly)，[`oneBesideSecondary`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymode/onebesidesecondary)，[`oneOverSecondary`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymode/oneoversecondary) 三种显示样式。注意 secondaryOnly 虽然也是显示一个单页面，但是此时 [`isCollapsed`](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/1623185-iscollapsed) 值为 false，是展开状态。


![rOFyt78X9pBxdLs.png](https://image.xcanoe.top/blog/22e24bc418c418e88e4c4282f40e95e2.png)


我们可以通过 viewControllers 给 UISplitViewController 设置初始结构。默认的子 viewControllers都是导航控制器，如果不是导航控制器的话，UISplitViewController 会给 vc 嵌套上一个导航控制器。


### API 文档


UISplitViewController 的 API 文档不长，我们可以过一遍其中一些重要属性和方法的含义。


```plain text
// iOS14 的初始化方法，传入列数
    @available(iOS 14.0, *)
    public init(style: UISplitViewController.Style)

		// UISplitViewController的代理方法，下面会有用法说明
    weak open var delegate: UISplitViewControllerDelegate?


    // Default NO. The secondary-only shortcut button is applicable only for UISplitViewControllerStyleTripleColumn
    @available(iOS 14.0, *)
    open var showsSecondaryOnlyButton: Bool

    // 设置某一列的 vc，如果vc 不是导航控制器，系统会默认给我们嵌套上一个导航控制器
    @available(iOS 14.0, *)
    open func setViewController(_ vc: UIViewController?, for column: UISplitViewController.Column) // If the vc is not a UINavigationController, one will be created, except for UISplitViewControllerColumnCompact.

    /*
    -hideColumn: and -showColumn: do not accept the Compact column
		显示或者隐藏某一列，在紧凑和常规的视图有不同的处理，iOS14可用
    */
    @available(iOS 14.0, *)
    open func hide(_ column: UISplitViewController.Column)

    @available(iOS 14.0, *)
    open func show(_ column: UISplitViewController.Column)

    // 实际上是调用的 -setViewController:forColumn: ，通常在初始化的时候可以定义好一个vc数组
		// viewControllers 在控制器折叠和展开变化的时候会改变，折叠的时候只有一个，展开的时候有多个。
    open var viewControllers: [UIViewController] // -setViewController:forColumn:/-viewControllerForColumn: recommended for column-style UISplitViewController


    // 在主控制器隐藏在左边的情况下，可以右滑手势拉出来  Defaults to 'YES'.
    @available(iOS 5.1, *)
    open var presentsWithGesture: Bool


    // 当前的控制器是折叠还是展开
    @available(iOS 8.0, *)
    open var isCollapsed: Bool { get }


    // 偏好的显示风格，上文已经解释用法
    @available(iOS 8.0, *)
    open var preferredDisplayMode: UISplitViewController.DisplayMode


    // 当前的显示风格
		// The actual current displayMode of the split view controller. This will never return `UISplitViewControllerDisplayModeAutomatic`.
    @available(iOS 8.0, *)
    open var displayMode: UISplitViewController.DisplayMode { get }


    // 系统默认的展开和收起的按钮，会根据不同的 displaymode 显示不同的样式
    @available(iOS 8.0, *)
    open var displayModeButtonItem: UIBarButtonItem { get }


    // 设置主控制器的宽度比例，0.0 ~ 1.0，设置为1.0的时候为 maximumPrimaryColumnWidth，宽度值会在 mix 和 max 之间
    @available(iOS 8.0, *)
    open var preferredPrimaryColumnWidthFraction: CGFloat // default: UISplitViewControllerAutomaticDimension


    // 优先级高于 preferredPrimaryColumnWidthFraction，可以设置偏好的宽度值
    @available(iOS 14.0, *)
    open var preferredPrimaryColumnWidth: CGFloat // default: UISplitViewControllerAutomaticDimension


    // 主控制器的最小宽度
    @available(iOS 8.0, *)
    open var minimumPrimaryColumnWidth: CGFloat // default: UISplitViewControllerAutomaticDimension


    // 主控制器的最大宽度
    @available(iOS 8.0, *)
    open var maximumPrimaryColumnWidth: CGFloat // default: UISplitViewControllerAutomaticDimension


    // 当前主控制器的宽度
    @available(iOS 8.0, *)
    open var primaryColumnWidth: CGFloat { get }


    // 主控制器靠左边还是靠右边，默认左边
    @available(iOS 11.0, *)
    open var primaryEdge: UISplitViewController.PrimaryEdge // default: UISplitViewControllerPrimaryEdgeLeading


    // 替换主控制器
		// apple 建议尽量使用这个方法，不要直接修改 viewControllers 来替换主控制器
	  // 默认会先调用代理的 splitViewController(_:show:sender:) 代理方法，如果代理返回了 true，那么替换由代理实现，不会再做任何操作，如果返回 false 不进行自定义，就会触发系统的替换方案：
		// 在 compact 紧凑型的时候，就是present。
		// 在 regular 常规型的时候， 分栏控制器将vc作为primary主控制器，除非vc已经是主控制器的子控制器。在这种情况下，它将vc安装为二级控制器。
		// ps: 因为 UIsplitViewController 的特性，如果 vc 不是导航控制器，会默认嵌套一个导航控制器
    @available(iOS 8.0, *)
    open func show(_ vc: UIViewController, sender: Any?)

		// apple 建议尽量使用这个方法，不要直接修改 viewControllers 来替换二级控制器
	  // 默认会先调用代理的 splitViewController(_:showDetail:sender:) 代理方法，如果代理返回了 true，那么替换由代理实现，不会再做任何操作，如果返回 false 不进行自定义，方法就会转发给被替换的视图控制器，如果控制器没有处理，就会走系统默认方案：
		// 在 compact 紧凑型的时候，就是present。
		// 在 regular 常规型的时候，分栏控制器将vc作为secondary二级控制器。
	  // ps: 所有的 UIViewController 都有 showDetailViewController 这个方法，如果自己没有实现，就会往外层vc传递，所以我们可以在任意一个 vc 上调用这个方法，和直接调用 UISplitViewController 的这个方法一样。
    @available(iOS 8.0, *)
    open func showDetailViewController(_ vc: UIViewController, sender: Any?)
```


UISplitViewControllerDelegate 代理可以定制一些我们自己的实现方案，这些方法都是可选的，如果不实现的化，默认就会以系统的实现方式。


```plain text
// 显示模式改变的时候调用
    @available(iOS 8.0, *)
    optional func splitViewController(_ svc: UISplitViewController, willChangeTo displayMode: UISplitViewController.DisplayMode)


    // 手势和按钮行为会触发这个方法的调用，我们需要控制显示模式可以在这里操作，如果使用系统的方案可以返回 automatic
    @available(iOS 8.0, *)
    optional func targetDisplayModeForAction(in svc: UISplitViewController) -> UISplitViewController.DisplayMode


    // 和上面的 show(_ vc: UIViewController, sender: Any?) 方法相关，返回 true 自定义主视图的显示
    @available(iOS 8.0, *)
    optional func splitViewController(_ splitViewController: UISplitViewController, show vc: UIViewController, sender: Any?) -> Bool


    // 和上面的 showDetailViewController(_ vc: UIViewController, sender: Any?) 方法相关，返回 true 自定义二级视图的显示
    @available(iOS 8.0, *)
    optional func splitViewController(_ splitViewController: UISplitViewController, showDetail vc: UIViewController, sender: Any?) -> Bool


		// 当分栏控制器从常规视图过渡到紧凑型时，它会调用这个方法，并要求你提供在过渡完成后显示的视图控制器。返回的视图控制器将成为新主视图控制器，返回 nil 默认就是将 primary 作为显示的控制器返回。
    @available(iOS 8.0, *)
    optional func primaryViewController(forCollapsing splitViewController: UISplitViewController) -> UIViewController?


    // 当分栏控制器从紧凑视图过渡到常规型时，它会调用这个方法，并要求你提供在过渡完成后显示的视图控制器。返回的视图控制器将成为新主视图控制器，返回 nil 默认就是将 primary 作为显示的控制器返回。。
    @available(iOS 8.0, *)
    optional func primaryViewController(forExpanding splitViewController: UISplitViewController) -> UIViewController?


    // 这个方法从常规过渡到紧凑的时候调用
		// 如果返回 false 执行系统默认的折叠操作，默认会调用 primaryViewController 的collapseSecondaryViewController(_:for:) 方法，然后移除 secondaryViewController
		// 如果返回 true 执行我们要做的操作，系统不会做其他的处理，之后会移除 secondaryViewController
    @available(iOS 8.0, *)
    optional func splitViewController(_ splitViewController: UISplitViewController, collapseSecondary secondaryViewController: UIViewController, onto primaryViewController: UIViewController) -> Bool


    // 这个方法从紧凑过渡到常规的时候调用
		// 如果返回 nil 执行系统默认的展开操作，默认调用 primaryViewController 的 separateSecondaryViewController(for:) 方法。
		// 如果返回有效的 vc，分栏控制器将该对象作为 secondaryViewController。
    @available(iOS 8.0, *)
    optional func splitViewController(_ splitViewController: UISplitViewController, separateSecondaryFrom primaryViewController: UIViewController) -> UIViewController?

    // splitViewController支持的设备方向
    @available(iOS 7.0, *)
    optional func splitViewControllerSupportedInterfaceOrientations(_ splitViewController: UISplitViewController) -> UIInterfaceOrientationMask

		// 返回你更加偏好的展示方向可以使用此方法来指定首次显示分栏视图控制器时的最佳方向。指定的方向可以与当前设备方向不同。在显示之后，系统可能会将分栏视图控制器旋转为适合其支持的其他界面方向之一。
		// 如果没有实现该方法，系统将使用状态栏的当前方向来呈现视图控制器。
    @available(iOS 7.0, *)
    optional func splitViewControllerPreferredInterfaceOrientationForPresentation(_ splitViewController: UISplitViewController) -> UIInterfaceOrientation
```


## 二、实践


明确了基本的概念以及 API，我们开始实现一个分栏项目，首先我们要明确我们的需求是什么，也就是确定什么情况下要分栏，什么时候下折叠，我以微信 的方案作为实践，需求是：

1. 在 iPhone 上只支持竖屏。
2. 在 iPad 上横屏模式下支持分栏，竖屏模式下不分栏，展示单页面，就像在手机上使用一样。
3. 二级页面默认展示占位控制器。
4. 展开的时候主控制器始终显示 tabbarController，二级控制器显示详情页面。
5. 折叠起来的时候将二级控制器的页面叠进主控制器中。
6. 保存每个 tab 下对应的二级控制器的堆栈状态，下次回到 tab 的时候需要恢复状态。

emmm...如果上面的需求还不是很清楚，体验一下 iPad 版微信或者 Taio 就知道了（Taio 支持 iPhone 横屏分栏）。


![qWKG7wbML5DIPma.png](https://image.xcanoe.top/blog/30bdb78688f9cd67d629980446f53d38.png)


### 初始化 SplitViewController


根据需求，我们先确定页面结构，如下图：


![yevloB3fi2a8xPD.png](https://image.xcanoe.top/blog/7c1a7723e84f3f8849b5e40c96384f67.png)


我这里在 NavigationController 里面嵌套 TabbarController，实际上根据项目的需求反过来也没问题。


```plain text
self.window = UIWindow.init(frame: UIScreen.main.bounds)
        self.window?.makeKeyAndVisible()

        let tab = UITabbarController()
        let nav = UINavigationController.init(rootViewController: tab)

        let splite = BaseSplitController(primary: nav)

        self.window?.rootViewController = splite
```


这里因为我们需要对 UISplitController 做一些特殊的处理，所以创建一个子类，做一些定制的操作。


```plain text
class BaseSplitController: UISplitViewController,UISplitViewControllerDelegate {
		static let width: CGFloat = 380

    // 默认的二级控制器
    var placeholder: UINavigationController = UINavigationController.init(rootViewController: EmptyController())
		// 主控制器
    var primary: UINavigationController!

    // 初始化方法，传入主控制器
    convenience init(primary: UINavigationController) {
        self.init()
        // 初始化页面结构
        self.primary = primary
        self.viewControllers = [primary,placeholder]
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        self.delegate = self
      // 设置显示模式，并排展示
        self.preferredDisplayMode = .oneBesideSecondary
      // 设置主控制器的宽度
        self.preferredPrimaryColumnWidthFraction = 1.0
        self.maximumPrimaryColumnWidth = BaseSplitController.width
    }
}
```


### 折叠展开界面的切换


完成到这里，我们运行应用，在 iPad 上就可以看到分栏的界面了，但是在 iPhone 上运行，会发现默认展示的是 emptyController，这是因为打开应用的时候会调用代理方法 `splitViewController(_ splitViewController: UISplitViewController, collapseSecondary secondaryViewController: UIViewController, onto primaryViewController: UIViewController) -> Bool`，默认会返回 false 执行系统默认的折叠操作，调用 primaryViewController 的 `collapseSecondaryViewController(_:for:)` 方法，这个方法会将secondaryNavigationController 里面的子控制器移到 primaryNavigationController 中，然后移除 secondaryNavigationController，我们二级控制器里面是 emptyController，所以折叠状态下默认会被移到 primaryViewController 中。


上面这种情况，需要我们自己在代理方法中控制折叠和展开子控制器的转移，代码如下：


```plain text
// 这个方法从常规过渡到紧凑的时候调用
    func splitViewController(_ splitViewController: UISplitViewController, collapseSecondary secondaryViewController: UIViewController, onto primaryViewController: UIViewController) -> Bool {
        print(self.description + #function)
        // 在这个方法里面处理两栏 vc 的折叠, 将二级导航控制器除了最底层的 emptyController 外，其他的 vc 移入主控制器中
        guard let primary = primaryViewController as? UINavigationController,
              let secondary = secondaryViewController as? UINavigationController
        else { return false }

        if let viewControllers = secondary.popToRootViewController(animated: false) {
            primary.viewControllers.append(contentsOf: viewControllers)
        }

        return true
    }


    // 这个方法从紧凑过渡到常规的时候调用
    func splitViewController(_ splitViewController: UISplitViewController, separateSecondaryFrom primaryViewController: UIViewController) -> UIViewController? {
        print(self.description + #function)
        // 在这个方法里面处理两栏 vc 的展开, 将主级控制器除了底层的 tabarController 外，其他的 vc 移入二级控制器中
        guard let primary = primaryViewController as? UINavigationController else { return nil }

        self.placeholder.popToRootViewController(animated: false)

        if let viewControllers = primary.popToRootViewController(animated: false) {
            self.placeholder.viewControllers.append(contentsOf: viewControllers)
        }

        return self.placeholder
    }
```


### 二级控制器的跳转和切换


我们希望分栏控制器的 push 符合在 iPhone 上的用户习惯，点击左边的主控制器跳转页面的时候，右边二级控制器清空堆栈仅保留 emptyController，然后 push 到新页面。如果点击右边的二级控制跳转页面的时候，二级控制器直接 push。系统给 UIViewController 提供了两个方法   `open func show(_ vc: UIViewController, sender: Any?)` 以及  `open func showDetailViewController(_ vc: UIViewController, sender: Any?)`。


`open func show(_ vc: UIViewController, sender: Any?)` 使用这个方法，视图控制器不需要知道它是嵌入在导航控制器还是分栏视图控制器内。UISplitViewController和UINavigationController类重写了这个方法，并根据它们的设计来处理呈现。如果是导航控制器，就等同于 push，这个例子中我们使用的分栏控制器，会替换掉主控制器。


`open func showDetailViewController(_ vc: UIViewController, sender: Any?)` 类似于上面的方法，UISplitViewController 默认会替换 secondaryController，但如果此时分栏控制器是折叠状态，就会调用 `show(_ vc: UIViewController, sender: Any?)`。


对于我们的项目，只需要在四个一级 tab 页面 push 的时候判断当前分栏控制器是否展开，如果展开就调用 `showDetailViewController`，然后在 SplitViewController 中实现 showDetail 的代理方法，截断系统的替换方案，由我们自己实现。


```plain text
// 返回 true 自定义二级视图的显示,showDetailViewController(_ vc: UIViewController, sender: Any?)会调用到这个代理方法，如果返回 false 就默认走系统的替换二级控制器方案
    func splitViewController(_ splitViewController: UISplitViewController, showDetail vc: UIViewController, sender: Any?) -> Bool {
        print(self.description + #function)
        let controllers = self.placeholder.popToRootViewController(animated: false)

        self.placeholder.push(vc, animation: controllers.isSome ? .none : .push)
        return true
    }
```


这样就实现了点击左边的主控制器，显示到二级控制器上，至于二级控制器的内部跳转，直接 push 即可，不需要多余的处理了。


### 保存每个 Tab 的导航栈状态


使用微信的时候你会发现，在每个 tab 下做的跳转会保存下来，下次切换回来的时候仍然显示的原来的导航栈。


按照我们的界面框架，导航栏嵌套标签栏，需要我们自己保存好堆栈数组，如果是标签栏嵌套导航栏，则会相对简单，实现方案可以参考[这篇文章](https://nyrra33.com/2020/06/27/using-uisplitviewcontroller-with-uitabbarcontroller/)的最后小节。


我这里的处理是每个 tab 对应一个可选的 viewcontrollers 数组，保存导航栈里面的控制器。


```plain text
//MARK: - 切换 tab 对分栏二级页面进行状态的保存和恢复
extension BaseTabbarController {
    // 保存 tab 的导航栈状态   tabBarController(_:shouldSelect:) 里面调用
    func saveCurrentTabStacks(_ index:Int) {
        // 仅仅在分栏控制器存在，并且没有折叠的时候需要保存
        guard let split = mainSpliteController
               else { return }
        if split.isCollapsed { return }
        let secondary = split.placeholder
        // 清空二级控制器
        let vcs = secondary.popToRootViewController(animated: false)
        let model = self.tabbarView.itemsArray[index]
        model.viewControllers = vcs
    }

    // 恢复 tab 的导航堆栈状态 tabBarController(_:didSelect:) 里面调用
    func restoreCurrentTabStacks(_ index:Int) {
        // 仅仅在分栏控制器存在，并且没有折叠的时候需要恢复
        guard let split = mainSpliteController
               else { return }
        guard let controllers = self.tabbarView.itemsArray[index].viewControllers else {
            return
        }
        self.tabbarView.itemsArray[index].viewControllers = nil

        if split.isCollapsed { return }

        let secondary = split.placeholder
        secondary.viewControllers.append(contentsOf: controllers)
    }
}
```


### iPad 竖屏时折叠分栏控制器


此时功能已经基本完成，还有一个问题是我们想控制什么情况下折叠，什么情况下展开分栏控制器，但是 `isCollapsed`是只读的，系统根据当前的界面紧凑型还是常规型来决定是折叠还是分栏，那么我们是否可以控制紧凑型和常规型的判断条件？


UIViewController 中有一个方法 `- (nullable UITraitCollection *)overrideTraitCollectionForChildViewController:(UIViewController *)childViewController`,重写子控制器的UITraitCollection，可以修改所有子控制器的特性。我们可以通过这个方法来控制视图的类型。


这里就需要创建一个控制器，将它作为 SplitViewController 的 parent，并且将它设置为 rootViewController，然后重写他的这个方法。


```plain text
// AppDelegate 的调整
        let splite = BaseSplitController(primary: nav)

        let container = ContainerViewController()
        container.addChild(splite)

        self.window?.rootViewController = container
```


```plain text
class ContainerViewController: UIViewController {
    override func overrideTraitCollection(forChild childViewController: UIViewController) -> UITraitCollection? {
      // 如果 view 的宽度小于1000，我们就认为是紧凑型，分栏控制器折叠
        if self.view.bounds.size.width < 1000 {
            return UITraitCollection(horizontalSizeClass: .compact)
        }
        return super.traitCollection
    }
}
```


以上，就可以实现类似于微信 iPad 上的分栏的效果。


## 总结


关于 UISplitController 的文档不多，这篇文章是摸索加实践完成的，认真阅读官方文档，理解原理，实现我们想要的效果就不难，不排除有一些错误，有任何问题欢迎讨论交流。


相关文档：


[UISplitViewController 官方文档](https://developer.apple.com/documentation/uikit/uisplitviewcontroller)


[搭配标签栏控制器使用分栏视图控制器](https://nyrra33.com/2020/06/27/using-uisplitviewcontroller-with-uitabbarcontroller/)


[Adapting app for iPad with UISplitViewController](https://swiftwithmajid.com/2019/04/03/adapting-app-for-ipad-with-uisplitviewcontroller/)


[Change the Width of Master View in Split View Controller](https://useyourloaf.com/blog/change-the-width-of-master-view-in-split-view-controller/)


[Open UISplitViewController to Master View rather than Detail](https://stackoverflow.com/questions/29506713/open-uisplitviewcontroller-to-master-view-rather-than-detail)


[Split View Controller Display Modes](https://useyourloaf.com/blog/split-view-controller-display-modes/)


[Force UISplitViewController to always show master (only) in landscape](https://stackoverflow.com/questions/35705865/force-uisplitviewcontroller-to-always-show-master-only-in-landscape-on-iphone?noredirect=1&lq=1)


[Implementing a Container View Controller](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/ImplementingaContainerViewController.html)
