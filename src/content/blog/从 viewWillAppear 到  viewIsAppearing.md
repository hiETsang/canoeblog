---
title: 从 viewWillAppear 到  viewIsAppearing
slug: from-viewwillappear-to-viewisappearing
description: ''
tags:
  - iOS
  - swift
  - WWDC
pubDate: 2023-12-12
category: 技术
---

在 WWDC23 上，Apple 为 UIViewController 的生命周期引入了一个新的状态 `viewIsAppearing`。这个实例方法可以让我们对视图和布局有更细致的把握，让我们来探索一下这个方法的作用。


## viewIsAppearing 的作用


`viewIsAppearing` 在 `viewWillAppearing` 之后调用，在 view 被插入到视图层次结构之后，渲染之前调用，所以它适合我们在 ViewController 展示给用户之前更新和调整 UI。虽然系统在  `viewWillAppear(_:)`  之后调用这个方法，但两个回调都发生在同一个  `CATransaction`  中，这意味着你在任一方法中所做的更改都会同时对用户可见。


![Untitled.png](https://image.xcanoe.top/blog/91dcee13273d59233d709c1c31249ef5.png)


我们已经有了 `viewWillAppearing` 和 `viewDidLoad`，为什么还需要 `viewIsAppearing` 呢？`viewIsAppearing` 的特点在于：

- **精确的位置和形状：**当 `viewIsAppearing` 被调用时，视图具有精确的几何形状，包括大小和安全区域边距。
- **能获取界面的当前特征：**此时视图和视图控制器的特征集合（trait collections）更新到最新状态，我们可以根据环境变化（如深色模式或辅助功能设置）来控制界面的效果。
- **布局完成：**父视图已经布局了视图，这时我们可以对需要展示的视图做最后的调整，例如滚动 tableview 到某一个位置。

## 什么时候使用 viewIsAppearing


之后我们除了 `viewWillAppearing` 又多了一个选择，如何快速判断选择哪个方法呢？


**使用 viewWillAppear(_:)：**


如果有转场动画效果，我们需要在视图动画过渡之前准备一些东西，比如通过 `transitionCoordinator` 添加动画，可以在这里设置。以及一些不依赖视图特征和几何形状的操作，比如设置和取消通知，提前配置数据等非 UI 相关的任务。


**使用 viewIsAppearing(_:)：**


当需要依赖视图的大小位置和特性来更新视图时，比如说调整依赖整个 view 的宽度来调节子视图的大小。以及布局后的调整，例如滚动 ScrollView 到特定位置。


使用方式如下:


```swift
override func viewIsAppearing(_ animated: Bool) {
    super.viewIsAppearing(animated)
    // 让 UICollectionView 需要滚动到新插入的项目
    if let newItemIndexPath = newItemIndexPath {
        collectionView.scrollToItem(at: newItemIndexPath, at: .centeredVertically, animated: animated)
    }
}
```


可以通过下面这个表格更加清晰的了解如何选择：


|                                | **viewWillAppear(_:)** | **viewIsAppearing(_:)** |
| ------------------------------ | ---------------------- | ----------------------- |
| 控制进场动画（Transition coordinator） | **✓**                  | **✘**                   |
| 将视图添加到层次结构中                    | **✘**                  | **✓**                   |
| 视图控制器和视图特征集合更新                 | **✘**                  | **✓**                   |
| 视图几何(大小、安全区域等)是否准确             | **✘**                  | **✓**                   |


## UIViewController 生命周期


说到这里，顺便提一下 UIViewController 的生命周期，我画了一张图来直观展示。


![Untitled.png](https://image.xcanoe.top/blog/e5e39b6b8ac161b85dcbb323161ad4e0.png)


## 总结


`viewIsAppearing`  在视图生命周期中提供了一个好时机用于进行 UI 调整。了解了它调用的精确时间，你可以使用这个方法来优化用户界面的细节，让代码更加直观，更好的控制展示效果。


**参考文档：**


[bookmark](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/index.html#//apple_ref/doc/uid/TP40007457)


[bookmark](https://developer.apple.com/documentation/uikit/view_controllers/displaying_and_managing_views_with_a_view_controller)
