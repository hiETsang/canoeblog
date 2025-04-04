---
title: swift 新特性 - WWDC22
slug: swift-new-features-wwdc22
description: ''
tags:
  - iOS
  - swift
  - WWDC
pubDate: 2022-06-11
category: 技术
---

[bookmark](https://developer.apple.com/videos/play/wwdc2022/110354/)


这个 session 介绍了 swift 相关的新特性。


相关文档：


[bookmark](https://developer.apple.com/wwdc22/topics/swift/#current)


[bookmark](http://www.starming.com/2022/06/10/wwdc22-notes/#Swift-1)


[bookmark](https://xiaozhuanlan.com/topic/2498765013)


[bookmark](https://www.hackingwithswift.com/articles/249/whats-new-in-swift-5-7)


[bookmark](https://iter01.com/700176.html)


## Swift Packages 更新


### Trust on first use (TOFU)

- 新的安全协议，其中在首次下载包时记录包的指纹
- 后续下载将验证此指纹，如果指纹不同，则报告错误

### 插件


Xcode 插件又回归了，记得 Xcode8 之前有 IDE 插件，很多丰富好用的插件，后来苹果更新了新版 Xcode 之后，插件被取消了，现在终于又可以在 Xcode 中使用。新版本提供有两种类型的插件，一种是命令插件，可以修改代码，用于注释自动生成，格式调整等，另一种是 Build Plugin，在构建时注入额外步骤，比如源代码生成或者资源处理。更详细的内容，可以看这个 session。 [Meet Swift Package plugins](https://developer.apple.com/videos/play/wwdc2022/110359/) 和 [Create Swift Package plugins](https://developer.apple.com/videos/play/wwdc2022/110401/)。
插件被声明在 package 下一个名为 plugins 文件夹中，插件被视为 swift 可执行文件。


### 命名冲突


当两个独立的包具有同名模块时，会产生命名冲突，现在 swift 允许在包外使用 moduleAliases 字段重命名，这样可以解决模块重名的问题。


```plain text
let package = Package(
  name: "MyStunningApp",
  dependencies: [
    .package(url: "https://.../swift-metrics.git"),
    .package(url: "https://.../swift-log.git") // ⚠️ swift-log and swift-metric define a Logging module
  ],
  targets: [
    .executableTarget(
      name: "MyStunningApp",
      dependencies: [
        .product(name: "Logging", package: "swift-log"),
        .product(name: "Metrics", package: "swift-metrics",
                 moduleAliases: ["Logging": "MetricsLogging"]), // 👈🏻 module aliasing
])])
```


## Swift 底层性能优化

- 编译时间提升
    - 更快的泛型类型检查
- 运行时改进
    - Swift5.7 会对协议一致性检查进行缓存，提高编译速度。
- Swift driver(Swift 编译器驱动程序)
    - Xcode 现在已经将 Swift driver 集成到构建系统内部，而不是一个独立的可执行文件，提高了项目构建速度。

## Swift 并发模型


### 安全检查


Swift 5.5 引入了新的并发模型，Swift 5.7 主要针对数据竞争安全对并发模型进行了完善。Swift 并发模型支持 macOS 10.15、iOS 13、tvOS 13 和 watchOS 6 以上系统。
开发者现在可以通过在 Build Settings 中设置 Strict Concurrency Checking 来体验安全检查。在 swift 6 中，如果开发者在两个线程中都修改了同一个值，并且没有使用 actor，应该出现报错。


### `distributed` Actors


关键字 distributed 可以用来修饰 actor 和 actor 的方法，表明 actor 可能部署在远端机器上。


```swift
distributed actor Player {

    var ai: PlayerBotAI?
    var gameState: GameState

    distributed func makeMove() -> GameMove {
        return ai.decideNextMove(given: &gameState)
    }
}
```


分布式的 actor 方法执行可能会由于网络原因失败，所以在外部调用 actor 方法时需要在 await 前面加上关键字 try。如果想要了解更多可以参考 [Meet distributed actors in Swift](https://developer.apple.com/videos/play/wwdc2022/110356/)。


### 其他优化


[Async Algorithms Package](https://github.com/apple/swift-async-algorithms) 苹果开源了用于处理 AsyncSequence 的算法，使跨平台部署更加灵活。
Actor 会执行优先级最高的任务，同时并发模型内置了防止优先级反转的机制，来确保低优先级任务不会阻塞高优先级任务。
Instruments 中新增了工具 Swift Concurrency，帮助开发者排查性能问题。提供了一整套工具来帮助可视化和优化并发代码。可以参考 [Visualize and optimize Swift concurrency](https://developer.apple.com/videos/play/wwdc2022/110350/)。


## Swift 语言优化


### If let 简写优化


之前我们是这样写的：


```swift
if let name = name {
    print("Hello, \\(name)!")
}

if let unwrappedName = name {
    print("Hello, \\(unwrappedName)!")
}
```


现在我们可以这样写：


```swift
var name: String? = "Linda"

if let name {
    print("Hello, \\(name)!")
}
```


但是这种写法不能扩展到对象的属性，也就是说不能这样写：


```swift
struct User {
    var name: String
}

let user: User? = User(name: "Linda")

if let user.name {
    print("Welcome, \\(user.name)!")
}
```


### 返回类型推断


在 swift 5.7 之前，我们需要在闭包中显式的指定返回类型，比如：


```swift
let oldResults = scores.map { score -> String in
    if score >= 85 {
        return "\\(score)%: Pass"
    } else {
        return "\\(score)%: Fail"
    }
}
```


但现在，swift 可以自动推断类型，我们可以省略返回类型：


```swift
let scores = [100, 80, 85]

let results = scores.map { score in
    if score >= 85 {
        return "\\(score)%: Pass"
    } else {
        return "\\(score)%: Fail"
    }
}
```


### 允许指针类型转换


针对从外部引入的方法和函数，Swift 支持在 C 语言中合法的指针类型转换，以下情况将不会再有报错。


![Untitled.png](https://image.xcanoe.top/blog/69e76dd76999ae1e6758d8911b6d2ea2.png)


### 正则表达式


Swift 5.7 引入了和正则表达式相关的大量改进，极大的改进了我们处理字符串的方式。
我们从易到难来使用一下，首先新增了一些字符串方法, 例如：


```swift
let message = "the cat sat on the mat"
print(message.ranges(of: "at"))
print(message.replacing("cat", with: "dog"))
print(message.trimmingPrefix("the "))
```


一样看去好像没什么区别，他们的优势在于接受正则表达式：


```swift
print(message.ranges(of: /[a-z]at/))
print(message.replacing(/[a-m]at/, with: "dog"))
print(message.trimmingPrefix(/The/.ignoresCase()))
```


除了支持正则表达式的字符串，swift 还提供了一个专用的正则表达式类型，就像这样工作：


```swift
do {
    let atSearch = try Regex("[a-z]at")
    print(message.ranges(of: atSearch))
} catch {
    print("Failed to create regex")
}
```


但这里有一个地方需要注意，我们使用字符串初始化 Regex 类型，swift 会在运行时解析这个字符串，不能在编译时替我们检查正则表达式是否有效，但是我们使用像 `message.ranges(of: /[a-z]at/)` 这种方式时，是在编译时检查，这种方式相对更安全一些。
除此以外，swift 更是给我们提供了一种 DSL 语法让我们能够初始化 Regex，例如：


```swift
let search3 = Regex {
    "My name is "

    Capture {
        OneOrMore(.word)
    }

    " and I'm "

    Capture {
        OneOrMore(.digit)
    }

    " years old."
}
```


并且如果我们使用 TryCapture 替代 Capture，swift 会自动根据是否匹配而捕获失败或者抛出错误。


```swift
let search4 = Regex {
    "My name is "

    Capture {
        OneOrMore(.word)
    }

    " and I'm "

    TryCapture {
        OneOrMore(.digit)
    } transform: { match in
        Int(match)
    }

    Capture(.digit)

    " years old."
}
```


我们甚至可以使用特定类型和已经命名的匹配规则绑定在一起，比如：


```swift
let nameRef = Reference(Substring.self)
let ageRef = Reference(Int.self)

let search5 = Regex {
    "My name is "

    Capture(as: nameRef) {
        OneOrMore(.word)
    }

    " and I'm "

    TryCapture(as: ageRef) {
        OneOrMore(.digit)
    } transform: { match in
        Int(match)
    }

    Capture(.digit)

    " years old."
}

if let result = greeting.firstMatch(of: search5) {
    print("Name: \\(result[nameRef])")
    print("Age: \\(result[ageRef])")
}
```


以上就是新的正则匹配的语法，我个人偏向使用 regex 字面量的形式，在支持 swift6 的 Xcode 中，在 `Other Swift Flags` 中添加“-Xfrontend -enable-bare-slash-regex”来启用这种语法。


### 基于默认表达式的类型推断


在 Swift 5.7 之前，不支持为泛型参数提供默认值，因为在现有语法规则下，默认值的类型必须在任何调用场景都有效才行。Swift 5.7 提供了一种基于默认表达式的类型推断方式，使得可以为泛型参数添加默认值。如果想要了解更多可以参考 [Type inference from default expressions](https://github.com/apple/swift-evolution/blob/main/proposals/0347-type-inference-from-default-exprs.md)。


```swift
func compute<C: Collection>(_ values: C = [0, 1, 2]) {}
```


### 不透明的参数声明


在 swift5.7 中，我们可以在一些使用简单泛型的地方使用一些参数声明。
比如下面这个例子，我们想要编写一个检查数组是否排序的函数，可以这样写：


```swift
func isSorted(array: [some Comparable]) -> Bool {
    array == array.sorted()
}
```


这段函数和下面这段函数等价，是一种新的语法糖:


```swift
func isSortedOld<T: Comparable>(array: [T]) -> Bool {
    array == array.sorted()
}
```


### 返回不透明的泛型


现在我们可以一次返回多个不透明类型：


```swift
func showUserDetails() -> (some Equatable, some Equatable) {
    (Text("Username"), Text("@twostraws"))
}
```


还可以返回不透明类型数组：


```swift
func createUser() -> [some View] {
    let usernames = ["@frankefoster", "@mikaela__caron", "@museumshuffle"]
    return usernames.map(Text.init)
}
```


或者调用一个函数，这个函数在调用的时候返回一个不透明类型:


```swift
func createDiceRoll() -> () -> some View {
    return {
        let diceRoll = Int.random(in: 1...6)
        return Text(String(diceRoll))
    }
}
```


### 总结


以上就是我比较关注的 swift5.7 的一些新特性，当然并不完整，除了以上这些，还可以在 [Swift Evolution](https://apple.github.io/swift-evolution/) 页面搜索 5.7 查看 Swift 5.7 相关变更。


## 其他


### 时间标准


Swift 5.7 引入了一种新的标准方式来获取和表示时间，可分为以下三个部分：
1.Clock: 表示当下，并且能提供在将来特定时间点唤起的功能
2.Instant: 表示某个瞬间
3.Duration: 用于计量流逝的时间
Clock 有 ContinuousClock 和 SuspendingClock 两种内置时钟，ContinuousClock 在系统休眠时也会保持时间递增，而 SuspendingClock 则不会。Task 休眠相关的 API 也会根据新标准有所更新。如果想要了解更多可以参考 [Clock, Instant, and Duration](https://github.com/apple/swift-evolution/blob/main/proposals/0329-clock-instant-duration.md)。


```swift
extension Task {
    @available(*, deprecated, renamed: "Task.sleep(for:)")
    public static func sleep(_ duration: UInt64) async

    @available(*, deprecated, renamed: "Task.sleep(for:)")
    public static func sleep(nanoseconds duration: UInt64) async throws

    public static func sleep(for: Duration) async throws

    public static func sleep<C: Clock>(until deadline: C.Instant, tolerance: C.Instant.Duration? = nil, clock: C) async throws
}
```


### 基于默认表达式的类型推断


在 Swift 5.7 之前，不支持为泛型参数提供默认值，因为在现有语法规则下，默认值的类型必须在任何调用场景都有效才行。Swift 5.7 提供了一种基于默认表达式的类型推断方式，使得可以为泛型参数添加默认值。如果想要了解更多可以参考 [Type inference from default expressions](https://github.com/apple/swift-evolution/blob/main/proposals/0347-type-inference-from-default-exprs.md)。


```swift
func compute<C: Collection>(_ values: C = [0, 1, 2]) {
}
```
