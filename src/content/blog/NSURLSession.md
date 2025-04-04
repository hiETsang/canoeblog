---
title: 'NSURLSession'
slug: 'nsurlsession'
description: ''
tags: ["iOS"]
pubDate: 2018-07-14
category: '技术'
---

基本上所有的应用都需要用到网络，Apple 给我们提供的网络交互框架主要是基于 URLSession 的 URL 加载系统。


## URLSession介绍


URLSession 实际指代 Foundation 框架的 URL 加载系统中的一些类和协议。主要由以下几个类组成：


![FLuK4zVMtdb5kq6.png](https://image.xcanoe.top/blog/be6a57e731df9a094284817bd9327cbd.png)

- **URLSession**
    - 负责请求/响应的关键对象，可以理解成和服务端的一个会话，必须创建会话，在会话的基础上进行网络数据的上传和获取，使用 URLSessionConfiguration 配置对象进行创建。
    - 在请求/响应的执行过程中调用 URLSessionTaskDelegate 定义的各种代理方法。
- **URLSessionConfiguration**
    - 用于对 `URLSession` 对象进行初始化，可以配置 **可用网络**、**Cookie**、**安全性**、**缓存策略**、**自定义协议**、**启动事件** 等选项，以及用于移动设备优化的相关选项。
    - 几乎可以配置任何网络相关选项。
- **URLSessionTask**
    - 一个抽象类，其子类可以创建不同类型的任务（Task），如：下载、上传、获取数据（如：JSON 或 XML）。
    - 在特定 Session 中执行。
- **URLRequest**
    - 将 URL 和请求协议相关的属性封装起来，传递给 URLSession 用于创建URLSessionTask。
- **URLResponse**
    - 将返回的元数据和内容数据本身封装起来。

在 apple 官方文档中，将网络模块分为了以下几种类：


![KWsDUduTzlILwO5.png](https://image.xcanoe.top/blog/69c02657c9a297773562a7be30dca421.png)


在一个请求被发送到服务器之前，系统会先查询共享的缓存信息，然后根据 **缓存策略（Cache Policy）** 以及 **可用性（availability）** 的不同，一个已经被缓存的响应可能会被立即返回。如果没有缓存的响应可用，则这个请求将根据我们指定的策略来缓存它的响应，以便将来的请求可以使用。


在一个请求被发送到服务器过程中，服务器可能会发出 **鉴权查询（Authorization Challenge）**，这可以由共享的 Cookie 或 **证书存储（Credential Storage）** 来自动响应，或者由被委托对象来响应。此外，发送中的请求也可以被注册的 `URLProtocol` 对象所拦截，以便在必要时改变其加载行为。


`URLSession` 是负责请求/响应的关键对象，`URLSession` 本身并不会进行请求，而是通过创建 Task 的形式来进行网络请求。同一个 `URLSession` 可以创建多个 Task，并且这些 Task 之间的 Cache 和 Cookie 是共享的。


`URLSession` 在管理请求/响应的过程中会调用相关的代理方法。这些代理方法主要分两类：

- Session 的委托对象实现的代理方法（`URLSessionDelegate` 定义的方法）
    - 主要用于处理连接层问题，如：服务器信任、客户端证书认证、NTLM 和 Kerberos 协议等问题
- Task 的委托对象实现的代理方法（`URLSessionTaskDelegate` 及其子协议定义的方法）
    - 主要用于处理以网络请求为基础的问题，如：Basic，Digest，**代理身份验证（Proxy Authentication）** 等。

## URLSessionTask


`URLSessionTask` 是一个抽象类，其包含如下 5 个实体子类。这 5 个子类封装了 5 个最基本的网络任务：**获取数据**（如：JSON 或 XML）、**上传文件**、**下载文件**、**TCP/IP连接**（iOS9），以及 **websocket 长连接**（iOS13）。


![dq2kAoQFjTSNOUB.png](https://image.xcanoe.top/blog/dc87c79ac3ac48cc827b02780b9d48e6.png)


上图所示为这些类之间的继承关系。对于 `URLSessionDataTask`，服务器会有响应数据；而对于上传请求，服务器也会有响应数据，所以 `URLSessionUploadTask` 继承自 `URLSessionDataTask`。`URLSessionDownloadTask` 完成时，会带回已下载文件的一个临时的文件路径，`URLSessionStreamTask`是 iOS9新加入的类，通过这个类可以直接使用`socket`链接，读取输入流和写入输出流等。`URLSessionWebSocketTask`是 iOS13新加入的类，通过类名很容易联想到是用于 websocket 连接的类，使用的时候需要使用 webSocket 的链接（ws/wss）。


task共有的控制方法：


```plain text
public func cancel()
public func suspend()
public func resume()
```


task 本身是有状态的，枚举 `NSURLSessionTaskState` 列出了这些状态：


```plain text
@available(iOS 7.0, *)
public enum NSURLSessionTaskState : Int {
	case Running /* The task is currently being serviced by the session */
    case Suspended
    case Canceling /* The task has been told to cancel.  The session will receive a URLSession:task:didCompleteWithError: message. */
    case Completed /* The task has completed and the session will receive no more delegate notifications */
}
```


这些很好理解，任务有运行状态，暂停状态，正在取消状态，完成状态。事实上，task 被创建后，就会处于`Suspended`暂停状态，所以当设置好 task 后，需要调用 `resume()` 来启动这个task。调用`suspend()`和`cancel()`则分别暂停和取消 task。


关于 `URLSessionTask` 的数据返回方式，主要有两种方式：

- `completionHandler` **回调**
- `URLSessionDelegate` **代理**

值得注意的是，`URLSessionTask` 及其子类都有着各自的代理协议，它们之间也存在着继承关系，具体的方法可以查阅[官方文档](https://developer.apple.com/documentation/foundation/urlsessiontaskdelegate)。

- `URLSessionDelegate`：定义了网络请求最基础的代理方法。作为所有代理的基类。
- `URLSessionTaskDelegate`：定义了网络请求任务相关的代理方法。
- `URLSessionDownloadDelegate`：定义了下载任务相关的代理方法，如：下载进度等。
- `URLSessionDataDelegate`：定义了普通数据任务和上传任务相关的代理方法。
- `URLSessionStreamDelegate`: 定义了写入和读取流数据等代理方法。
- `URLSessionWebSocketDelegate`: 定义了 WebSocket 建立连接和失去连接的代理。

## URLSessionConfiguration


`URLSessionConfiguration` 对象用于对 `URLSession` 进行初始化。


`URLSessionConfiguration`提供给开发者相当大的灵活性和控制权。从指定可用网络，到 cookie，安全性，缓存策略，再到使用自定义协议，启动事件的设置，以及用于移动设备优化的几个新属性，使用 `URLSessionConfiguration` 可以找到几乎任何想要进行配置的选项。


`URLSession` 在初始化时会把配置它的 `URLSessionConfiguration` 对象进行一次深拷贝，并保存到自己的 `configuration` 属性中，这个属性是只读的。也就是说，`configuration` 只在初始化时被读取一次，之后都是不会变化的。


`URLSessionConfiguration` 有三个类初始化方法：

- `+ defaultSessionConfiguration`
    - 返回一个标准的配置，具有共享 `HTTPCookieStorage`、共享 `URLCache`、共享 `URLCredentialStorage`。
- `+ ephemeralSessionConfiguration`
    - 返回一个预设的配置，该配置中不会对缓存、Cookie和证书进行持久性存储。这对于实现类似无痕浏览这种功能来说是很理想的。
- `+ backgroundSessionConfiguration:(NSString *)identifier`
    - 创建一个后台 Session。后台 Session 不同于普通 Session，后台 Session 可以在应用程序挂起、退出或崩溃的情况下进行上传/下载任务。初始化时指定的标识符，可用于向任何可能在进程外恢复后台传输的 **守护进程（daemon）** 提供上下文。

### 常用配置


`HTTPAdditionalHeaders` 为基于 configuration 的 Session 生成的所有 Task 中的 `NSRULRequest` 对象添加额外的请求头部字段。默认为空。


`URLSession` 默认为 `URLRequest` 对象添加了如下请求头部字段：

- `Authorization`
- `Connection`
- `Host`
- `Proxy-Authenticate`
- `Proxy-Authorization`
- `WWW-Authenticate`

如果在 `HTTPAdditionalHeaders` 自定义的头部字段与 `URLRequest` 对象重复了，则优先使用 `URLRequest` 对象中的请求头部字段。


利用 `HTTPAddtionalHeaders` 可以添加如下这些请求头部字段：

- `Accept`
- `Accept-Language`
- `User-Agent`
- …

```plain text
open var networkServiceType: NSURLRequest.NetworkServiceType  // 指定网络请求的类型，枚举

    open var allowsCellularAccess: Bool				// 是否使用蜂窝网络

	  var requestCachePolicy: NSURLRequest.CachePolicy	// 缓存策略

    open var timeoutIntervalForRequest: TimeInterval  // 请求超时时间。默认60s

    open var timeoutIntervalForResource: TimeInterval  // 基于此配置的会员所有资源下载的超时时间，默认7天
```


## cookie 存储


URL Loading System 提供了 app 级别的 cookie 存储机制。URL Loading System 中涉及到 cookie 操作的两个类分别是：

- `HTTPCookieStorage`：这个类提供了管理 cookie 存储的功能。默认情况下会使用 `HTTPCookieStorage` 的 `+ sharedHTTPCookieStorage` 单例。
- `HTTPCookie`：用来封装 cookie 数据和属性的类。

`URLRequest` 提供了 `HTTPShouldHandleCookies` 属性来设置请求发起时，是否需要 cookie manager 自动处理 cookie。


## 安全策略


有些服务器会对某些特定的内容限制访问权限，只对提供了信任证书通过认证的用户提供访问资格。对于 web 服务器来说，受保护的内容被聚集到一个需要凭证才能访问的区域。在客户端上，有时也需要根据凭证来确定是否信任要访问的服务器。


URL Loading System 提供了封装凭证（credentials）、封装保护区域（protected areas）和保存安全凭证（secure credential）的类：

- `URLCredential`：封装一个含有认证信息（比如用户名和密码等）和持久化存储行为的凭证（credential）。
- `URLProtectionSpace`：服务器上某个需要凭证才能访问的区域。
- `URLCredentialStorage`：管理凭证的存储以及 `URLCredential` 和相应的 `URLProtectionSpace` 之间的映射关系。
- `URLAuthenticationChallenge`：在客户端向有限制访问权限的服务器发起请求时，服务器会询问凭证信息，包括凭证、保护空间、认证错误信息、认证响应等。这个类会将这些信息封装起来。`URLAuthenticationChallenge` 实例通常被 `URLProtocol` 子类用来通知 URL Loading System 需要认证，以及在 `URLSession` 的代理方法中用来处理认证。

## Cache 管理


URL Loading System 提供了 app 级别的 HTTP 响应缓存，在使用 `NSURLSession` 发起请求时，我们可以通过设置 `URLRequest` 和 `URLSessionConfiguration` 的缓存策略（cache policy）来决定是否缓存以及如何处理缓存。同时，我们还可以通过实现 `URLSession:dataTask:willCacheResponse:completionHandler:` 方法来针对特定的 URL 设置缓存策略。


实际上，不是所有请求的响应都能被缓存起来，URL Loading System 目前只支持对 http 和 https 请求的响应进行缓存。


URL Loading System 中提供的管理缓存的类有以下两个：

- `NSURLCache`：通过这个类可以设置缓存大小和位置，以及读取和存储各个请求的 `NSCachedURLResponse`。
- `NSCachedURLResponse`：封装了请求元数据（一个 `NSURLResponse` 对象）和实际响应内容（一个 `NSData` 对象）。

## 采集数据


收集完毕 task 的指标（metrics）会调用`urlSession(_:task:didFinishCollecting:)`方法。该方法的 metrics 参数封装了 session task 的指标。


每个`URLSessionTaskMetrics`对象都包含`taskInterval`和`redirectCount`，以及任务执行过程中进行的每个 request、response 交互。


`URLSessionTaskMetrics`类包含以下三个属性：

- taskInterval：任务发起至任务完成的时间。
- redirectCount：任务执行过程中重定向次数。
- transactionMetrics：数组内元素为任务执行期间每个 request-response 事务度量标准。元素类型为`URLSessionTaskTransactionMetrics`。

`URLSessionTaskTransactionMetrics`对象封装执行会话任务期间收集的性能指标。每个`URLSessionTaskTransactionMetrics`对象包含了一个 request 和 response 属性，对应于 task 的 request 和 response。其也包含时间指标（temporal metrics），以`fetchStartDate`开始，以`responseEndDate`结束，以及其他特性，例如：`networkProtocolName`和`resourceFetchType`。


下图显示了URL会话任务的事件序列，这些事件对应于`URLSessionTaskTransactionMetrics`捕获的时间指标。


![3151492-7433801593abd6e3.png](https://image.xcanoe.top/blog/708e8c4cbfd0c4f6966e3b239ee6d8e7.png)


对于具有开始日期和结束日期的所有指标，如果任务的某个方面未完成，则相应指标结束日期为 nil。在解析域名时，操作超时、失败，或客户端在解析成功前取消了任务，则可能发生这种情况。在此情况下，`domainLookupEndDate`属性为 nil，其后所有指标均为 nil。


## 协议支持


URL Loading System 本身只支持 http、https、file、ftp 和 data 协议。`URLProtocol` 是一个抽象类，提供了处理 URL 加载的基础设施。通过实现自定义的 `URLProtocol` 子类，可以让我们的 app 支持自定义的数据传输协议。


**借助URLProtocol，我们不必改动应用在网络调用上的其他部分，就可以改变 URL 加载行为的全部细节**。运用这一点，我们可以自由发挥，做很多想做的事情，比如：

- [拦截图片加载请求，转为从本地文件加载](http://stackoverflow.com/questions/5572258/ios-webview-remote-html-with-local-image-files)
- [在 UIWebView 中加载 webp 图片](https://github.com/cysp/STWebPDecoder)
- [通过缓存静态资源实现 UIWebView 的预加载优化](https://github.com/ShannonChenCHN/iOSLevelingUp/issues/55#issuecomment-300365305)
- [UIWebView 离线缓存](https://github.com/rnapier/RNCachingURLProtocol)
- [为了测试对HTTP返回内容进行mock和stub](https://draveness.me/%5Bhttps://github.com/AliSoftware/OHHTTPStubs%5D)
- [实现一个 In-App 网络抓包工具](https://github.com/Flipboard/FLEX/tree/master/Classes/Network)

## 总结


作为 iOS 原生的网络框架，我们的应用中的所有网络交互几乎都基于 URLSession ，所以理解并熟练掌握 URLSession 的使用非常有必要，既可以学习到苹果对于网络的一些设计，也能对我们学习一些三方库的原理有很大帮助。


相关文档：


[NSURLSession | Apple Developer Documentation](https://developer.apple.com/documentation/foundation/nsurlsession)


[iOS中的网络调试 (qq.com)](https://mp.weixin.qq.com/s/K0_3efxXKJM3fU-Icyh7Hg)