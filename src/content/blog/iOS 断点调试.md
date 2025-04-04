---
title: iOS 断点调试
slug: ios-breakpoint-debugging
description: ''
tags:
  - 开发技巧
  - iOS
  - swift
pubDate: 2021-04-16
category: 技术
---

开发 iOS 应用的过程中，断点必不可少，调试的时候要用到，崩溃的时候也可以用来定位问题，但是我们平时使用到的，也只是其中的一小部分功能，为了让开发工具更加得心应手，我们来仔细了解一下 iOS 中的断点调试。


Xcode 给我们提供了以下几种断点：

- 源文件断点（Source File Breakpoints）
- Swift 错误断点（Swift Error Breakpoint）
- 全局异常断点 （Exception Breakpoint）
- OpenGL ES 错误断点（OpenGL ES Error Breakpoint）
- 符号断点（Symbolic Breakpoints）
- 运行时问题断点（Runtime Issue Breakpoints）
- 约束错误断点（Constraint Error Breakpoint）
- 单元测试断点（Test Failure Breakpoint）

**本文主要讨论三个常用的断点：**

- 源文件断点（Source File Breakpoints）
- 符号断点（Symbolic Breakpoints）
- 运行时问题断点（Runtime Issue Breakpoints）

## 源文件断点


### 断点命令调试


源文件断点顾名思义就是在单个文件上设置的断点，最常见的就是单行断点。单行断点是我们开发中用的最多的断点，设置单行断点也非常简单，只需要我们在需要中断的代码行边上单击即可。


