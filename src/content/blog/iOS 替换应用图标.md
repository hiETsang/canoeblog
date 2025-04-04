---
title: iOS 替换应用图标
slug: ios-replace-app-icon
description: ''
tags:
  - iOS
  - 开发技巧
  - 工具
pubDate: 2020-12-17
category: 技术
---

替换应用图标的实现，简单，不过为了防止以后做类似需求时忘记步骤，做个记录。


## 一、导入图标资源


准备应用图标资源，放在 group 目录下，注意不是导入 assert 文件夹。iPhone 图标提供`60*60`的@2x 和@3x的图标，@2x 应用图标大小为`120*120`，@3x 图标大小为`180*180`，如果需要支持 iPad，还需要`76*76`的@1x和@2x，`83.5*83.5`的@2x。命名保持统一，可以用[图标工场](https://icon.wuruihong.com/)生成，也可以让设计给。最终导入效果如下：


![LSz2Afsh4DjQ9H1.png](https://image.xcanoe.top/blog/abc2eec4ed546ea0ec17aaa80c73bba3.png)


## 二、修改 plist 文件


用 source code模式打开 app 的 plist 文件，设置对应的 key-value：


```xml
<key>CFBundleIcons</key>     // 应用图标
<dict>
    <key>CFBundleAlternateIcons</key>   // 可替换的图标
    <dict>
        <key>logokuan</key>							// 代码中使用的图标名
        <dict>
            <key>CFBundleIconFiles</key>     // 图标名对应的图标资源
            <array>
                <string>logokuan-60</string>
                <string>logokuan-76</string>
                <string>logokuan-83.5</string>
            </array>
        </dict>
    </dict>
    <key>CFBundlePrimaryIcon</key>					// 应用主图标，可以不进行操作，默认会取 assets 内的 icon
    <dict>
        <key>CFBundleIconFiles</key>				// 图标资源
        <array>
            <string></string>
        </array>
        <key>CFBundleIconName</key>			   // 图标名
        <string></string>
        <key>UIPrerenderedIcon</key>       // 是否带光泽效果 (ios7 以上废弃)
        <false/>
    </dict>
</dict>
<key>CFBundleIcons~ipad</key>							// ipad图标配置，和上面的类似
<dict>
    <key>CFBundleAlternateIcons</key>
    <dict>
        <key>logokuan</key>
        <dict>
            <key>CFBundleIconFiles</key>
            <array>
                <string>logokuan-60</string>
                <string>logokuan-76</string>
                <string>logokuan-83.5</string>
            </array>
        </dict>
    </dict>
    <key>CFBundlePrimaryIcon</key>
    <dict>
        <key>CFBundleIconFiles</key>
        <array>
            <string></string>
        </array>
        <key>CFBundleIconName</key>
        <string></string>
        <key>UIPrerenderedIcon</key>
        <false/>
    </dict>
</dict>
```


设置完成之后，使用 property list 查看配置如下：


![s3bSGXrMeHEiCAK.png](https://image.xcanoe.top/blog/cbfbcbbe494a81d626e9dfddb56487d9.png)


到了这里，我们的配置工作已经完成了，接下来就是在代码中实现。


## 三、代码实现替换逻辑


代码非常简单，系统给我们提供了如下 API：


```plain text
// If false, alternate icons are not supported for the current process. 是否支持更改图标
    @available(iOS 10.3, *)
    open var supportsAlternateIcons: Bool { get }


    // Pass `nil` to use the primary application icon. The completion handler will be invoked asynchronously on an arbitrary background queue; be sure to dispatch back to the main queue before doing any further UI work.  设置应用图标，为 nil 时使用主图标。
    @available(iOS 10.3, *)
    open func setAlternateIconName(_ alternateIconName: String?, completionHandler: ((Error?) -> Void)? = nil)


    // If `nil`, the primary application icon is being used. 获取当前的应用图标名称，为 nil 时为主图标。
    @available(iOS 10.3, *)
    open var alternateIconName: String? { get }
```


根据以上的代码就可以实现替换的功能，需要注意的一点是在`setAlternateIconName(_ alternateIconName: String?, completionHandler: ((Error?) -> Void)? = nil)` 闭包内如果需要对 UI 进行刷新或者其他的处理，需要回到主线程操作。
