---
title: 打探一款app的内部实现
slug: exploring-app-internal-implementation
description: ''
tags:
  - iOS
pubDate: 2018-03-07
category: 技术
---

相信每一名开发人员对于一款优秀产品的内部实现都会很好奇，而且现在app越来越多，竞品也是越来越多，我们对于其他app的内部实现方式的研究也越来越重要，会想知道某个核心功能使用了哪些第三方服务、数据库是如何设计的、沙盒目录结构是什么样的，某一个UI效果是如何实现的等。最近这两天我对这方面做了一些探索，之后还会慢慢深入研究。


## 目标

- 查看app的资源文件以及使用的SDK
- 查看app的.h文件
- 查看app使用的第三方库
- 查看app的界面结构

## 环境

- macOS High Sierra 10.13.4
- [reveal 14](https://revealapp.com/)以及他的[“钥匙”（密码: uyp7）](https://pan.baidu.com/s/1C-gAUuDos43WZNyQYQWAFg) 。
- Apple Configurator 2 （apple stroe可下载）
- pp助手或者其他越狱app市场
- 越狱手机一台

以上条件非必要条件，有很多实现我们目标的方式，可以先看下面的内容然后根据自己的需要再去选择的下载。


## 一、查看app的资源文件以及使用的SDK


不记得从什么时候开始，iTunes没有应用商店了，从此很长的一段时间，我都没有找到一种方式拿到想要应用的ipa的包，直到在谷歌上看到一种利用 Apple Configurator 2拿到ipa包的技巧。

1. 首先在apple store里面搜索下载Apple Configurator 2。
2. 连接iphone(不需要越狱)。
3. 登录apple ID，登录的apple ID需要曾经下载过该app，不然搜索不到。

![16350D37-7C3B-43F7-B204-6DBC3686DAE2.png](https://image.xcanoe.top/blog/583cdf5ff18d60fd0c95be1b0c45a38f.png)

1. 选择手机，手机里面需要已经安装上了该app，然后点击添加应用。

![42E23FB5-5BB2-44AB-BC3E-816F219AFDCF.png](https://image.xcanoe.top/blog/64c2df4f441c6184ceb3b73fda40fa72.png)

1. 从应用列表中选择需要获取ipa包的应用。
2. 然后就会开始下载，因为手机上已经存在该应用，所以会提示是否替换，此时不需要点击任何按钮，我们进行下一步操作。
3. 打开finder，前往`~/Library/Group Containers/K36BKF7T3D.group.com.apple.configurator/Library/Caches/Assets/TemporaryItems/MobileApps/`该路径就可以看到ipa文件了。

![F40BAEF3-322C-426E-843F-17E9DB868824.png](https://image.xcanoe.top/blog/a58189d8bf73b9f90a18fea8c3cb6ea0.png)

1. 然后我们可以把ipa文件复制出来，Apple Configurator 2可以选择停止，然后修改ipa后缀为zip，解压。
2. 打开文件夹，进入payload，选择app右键显示包内容我们就能看到安装包的图片等资源和一些SDK了，打开info.plist还能看到app所支持的url scheme。

![575D4BC0-0F7B-4E76-AEA6-632A6E706EC3.png](https://image.xcanoe.top/blog/4f3909c9b01b3b7fd359e15269a344a6.png)


![CD222CCE-53B4-4215-BA54-11059A169735.png](https://image.xcanoe.top/blog/6c04639f86f2760de2ce93b5fd07b344.png)


## 二、查看app的.h文件


正常情况下，如果要导出一个已安装应用的头文件，我们只需要使用 class-dump对已经砸壳的应用进行处理就可以了。这里引入了两个名词，砸壳和class-dump。


**砸壳**


但是当我们直接从 AppStore 上面下载安装应用的时候，这些应用都被苹果进行过加密了，在可执行文件上加了一层壳。在这种情况下，如果我们想要获取头文件，就需要先破坏这一层保护壳，这就是所谓的“砸壳”。


获取砸壳的应用方式有两种。

- 自己砸壳，网上有很多好的[砸壳教程](http://www.swiftyper.com/2016/05/02/iOS-reverse-step-by-step-part-1-class-dump/)或者[一条命令完成砸壳](http://www.alonemonkey.com/2018/01/30/frida-ios-dump/)，也可以自己谷歌，这里不再多说。
- 使用pp助手从越狱市场下载一款越狱版本的app，一般来说，越狱市场上的app都是已经被砸壳的，当然会有少数的app还没有被砸壳，那就需要我们自己去砸壳啦，当然基本我们需要研究的app都是较为知名的，基本都已经被砸壳。

![3BAB3BEC-C6DE-4567-B8CD-D6AF098BA2EF.png](https://image.xcanoe.top/blog/30e60cc298677d53ef4c1dc8d9fb702c.png)


**class-dump**


class-dump是用来dump目标文件的类信息的工具。它利用Objective-C语言的runtime的特性，将存储在mach-O文件中的@interface和@protocol信息提取出来，并生成对应的.h文件。官方介绍如下：

> This is a command-line utility for examining the Objective-C runtime information stored in Mach-O files. It generates declarations for the classes, categories and protocols. This is the same information provided by using ‘otool -ov’, but presented as normal Objective-C declarations, so it is much more compact and readable.

**步骤：**

1. 获取一款已经砸壳的app。
2. class-dump[下载](http://stevenygard.com/projects/class-dump/)。
3. 下载完成之后，将dmg文件中的class-dump复制到_usr_local/bin目录,然后执行命令`sudo chmod 777 /usr/local/bin/class-dump`。

![D2113093-A4D6-4E82-ACAA-761E15523B54.png](https://image.xcanoe.top/blog/3a40432c5b5d79f7ec810081a19a88a1.png)

1. 找到app，执行操作`class-dump -H /Users/canoe/Desktop/WeChat.app -o /Users/canoe/Desktop/AppHeader`。如果AppHeader文件夹内没有出现头文件那么就是执行失败，需要检查是否是app没有砸壳的原因。

![373398B1-D9BE-4BF3-B4FC-38B1A1F04DA2.png](https://image.xcanoe.top/blog/37116b5e1b011517ae3ce5f060296e58.png)


## 三、查看app使用的第三方库


有时候我想知道app使用的第三方库，但是使用 class-dump 导出的头文件非常多，仅靠肉眼查看时，根本不能很好的找出来。于是有人发明了一个工具，能够获取某个app的三方库，并且查看pod库的star数，以及源地址。


该工具的实现原理是利用三方库的头文件去反查第三方库。

1. 在[GitHub - lefex/WeChatShot](https://github.com/lefex/WeChatShot)中下载源码。
2. 下载源码后修改`main.py`文件的`IPA_HEADER_PATH`为 class-dump 导出的头文件目录。
3. 命令行cd到main.py目录中，执行`python main.py`。

![8CBC405E-C3EE-4667-9109-B0D7626E457F.png](https://image.xcanoe.top/blog/8f15c3a6453933dd1fb392316066a69e.png)


## 四、查看一款app的UI界面

1. 在越狱手机`cydia`中下载安装`cydia substrate`，`Reveal2Loader`，注意安装的先后顺序。
2. iOS-设置-Reveal，选择需要启用Reveal支持的目标App。
3. 打开`reveal`，然后打开app，看是否可以直接查看。不出意外的话会出现下面的错误提示，因为`reveal2loader`中的`revealframework`版本太低了无法匹配我目前使用的最新版本14，所以我们需要对它进行替换。

![A1A08DE5-B4B6-4599-967A-9C461B1A5A3E.png](https://image.xcanoe.top/blog/d741b9a4cc56be5e7ce85b138f01cd1b.png)

1. 现在我们需要将`reveal`的framework传送到手机中，有两种方式传输方式，首先mac连接手机。

![64C4D384-35FA-4854-83B0-EA45185E1AD6.png](https://image.xcanoe.top/blog/cf997597db1726baebd72342ac7eece1.png)


一是可以使用ssh传输，用pp助手打开openssh，根据弹出的提示的ip地址以及密码输入指令。


`scp  /Applications/Reveal.app/Contents/SharedSupport/iOS-Libraries/RevealServer.framework/RevealServer root@192.168.1.x:/System/Library/Frameworks/RevealServer.framework`


二是直接使用pp助手的文件管理功能，直接将`revealframework`导入覆盖`/System/Library/Frameworks`目录下的文件。

1. 现在重新打开`reveal`以及测试的app，这个时候就可以直接打开看UI结构了。

![1F5A0D2C-664E-4600-A602-08CA5F782BC2.png](https://image.xcanoe.top/blog/eab384e724ddd859182e04268eb217db.png)


## 总结


以上就是对app内部的一些简单的尝试和探索，还有很多可以继续深入的地方，要分析一个 APP 光有头文件是远远不够的，我们还需要使用 Hopper 对其进行静态分析，以及使用 lldb 配合cycript 进行动态分析，甚至是写一些插件来实现一些好玩的功能，这些我接下来都会去尝试和学习。


## 参考：

- [iOS应用逆向工程](https://www.amazon.cn/gp/product/B00VFDVY7E/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00VFDVY7E&linkCode=as2&tag=buginux-23)

---


### 🍄小彩蛋—免越狱修改微信的图标


参考：[免越狱修改微信](https://mp.weixin.qq.com/s/Wb80oObXGZ42qx3k7-cXpA)

1. 下载微信。
2. 砸壳。
3. 下载IPAPatch[GitHub - Naituw/IPAPatch: Patch iOS Apps, The Easy Way, Without Jailbreak.](https://github.com/Naituw/IPAPatch)
4. 将微信的ipa替换掉IPAPatch工程内的ipa。
5. IPAPatch工程内加入reveal的framework。
6. 替换app.ipa内的图标资源（不可以解压，直接压缩包内替换）[微信美化的资源](http://jabizb.com/pc/mh.html)。
7. 修改bundleID。
8. 运行。

![ace8f9afgy1fr6e31f503j20ku112juo.jpeg](https://image.xcanoe.top/blog/6c005033ddd71f66a31bea19920e8b5a.jpeg)


![ace8f9afgy1fr6e32jhj4j20ku112n4d.jpg](https://image.xcanoe.top/blog/414b987892b6f9de50bbefcb2f5492ff.jpg)


![ace8f9afgy1fr6e257regj20ku11275n.jpeg](https://image.xcanoe.top/blog/7d18b70b3cd0ea1f9e6b13f3f4c7c0a4.jpeg)


![ace8f9afgy1fr6e33b4unj20ku112gzp.jpeg](https://image.xcanoe.top/blog/9613e00c0dcb8e79416da4cc31f10449.jpeg)

> ⚠️注意：这个方法有一定的缺陷，例如推送不及时，而且跳转微信的时候无法跳转进来，而且有可能被微信查出弹窗警告，介意勿用，建议尝鲜或者小号使用。
