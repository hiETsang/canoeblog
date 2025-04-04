---
title: 'swift - ResultBuilder'
slug: 'swift-resultbuilder'
description: ''
tags: ["iOS", "开发技巧", "swift"]
pubDate: 2022-06-14
category: '技术'
---

**官方文档：**


[bookmark](https://docs.swift.org/swift-book/ReferenceManual/Attributes.html#ID633)


[bookmark](https://docs.swift.org/swift-book/LanguageGuide/AdvancedOperators.html#ID630)


## 什么是 result builder？


Result builder 是一种声明属性，用来修饰类，结构体，枚举，利用它可以使 swift 实现嵌入领域特定语言 DSL (Domain Specific Language)。



DSL 没有计算和执行的概念，和命令式编程不同，使用的时候只需要声明规则，事实以及某些元素之间的层级和关系。我们使用 swift 和 UIKit 编写应用程序，一直以来都是命令式编程，直到 swiftUI 出现。



实际上我们已经多次接触过声明式语法，例如目前苹果推崇的 swiftUI 以及 cocopods 的 podfile 文件:


```swift
struct ContentView: View {
     var body: some View {
         // This is inside a result builder
         VStack {
             Text("Hello World!") // VStack and Text are 'build blocks'
         }
     }
 }
```


SwiftUI 的声明式语法就是通过 result builder 来实现的。如果我们查看 SwiftUI View 协议的声明，我们可以看到@ViewBuilder 属性定义的 body 变量:


```swift
@ViewBuilder var body: Self.Body { get }
```


ViewBuilder 就是使用 result builder 修饰之后实现的一个自定义构造器。


> 🎣 ResultBuilder 之前的名字是 functionbuilder，所以如果看到例如 `@functionBuilder` 或 `@_functionBuilder`，本质是同一个东西。


## 自定义一个 result builder


从实践出发，我们可以自己尝试着实现一个简单的例子来学习。`NSAttributedString` 就是一个很好的例子，构建富文本是一件比较痛苦的事情，如果可以使用 swiftUI 的声明式语法，那不是很快乐？比如说像这样：


```swift
NSAttributedString {
    "Hello "
      .color(.red)
    "World"
      .color(.blue)
      .underline(.blue)
}
```


那让我们一步步来开始尝试使用 `@resultBuilder`。


### 一、创建一个函数构造器


```swift
@resultBuilder
struct AttributedStringBuilder {
  static func buildBlock(_ segments: NSAttributedString...) -> NSAttributedString {
    let string = NSMutableAttributedString()
    segments.forEach { string.append($0) }
    return string
  }
}
```


首先使用 `@resultBuilder` 属性标注一个结构体，然后我们必须要实现上面的这个方法，这个方法的含义是你想要如何通过 block 传递进来的数据构造 `NSAttributedString`。传递进来的是一个或者多个 `NSAttributedString` ，我们通过遍历拼接之后返回。
OK，我们已经完成了最重要的一步。


### 二、创建一个方便的初始化器


```swift
extension NSAttributedString {
  convenience init(@AttributedStringBuilder _ content: () -> NSAttributedString) {
    self.init(attributedString: content())
  }
}
```


我们可以简单理解为`AttributedStringBuilder`结构体已经变成了一个简单的函数，使用的时候用 `@AttributedStringBuilder` 来修饰，在闭包中返回一个或者多个 `NSAttributedString`，生成一个拼接好的 `NSAttributedString`。
为了让我们使用起来更加的方便，我们给 `NSAttributedString`和 `string` 加上几个扩展方法，在使用字符串创建的时候更简洁。


```swift
// MARK: - extension
extension NSAttributedString {
    func apply(_ attributes: [NSAttributedString.Key:Any]) -> NSAttributedString {
        let mutable = NSMutableAttributedString(string: self.string, attributes: self.attributes(at: 0, effectiveRange: nil))
        mutable.addAttributes(attributes, range: NSMakeRange(0, (self.string as NSString).length))
        return mutable
    }

    func foregroundColor(_ color: UIColor) -> NSAttributedString {
        self.apply([.foregroundColor : color])
    }

    func font(_ font: UIFont) -> NSAttributedString {
        self.apply([.font: font])
    }
}

extension String {
    func foregroundColor(_ color: UIColor) -> NSAttributedString {
        NSAttributedString(string: self, attributes: [.foregroundColor : color])
    }
    func font(_ font: UIFont) -> NSAttributedString {
        NSAttributedString(string: self, attributes: [.font: font])
    }
}
```


### 三、大功告成


到这里已经全部完成了,让我们来试试我们的声明式富文本构造器。


```swift
let str = NSAttributedString {
            "hello "
                .foregroundColor(.red)
                .font(.systemFont(ofSize: 14))
            "world!"
                .foregroundColor(.label)
                .font(.systemFont(ofSize: 20, weight: .bold))
        }
```


![swift_-_ResultBuilder%E5%AD%A6%E4%B9%A0-20220614115149086.png](https://image.xcanoe.top/blog/b0a798a6e5613c3e9fcb47abd4fff64e.png)


以上其实已经实现了我们想要的效果，在其之上我们再扩展一些经常使用到的属性，就可以很方便的创建 `NSAttributedString`了，在 github 中的[https://github.com/ethanhuang13/NSAttributedStringBuilder](https://github.com/ethanhuang13/NSAttributedStringBuilder)仓库就是使用的 `@resultBuilder`，其核心就是步骤一中的代码。


**除此以外，****`@resultBuilder`****还有一些可选的实现方法，来完善构造器，例如我们如果返回一个可选值，该如何处理？如果想要像 swiftUI 一样支持 if-else，switch，该如何处理？**



这些也很简单，在官方文档中，我们可以看到还有很多构建方法，用来解决不同类型，不同数据的处理：


```swift
// 对应 block 中没有值返回的情况
static func buildBlock(_ components: Component...) -> Component

// 通过一个或多个值来构建    必须实现
static func buildBlock(_ components: Component...) -> Component
Combines an array of partial results into a single partial result. A result builder must implement this method.

// 通过可选值来构建，可以支持不包含 else 的 if 语句
static func buildOptional(_ component: Component?) -> Component
Builds a partial result from a partial result that can be nil. Implement this method to support if statements that don’t include an else clause.

// 支持通过条件来变化的值，通过下面这两个方法支持包含 switch 和 if-else 的语句
static func buildEither(first: Component) -> Component
Builds a partial result whose value varies depending on some condition. Implement both this method and buildEither(second:) to support switch statements and if statements that include an else clause.

static func buildEither(second: Component) -> Component
Builds a partial result whose value varies depending on some condition. Implement both this method and buildEither(first:) to support switch statements and if statements that include an else clause.

// 通过数组来构建 可以支持 forin 语句
static func buildArray(_ components: [Component]) -> Component
Builds a partial result from an array of partial results. Implement this method to support for loops.

// 通过 Expression 来生成，Expression 为自定义的表达式 具体可以看官方文档中的例子
static func buildExpression(_ expression: Expression) -> Component
Builds a partial result from an expression. You can implement this method to perform preprocessing—for example, converting expressions to an internal type—or to provide additional information for type inference at use sites.

// 用于对最外层的 `buildBlock` 结果的再包装。例如，让结果构建器隐藏一些它并不想对外的类型（转换成可对外的类型）。
static func buildFinalResult(_ component: Component) -> FinalResult
Builds a final result from a partial result. You can implement this method as part of a result builder that uses a different type for partial and final results, or to perform other postprocessing on a result before returning it.

// 如果提供了 `buildLimitedAvailability` 的实现，构建器提供了对 API 可用性检查（如 `if #available(..)`）的支持。
static func buildLimitedAvailability(_ component: Component) -> Component
Builds a partial result that propagates or erases type information outside a compiler-control statement that performs an availability check. You can use this to erase type information that varies between the conditional branches.
```


这些方法分别对应内部不同的元素来构建的时候需要做的操作，构建器在转译时会自动选择对应的方法。


## 总结


以上，我们可以看到 resultBuilder 其实很简单，同时也非常强大，通过 resultBuilder 我们可以简化非常多的代码，甚至可以自己实现一个在 UIKit 框架下 swiftUI 式的声明式构建方式，具体该如何使用，取决于你的 idea💡。


**想知道使用 result builder 可以干些什么有意思的事情吗？**可以在下面这个仓库中看看。


[link_preview](https://github.com/carson-katri/awesome-result-builders)


**这篇文章希望能让你对 ResultBuilder 有一定的了解，更深入的学习推荐肘子的文章：**


[bookmark](https://www.fatbobman.com/posts/viewBuilder1/)


[bookmark](https://www.fatbobman.com/posts/viewBuilder2/)

<details>
<summary>附本篇文章中的Demo代码：</summary>

![carbon_%282%29.png](https://image.xcanoe.top/blog/4878e5e1dbea782e0b4af0ffbcfb749f.png)


</details>