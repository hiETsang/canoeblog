---
title: 使用 X-Callback-URL 为 App 打造更好的跨应用交互
slug: using-x-callback-url-for-better-cross-app-interaction
description: ''
tags:
  - 快捷指令
  - 开发技巧
  - swift
pubDate: 2024-09-09
category: 技术
---

在移动应用开发中，跨应用的数据传递和交互常常是个复杂的挑战。**X-Callback-URL** 提供了一种简洁而强大的机制，让应用和快捷指令之间实现**自动化**且**可靠的交互**。


---


## **什么是 X-Callback-URL？**


**X-Callback-URL** 是一种基于 URL Scheme 的协议，允许 App 在完成某项操作后，将结果返回给调用方。这种协议常用于**跨应用通信**、**数据传递**，以及与**快捷指令**的集成。


相比于传统 URL Scheme 的跳转方式，X-Callback-URL **内置了状态管理**，支持以下几种回调：

- **x-success**：操作成功时的回调 URL，并自动附带结果数据。
- **x-cancel**：用户取消操作时的回调 URL。
- **x-error**：操作失败时的回调 URL，并附带错误信息。

### **X-Callback-URL 格式示例**


```plain text
shortcuts://x-callback-url/run-shortcut?name=计算小费&input=text&text=24.99&x-success=myapp://success&x-error=myapp://error
```


---


## **X-Callback-URL 的优势**

1. **自动化的状态管理**：

    不需要手动在每个步骤中配置跳转逻辑，系统会根据执行结果自动调用 `x-success`、`x-cancel` 或 `x-error`。

2. **顺畅的用户体验**：

    在 App 和快捷指令之间无缝跳转，完成操作后自动返回，无需手动切换。

3. **跨应用数据传递**：

    可以通过 URL 附带执行结果或错误信息，大大简化了数据传递的逻辑。


---


## **常见使用场景**

1. **App 与快捷指令的交互**：

    X-Callback-URL 为 App 内调用快捷指令提供了更加灵活和强大的方式。它不仅能执行操作，还能自动处理返回结果，大大简化了跨应用交互流程。让我们通过一个具体示例来对比传统 URL Scheme 和 X-Callback-URL 的实现：


    **场景**：从我们的应用发送文本给快捷指令创建一篇备忘录，然后返回执行结果。


    **1. 传统 URL Scheme 实现：**


    ```plain text
    shortcuts://run-shortcut?name=创建备忘录&input=text&text=需要记录的内容
    ```


    使用这种方式，快捷指令执行后无法自动返回我们的应用。我们需要在快捷指令中额外添加一个动作来打开我们的应用：


    ```plain text
    myapp://callback?result=success
    ```


    **2. X-Callback-URL 实现：**


    ```plain text
    shortcuts://x-callback-url/run-shortcut?name=创建备忘录&input=text&text=需要记录的内容&x-success=myapp://callback?result=success&x-error=myapp://callback?result=error
    ```


    使用 X-Callback-URL，我们可以在一个 URL 中指定成功和失败的回调，快捷指令会根据执行结果自动调用相应的 URL。这样不仅简化了快捷指令的配置，还提高了其通用性，使其可以被多个应用复用而无需修改内部逻辑。

2. **跨应用操作协调**：

    一个 App 可以调用另一个 App 完成任务，并在任务结束后获取反馈，比如支付确认或数据同步。

3. **流程自动化**：

    多步任务通过 X-Callback-URL 串联起来，形成自动化工作流。


---


## **如何在 iOS 应用中支持 X-Callback-URL**


### **1. 配置 URL Scheme**


为你的应用配置一个自定义 URL Scheme，让其他应用可以通过该 Scheme 调用你的 App。


**Xcode 配置步骤：**

- 打开项目的 **Info** 标签页。
- 在 **URL Types** 中添加新的 URL Scheme（如 `myapp`）。
- 保存后，确保 App 支持使用 `myapp://` 作为入口。

---


### **2. 解析 X-Callback-URL 请求并执行操作**


你需要在 App 的入口处解析传入的 URL，并根据操作执行不同逻辑。


### **代码示例：UIKit 版**


```swift
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    handleCallbackURL(url)
    return true
}

private func handleCallbackURL(_ url: URL) {
    let components = URLComponents(url: url, resolvingAgainstBaseURL: false)

    guard let queryItems = components?.queryItems,
          let actionName = queryItems.first(where: { $0.name == "name" })?.value,
          let successURL = queryItems.first(where: { $0.name == "x-success" })?.value,
          let errorURL = queryItems.first(where: { $0.name == "x-error" })?.value else {
        print("缺少必要参数")
        return
    }

    performAction(named: actionName) { result in
        switch result {
        case .success(let data):
            if let url = URL(string: "\\(successURL)?result=\\(data)") {
                UIApplication.shared.open(url)
            }
        case .failure(let error):
            if let url = URL(string: "\\(errorURL)?errorMessage=\\(error.localizedDescription)") {
                UIApplication.shared.open(url)
            }
        }
    }
}

private func performAction(named name: String, completion: (Result<String, Error>) -> Void) {
    if name == "doSomething" {
        completion(.success("操作成功"))
    } else {
        completion(.failure(NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "未知操作"])))
    }
}
```


---


### **3. SwiftUI 处理 X-Callback-URL 请求**


如果你的应用使用 SwiftUI，可以通过 `onOpenURL` 处理外部请求。


```swift
@main
struct YourApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    handleCallbackURL(url)
                }
        }
    }

    func handleCallbackURL(_ url: URL) {
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)

        guard let queryItems = components?.queryItems,
              let actionName = queryItems.first(where: { $0.name == "name" })?.value,
              let successURL = queryItems.first(where: { $0.name == "x-success" })?.value,
              let errorURL = queryItems.first(where: { $0.name == "x-error" })?.value else {
            print("缺少必要参数")
            return
        }

        performAction(named: actionName) { result in
            switch result {
            case .success(let data):
                if let url = URL(string: "\\(successURL)?result=\\(data)") {
                    UIApplication.shared.open(url)
                }
            case .failure(let error):
                if let url = URL(string: "\\(errorURL)?errorMessage=\\(error.localizedDescription)") {
                    UIApplication.shared.open(url)
                }
            }
        }
    }

    private func performAction(named name: String, completion: (Result<String, Error>) -> Void) {
        if name == "doSomething" {
            completion(.success("操作完成"))
        } else {
            completion(.failure(NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "未知操作"])))
        }
    }
}
```


---


## **如何测试 X-Callback-URL 支持**

1. 打开 Safari 或其他浏览器，输入以下测试 URL：

    ```plain text
    myapp://x-callback-url/perform-action?name=doSomething&x-success=https://example.com/success&x-error=https://example.com/error
    ```

2. **预期结果：**
    - 如果成功，浏览器会跳转到：

        ```plain text
        <https://example.com/success?result=操作完成>
        ```

    - 如果失败，浏览器会跳转到：

        ```plain text
        <https://example.com/error?errorMessage=未知操作>
        ```


---


## **总结**


X-Callback-URL 是一种高效且灵活的应用交互方式，为跨应用通信提供了强大的解决方案。相比于传统的 URL scheme 调用，X-Callback-URL 具有以下显著优势：

- 内置状态管理，自动处理成功、取消和错误情况
- 支持双向数据传递，实现更复杂的交互逻辑
- 提供更流畅的用户体验，减少手动切换应用

参考文档：


[bookmark](https://support.apple.com/zh-cn/guide/shortcuts/apdcd7f20a6f/ios)


[bookmark](https://x-callback-url.com/)