![xlXTZbhO1mCFcwa.png](https://image.xcanoe.top/blog/4a023a8fcfd58f172470d57b3628f8f0.png)


![yTePR64AdFW3pCa.png](https://image.xcanoe.top/blog/3a9437b91ad98b68d57404c279760246.png)


设置单行断点后，当程序运行到该行代码时，程序会中断，同时 Xcode 底部的控制台支持我们使用 LLDB 对程序进行调试。


LLDB 常用的命令有以下：

- `p`和`po`，打印出对应的变量，区别在于使用 `po` 只会输出对应的值，而 `p` 则会返回值的类型以及命令结果的引用名。
- `expression`(简写为`e`)，可以打印值、修改值。
- `call`，调用某个方法，并输出此方法的返回值。
- `thread backtrace`(简写为 `bt`)，堆栈打印，加参数可以限制打印数量。
- `thread return`，相当于执行`return`。
> 小技巧：在调试 UI 的时候，我们可以使用 expression 命令修改界面的样式，此时视图并不会刷新，执行 expression CATransaction.flush() 命令即可刷新。

### 断点时执行命令


除了在程序中断时通过 LLDB 调试器修改 App 状态，还可以通过在断点中添加 Action 来实现同样的功能，通过断点来设置调试命令的方式更加方便实用，几乎是实时插入代码的效果。如下图，在代码结束前设置一个断点，在编辑框填入多个不同的调试命令，就能实现实时修改代码的效果。同时可以勾选 _Automatically continue after evaluationg actions_，勾选后程序运行到该断点时只会运行相应的命令而不会中断程序，这样就可以在不重新编译的情况下实时注入代码。


![YpfrAXjCcaHFJ5v.png](https://image.xcanoe.top/blog/d32f03ca735923a03e68c25d39a5c252.png)


![ifmowkF6NLHGpOB.png](https://image.xcanoe.top/blog/0b5b431ea9ac9057e89f478ed43b9061.png)

- `name` 指的是断点名称。
- `condition` 指的是触发断点的条件。
- `Ignore` 指的是在中断之前忽略多少次。
- `Action` 指的是断点位置需要执行的操作，可以执行脚本，LLDB命令，打印，发出声音等。
- `Options` 指的是是否在执行 `actions` 之后继续运行。

### 列断点


![AmjVbWQ2Y3qoiUc.png](https://image.xcanoe.top/blog/60e8437886b403942d835d1dfd882bbc.png)


Xcode13 的新特性，列断点（Column Breakpoint）。列断点支持我们在某一行的某一个表达式设置断点，当设置列断点后，程序会在执行列断点设置的表达式之前中断。我们可以通过 Command + 单击需要设置断点的方法，然后在 Xcode 弹起的选择框里选择 Set column breakpoint 来设置列断点。设置列断点后，Xcode 会在方法上方显示一个标识断点的 icon，我们可以像单行断点一样单击 icon 来开关断点，同时双击断点后一样可以编辑断点。设置列断点后，程序将在设置断点的方法之前中断，比如下方断点将在 _objectWithProtocol_ 调用之前中断，其余方法不会触发断点。


## 符号断点


![YEZTsQLA8fiH3y5.png](https://image.xcanoe.top/blog/07eb17ae312207f7b38c06cf9aac761f.png)


符号断点可通过设置函数名称来添加断点，LLDB 会匹配进程中加载的所有库（包括系统库）中的函数名称，如果程序运行到对应的函数将会发生中断。符号断点在平时开发中相当有用，特别是对于一些没有源码权限的库，包括三方库和系统库。在 Xcode 断点栏点击左下角 + 号可以添加符号断点。


比如我们添加一个名为 setAlpha: 的符号断点，会发现筛选出所有符合条件的断点。


![jb3kL2uAIqyStml.png](https://image.xcanoe.top/blog/2c67fe2108e49cca467d61eab14d01b0.png)


如果我们只对某几个断点感兴趣，我们可以通过指定 Module 让符号断点只在某个库中生效，这样就能有效的限制符号断点的数量。


![ReNutTFkC84z7W5.png](https://image.xcanoe.top/blog/a70f536a6535ee9f45b37a9cd9de2e45.png)


符号断点经常在没有源码权限的库中使用，因为对于源码权限，所以我们只能看到汇编代码。对于汇编代码，我们可以通过 LLDB 读取寄存器内容来检验方法入参是否符合预期，_register_ _read_ 命令可以查看所有寄存器内容。


![OYKiNQ5GnoxBWI7.png](https://image.xcanoe.top/blog/5308efb0679c8b28620b276816a33eb9.png)


上图可以看到所有寄存器，但是寄存器名称不好记，我们也可以使用 `$arg1`、`$arg2` 等符号来查看方法入参。如下图，`$arg1`是方法第一个参数也就是对象本身，`$arg2`是方法第二个参数也就是 SEL，po 命令无法直接输出函数名，需要加上`(SEL)`强转，`$arg3`是被赋给`text`的值。


![VL1vRIc9CMyeiNp.png](https://image.xcanoe.top/blog/8d165241a31b7d8f72b7fcd465b0aa61.png)


因为符号断点是强匹配开发者输入的符号，所以当开发者设置符号断点后 LLDB 可能会搜索不到，在 Xcode 13中，苹果对于搜索不到的符号断点做了进一步的优化。如下图当我们输入一个名为 convertToMass 的断点。


![xR6fVpW9Puv4S2n.png](https://image.xcanoe.top/blog/82c563a1754b6e1b0d0e308c5fe7e233.png)


由于程序后没有符合的符号，所以该符号断点没有解析到。对于这种断点，Xcode 13 用了一个新的图标来标识，同时当鼠标移上去后会出现断点未被解析的可能原因，主要包括三种原因：

- 符号名称输入错误
- 所有库均不存在该符号
- 符号对应的库还没有被加载

前两种原因好理解，第三个原因在这种场景下会出现：比如你的 App 在某个时机下（比如点击某个按钮）会加载某个库，这种情况下在未加载时符号断点是不生效的，当库被加载后断点也会被自动解析，同时相应图标也会变成可用状态。通过不同状态的图标标识断点的可用状态，更加一目了然。


## 运行时问题断点


运行时问题断点是指可以为运行时出现的问题设置断点。常见的运行时问题有：

- 在子线程执行 UI
- 在非线程安全的环境里修改变量
- 不安全的访问内存地址
- 执行会导致不确定行为的代码

出现运行时问题 Xcode 会在 issue 栏目下展示对应的问题，如下：


![IO1BGs3JFEka6CS.png](https://image.xcanoe.top/blog/6ba6a4838f6e8df62a336049126f0a6f.png)


运行时出现上述问题可能会影响 App 的运行状态，严重的可能会导致程序崩溃。针对运行时问题，Xcode 支持探测器（_sanitizers_）工具去检测，当开启探测器后，在调试阶段如果遇到运行时问题，Xcode 会记录到发生问题的代码，并以断点的形式中断，让开发者能更便捷的定位到发生问题的原因。


添加运行时问题断点的方式和添加普通全局断点一样，在断点类型里选择 _Runtime Issue Breakpoint_


![uRMfVk374tUyCOD.png](https://image.xcanoe.top/blog/a26664327dc985dce1d58f0c969325d7.png)


添加断点需要指定相应的运行时问题类型


![DYuiAP64HLftg1d.png](https://image.xcanoe.top/blog/bd2160740114fe89466341f5b8f00d94.png)


同时需要在 Scheme Editor 中开启对应的能力，比如添加子线程刷新 UI 检测断点需要开启 _Main Thread Checker_，开启后当程序在运行时检测到相应问题 Xcode 将会以断点形式中断。


![wkD1KhRlTsQZyE6.png](https://image.xcanoe.top/blog/12ef7c9d1a2d3dd402e08f1cc7d90b08.png)


## 其他断点


其他的几种我们或非常熟悉，或不常用，简单说明一下功能：


**Swift 错误断点（Swift Error Breakpoint）**


在 swift 通过 throw 语句抛出异常的时候会中断，因为有些异常一层一层抛出，在最外层进行捕获处理，层级很深，这个可以帮助我们快速定位抛出异常的初始位置。


**全局异常断点 （Exception Breakpoint）**


可以设置 OC 或者 C++语言的全局断点，在程序出现异常的时候，会定位在具体的代码位置。


**OpenGL ES 错误断点（OpenGL ES Error Breakpoint）**


OpenGL是用于2D/3D图形编程的一套基于C语言的统一接口，在桌面windows，Mac，Linux/Unix上均可兼容。在使用 cocoa 框架中 OpenGL 类库绘制 2D/3D 图像时，可以使用该选项添加断点。


**约束错误断点（Constraint Error Breakpoint）**


这个断点只适用于 AppKit，详见[When Is a Constraint Error Breakpo… | Apple Developer Forums](https://developer.apple.com/forums/thread/98280)


**单元测试断点（Test Failure Breakpoint）**


单元测试全局断点。添加后，在单元测试 XCAssert 断言失败时，停留在函数处。此时可以用 lldb 命令 p 强制修改条件满足断言后，继续调试运行。


相关文档：


[快速错误和异常断点 (cocoacasts.com)](https://cocoacasts.com/debugging-applications-with-xcode-swift-error-and-exception-breakpoints)


[5 Xcode breakpoints tips you might not yet know - SwiftLee (avanderlee.com)](https://www.avanderlee.com/debugging/xcode-breakpoints-tips/)
