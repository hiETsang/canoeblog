---
title: 正确理解 swiftUI .animation 动画
slug: understanding-swiftui-animation-correctly
description: ''
tags:
  - iOS
  - swiftUI
pubDate: 2023-03-25
category: 技术
---

作者：Ole Begemann，[原文链接](https://oleb.net/2022/animation-modifier-position/)，原文日期：2022 年 11 月 10 日 译者：轻舟


当 swiftUI 中的视图动画和我们的预期不符时，或许和 `.animation` 修饰符在视图树中的位置以及“需渲染”和“无需渲染”两种类型的视图修饰符有关。


首先让我们看一下 SwiftUI 的 [animation 修饰符](https://developer.apple.com/documentation/swiftui/view/animation(_:value:)) 相关文档是怎么说的：

> Applies the given animation to this view when the specified value changes.
> 当特定的依赖项发生改变时，将设置的动画效果应用到这个视图。

这个说法听起来很明确： `.animation` 的作用是给当前的视图设置动画，当设置的依赖项发生改变时，这个视图就会产生对应的动画效果。这看起来可以让我们完全控制我们想要的动画属性，对吧？但是实际上事情并没有那么简单：开发过程中很容易遇到想加动画加不上，不想加动画自己动的情况。


## 一些正常情况下的例子


我们来写几个例子，先从一些正常的情况开始吧。所有的这些代码我都在 iOS 16.1 和 macOS 13.0 上进行了测试。


### 1. 同级视图可以设置不同的动画


独立的子视图可以单独设置动画。在这个例子中，我们有三个同层级的视图，其中两个设置了不同的动画，一个则没有设置动画：


```swift
struct Example1: View {
  var flag: Bool

  var body: some View {
    HStack(spacing: 40) {
      Rectangle()
        .frame(width: 80, height: 80)
        .foregroundColor(.green)
        .scaleEffect(flag ? 1 : 1.5)
        .animation(.easeOut(duration: 0.5), value: flag)

      Rectangle()
        .frame(width: 80, height: 80)
        .foregroundColor(flag ? .yellow : .red)
        .rotationEffect(flag ? .zero : .degrees(45))
        .animation(.easeOut(duration: 2.0), value: flag)

      Rectangle()
        .frame(width: 80, height: 80)
        .foregroundColor(flag ? .pink : .mint)
    }
  }
}
```


这两个 `animation` 修饰符分别应用到了他们的子视图中。它们不会相互干扰，也不会对视图层次结构的其余部分产生影响： 


[https://oleb.net/media/2022-11-10-SwiftUI-animation-example-1.mp4](https://oleb.net/media/2022-11-10-SwiftUI-animation-example-1.mp4)


### 2. 嵌套的 `animation` 修饰符


当两个 `animation` 修饰符像下面这样一个作为另一个的间接父级，嵌套到同一个 View 上的时候，里层的 `animation` 修饰符可以覆盖外层 `animation` 修饰符设置的效果。外层的动画设置会应用到位于两个 `animation` 修饰符之间的视图修饰符。 


在这个例子中，我们有一个矩形视图，给它设置了 [放大（scale）](https://developer.apple.com/documentation/swiftui/view/scaleeffect(_:anchor:)-pmi7)和 [旋转（rotation）](https://developer.apple.com/documentation/swiftui/view/rotationeffect(_:anchor:))的效果。首先最外层设置的 0.3 倍的动画应用到了整个子树中，包括了放大和旋转两种效果。然后内部的 `animation` 修饰符覆盖了它子层级中的动画设置，即应用了默认的缩放动画效果：


```swift
struct Example2: View {
  var flag: Bool

  var body: some View {
    Rectangle()
      .frame(width: 80, height: 80)
      .foregroundColor(.green)
      .scaleEffect(flag ? 1 : 1.5)
      .animation(.default, value: flag) // 里层
      .rotationEffect(flag ? .zero : .degrees(45))
      .animation(.default.speed(0.3), value: flag) // 外层
  }
}
```


下面是运行结果，矩形的尺寸和旋转变化以不同的速度进行了变化：


 [https://oleb.net/media/2022-11-10-SwiftUI-animation-example-2.mp4](https://oleb.net/media/2022-11-10-SwiftUI-animation-example-2.mp4) 


当然，我们也可以传递 `.animation(nil, value: flag)` 来选择性地禁用子层级中的动画，从而覆盖掉上层设置的动画效果。


### 3. `animation` 仅作用于它的子视图（有例外）


通常情况下，`animation` 修饰符仅作用到它的子视图。换句话说，`animation` 修饰符的作用范围不包含“父级”的视图和修饰符。就像我们将在下面这个例子中看到的那样，尽管它并不是每次都按照这种规则工作，但是我们下面写的这个例子是可以正常运行的。这段代码在上面那段代码的基础上做了点微调，我删除了外部的 `animation` 修饰符（并且为了更好的区分，我改变了背景颜色）：


```swift
struct Example3: View {
  var flag: Bool

  var body: some View {
    Rectangle()
      .frame(width: 80, height: 80)
      .foregroundColor(.orange)
      .scaleEffect(flag ? 1 : 1.5)
      .animation(.default, value: flag)
      // 旋转不要带动画
      .rotationEffect(flag ? .zero : .degrees(45))
  }
}
```


回想一下，视图修饰符在代码中的编写顺序与实际视图树层次结构是相反的。每个视图修饰符都是一个新的视图，这个视图是对应用了修饰符的子视图的一层包装。所以在我们的示例中，缩放效果是 `animation` 修饰符的子级，而旋转效果是其父级。因此，只有缩放的动画会生效： 


[https://oleb.net/media/2022-11-10-SwiftUI-animation-example-3.mp4](https://oleb.net/media/2022-11-10-SwiftUI-animation-example-3.mp4)


## 不合预期的例子


有意思的事情来了。事实证明，当和 `animation` 修饰符结合起来使用时，并不是所有视图修饰符都像 [scaleEffect](https://developer.apple.com/documentation/swiftui/view/scaleeffect(_:anchor:)-pmi7) 和 [rotationEffect](https://developer.apple.com/documentation/swiftui/view/rotationeffect(_:anchor:)) 那样简单直观。


### 4. 一些不遵守规则的修饰符


在下面这个例子中，我改变了矩形的颜色、大小和对齐方式。我想要只有大小变化才有动画效果，所以我们把对齐方式和颜色变化放在 `animation` 修饰符的外层：


```swift
struct Example4: View {
  var flag: Bool

  var body: some View {
    let size: CGFloat = flag ? 80 : 120
    Rectangle()
      .frame(width: size, height: size)
      .animation(.default, value: flag)
      .frame(maxWidth: .infinity, alignment: flag ? .leading : .trailing)
      .foregroundColor(flag ? .pink : .indigo)
  }
}
```


很不幸它并没有按照我们预想的运行，对矩形的三个更改都是有动画效果的： 


[https://oleb.net/media/2022-11-10-SwiftUI-animation-example-4.mp4](https://oleb.net/media/2022-11-10-SwiftUI-animation-example-4.mp4) 


它的运行效果就像把 `animation` 修饰符放在矩形视图的最外层一样。


### 5. `padding` 和 `border`


这个例子和上面的这个例子情况又反过来了，因为我们想要加的动画并没有被加上。`padding` 是 `animation` 修饰符的子级，因此我预计它应该是会有动画的，也就是内边框应该是平滑地增长和缩小：


```swift
struct Example5: View {
  var flag: Bool

  var body: some View {
    Rectangle()
      .frame(width: 80, height: 80)
      .padding(flag ? 20 : 40)
      .animation(.default, value: flag)
      .border(.primary)
      .foregroundColor(.cyan)
  }
}
```


但是实际上并不是我所想的那样：


[https://oleb.net/media/2022-11-10-SwiftUI-animation-example-5.mp4](https://oleb.net/media/2022-11-10-SwiftUI-animation-example-5.mp4)


### 6. 字体修饰符


字体修饰符与 `animation` 修饰符结合使用时也好像不太稳定。在这个例子中，我们想要给字体宽度变化加上动画，但大小或粗细的变化不需要动画（平滑文本动画是 iOS 16 中的新功能）：


```swift
struct Example6: View {
  var flag: Bool

  var body: some View {
    Text("Hello!")
      .fontWidth(flag ? .condensed : .expanded)
      .animation(.default, value: flag)
      .font(.system(
        size: flag ? 40 : 60,
        weight: flag ? .regular : .heavy)
      )
  }
}
```


我觉得你肯定能猜到，结果和我们预想的又不一样。所有文本属性都会被加上平滑的动画效果： 


[https://oleb.net/media/2022-11-10-SwiftUI-animation-example-6.mp4](https://oleb.net/media/2022-11-10-SwiftUI-animation-example-6.mp4)


## 为什么会这样？


简单来说，我们可以在视图树中调整 `animation` 修饰符的位置来进行动画的控制，但是这种方式并不完美。一些修饰符是可以按照我们预想的运行的，例如 `scaleEffect`  和  `rotationEffect`。但是其他的修饰符（`frame`、`padding`、`foregroundColor`、`font`）则不太可控。


我现在还不是完全清楚这里面的规则，但是我想这其中的重点应该在于视图的修饰符是不是真的影响到了视图的渲染。比如说 [foregroundColor](https://developer.apple.com/documentation/swiftui/view/foregroundcolor(_:)) 只是将颜色写入到了 environment，它本身并没有绘制任何东西，因此不管 `animation` 的位置在哪里，都会起作用。


```swift
RoundedRectangle(cornerRadius: flag ? 0 : 40)
  .animation(.default, value: flag)
  // 颜色的变化仍然有动画效果，尽管我们把它写在 .animation 外层
  .foregroundColor(flag ? .pink : .indigo)
```


渲染可能发生在 RoundedRectangle 的视图层级上，它会从 `environment` 中读取颜色。此时动画修饰符正在起作用，因此 SwiftUI 将会对颜色变化加上动画效果，不论这些更改来自视图树的哪一层。


这种解释也适用于示例 6 中的字体修饰符。实际渲染和动画发生在文本视图层面上，各种字体修饰符会影响文本绘制方式，但它们本身不会渲染任何内容。 


同样的，`padding` 和  `frame` （包括对齐方式）也是属于“不需要渲染”类型的修饰符。他们没有使用到 `environment`，但是会影响布局算法，最终会影响一个或多个“需要渲染”视图的大小和位置，就好像示例 4 中的矩形。矩形本身的形状发生了变化，但是它不能确定这个变化来自哪里，所以他会给整个形状的变化加上动效。 


在示例 5 中，受到影响的“需要渲染”视图是 `border`（它本质是 overlay 实现的描边矩形），它被 `padding` 的变化所影响。因为 `border` 位于 `animation` 修饰符的父级，所以他的几何变化是不带动画的。 


与  `frame`  和  `padding`  相比，`scaleEffect` 和  `rotationEffect` 是“需要渲染”的修饰符。所以看起来他们能够自己决定是否执行动画。


## 结论


SwiftUI 视图和视图修饰符可以分为“需渲染”和“无需渲染”两种类型（希望能有更好的术语来表示）。在 iOS 16/macOS 13 中，对于“无需渲染”类型的修饰符来说，它是否会产生动画效果和 `animation` 修饰符的位置是无关的。


“无需渲染”修饰符包括（不完全统计）： 

- 布局修饰符（`frame`，`padding`，`position`，`offset`）
- 字体修饰符（`font`，`bold`，`italic`，`fontWeight`，`fontWidth`）
- 将数据写入 `environment` 的其他修饰符，例如 `foregroundColor`，`foregroundStyle`，`symbolRenderingMode`，`symbolVariant`

“需渲染” 修饰符包括（不完全统计）： 

- `clipShape`，`cornerRadius`
- 几何效果，例如 `scaleEffect`，`rotationEffect`，`projectionEffect`
- 图形效果，例如 `blur`，`brightness`，`hueRotation`，`opacity`，`saturation`，`shadow`
