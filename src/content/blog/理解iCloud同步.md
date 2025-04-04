---
title: 理解iCloud同步
slug: understanding-icloud-sync
description: ''
tags:
  - iOS
pubDate: 2019-03-07
category: 技术
---

> Use the iCloud Storage APIs to write user documents and data to a central location and access those items from all of a user’s computers and iOS devices. Making a user’s documents ubiquitous using iCloud means that a user can view or edit those documents from any device without having to sync or transfer files explicitly. Storing documents in a user’s iCloud account also provides a layer of security for that user. Even if a user loses a device, the documents on that device are not lost if they are in iCloud storage.

_翻译：使用iCloud存储API将用户文档和数据写入中央位置，并从用户的所有计算机和iOS设备访问这些项目。使用iCloud无处不在的用户文档意味着用户可以从任何设备查看或编辑这些文档，而无需显式同步或传输文件。将文档存储在用户的iCloud帐户中也为该用户提供了一个安全层。即使用户丢失设备，如果在iCloud存储中，该设备上的文档也不会丢失。_


**以上是苹果官方文档中对于iCloud的一段说明。**


iCloud是苹果提供的一种数据存储同步方案，每个使用apple id登录，每个用户默认的iCloud存储空间有5G，由所有的程序之间共享，iCloud可以存储任意的文件，字符串，文档等数据。对于用户来说非常方便。


## 概念


为了更好的理解和使用iCloud，先让我们搞清楚两个概念！


### 沙盒Document目录下自动同步到iCloud


在接触沙盒的时候，我们会了解到应用沙盒下的document目录会自动同步数据到icloud，那么为什么我们还要来开发iCloud同步呢？为什么不直接将文件保存在document目录下就好了？原因在于iOS 5以前，当设备跟iTunes同步时，应用的Documents文件夹下的内容会自动备份。在iOS 5及后续版本的设备上，这些内容会备份到iCloud，但开发者手动保存在iCloud的Documents中的数据不会包括在备份中（已经由开发者单独保存到iCloud中了）。要注意这个自动备份和iCloud同步是不同的。自动备份文档被当做不透明的数据，只能用来完全恢复一个iOS设备。而无论是通过编程还是用户，都无法访问单个文件。


**总结：沙盒下的document目录下的文件自动同步到iCloud 中对于用户和开发者来说都是不能直接访问的，他只能作为一个整体用于手机备份恢复使用。**


### iCloud Drive


一句话说来，就是苹果提供的云盘，实际上和Dropbox，One Drive，Google Drive，百度云盘等类似，都是用户来存放数据的地方，里面的内容对于用户来说是直接可见的，那这又和我们开发iCloud有什么关系呢？


![20141226191236343.png](https://image.xcanoe.top/blog/05eef957ad1de0d702c32e56453966ad.png)


事实上我们知道，我们开发的每一个app都是独立的，在iCloud中也有很多分开的容器，分别对应我们的app，每一个app打开了iCloud功能后有一个默认的容器，你也可以再多创建几个容器存你的应用数据，同时，我们可以配置两个或者多个app共享同一个容器数据，例如，如果你提供免费和付费版本的应用程序，则可能希望用户在从免费版本升级到付费版本时保留对其iCloud文档的访问权限。在这种情况下，配置这两个应用程序将其数据写入同一个iCloud容器。


![869B4922-CD60-4420-9DC8-E9BB736302E8.png](https://image.xcanoe.top/blog/34dfa0845113e13bd68a4a1cd80f94af.png)


iCloud Drive可以看作是系统提供的一个公共容器，我们应用只需要做一些[配置](https://developer.apple.com/library/content/documentation/General/Conceptual/iCloudDesignGuide/Chapters/DesigningForDocumentsIniCloud.html#//apple_ref/doc/uid/TP40012094-CH2-SW20)，就可以让应用程序的数据存储在iCloud Drive中，iCloud Drive将在用户的iCloud Drive文件夹中为你的应用程序创建一个文件夹来存储这些文档。


**总结：iCloud Drive是苹果给用户提供的云盘服务，他和iCloud备份共同使用5G的存储空间，用户可以随时打开操作和管理iCloud Drive中的文件，而我们通过一些配置也可以通过应用程序来访问和保存数据到iCloud Drive。**


## 配置


在搞清楚到底我们所开发的iCloud同步是什么之后，我们来进行开发之前的配置。


一、首先需要有一个开发者账号。


二、如果没有appid，先创建appid，如果有，那么我们需要对appid进行编辑,打开iCloud并且按照图示选择。


![0F74A8A2-CBCA-42FF-8471-A55D1180D147.png](https://image.xcanoe.top/blog/c737464cbb452d512848a9f5425f45c2.png)


三、设置iCloud证书，ID在bundle id前面加上iCloud.。


![2E0F40B9-C2F6-44C9-99CA-47904D990CCC.png](https://image.xcanoe.top/blog/e2b98de0138a39de15e28cd8a2570820.png)


![791C95E9-322F-4DD7-AB99-CF4B7B1D3D9C.png](https://image.xcanoe.top/blog/081572f9330033bf1b7e221169ebc75d.png)


四、然后打开项目，按照图示根据需要选择需要使用的功能，如果不知道选择哪种方式的iCloud同步，可以看下面的部分。


![80291-20161017205611217-1944118966.png](https://image.xcanoe.top/blog/7d6663dbec34d490539cd829d765e5b4.png)


如果配置出现了问题，可以参考[**这篇文章**](http://www.cnblogs.com/wujy/archive/2016/10/17/5971273.html)。


## 开发


在弄清楚iCloud同步的实质以及配置完成后，我们来看如何选择iCloud同步方式。icloud同步也有三种方式，我们可以根据自己的需要选择不同的方式来集成。下面的图片是从官方文档截取下来翻译的，可以作为对比参照。


![simpread-iCloud%20.png](https://image.xcanoe.top/blog/aaf89852a79d6d2e42ecd567f295ce22.png)


### key-value data storage：分享小量的非关键配置数据


参考文档：


[Apple Developer Documentation](https://developer.apple.com/documentation/foundation/nsubiquitouskeyvaluestore#overview)


key-value data storage优点是使用方便，简单，不过他主要用于非关键的配置数据，用法和NSUserDefaults类似。限制为64KB（单个key也限制为64KB），对于少量数据使用iCloud键值存储：股票或天气信息，位置，书签，最近的文档列表，设置和偏好以及简单的游戏状态。保存的数据也只能是Property-list数据。


**使用：**


```plain text
//初始化
self.myKeyValue = [NSUbiquitousKeyValueStore defaultStore];

//保存数据
[self.myKeyValue setObject:@"dong" forKey:@"name"];
[self.myKeyValue synchronize];

//读取数据
[self.myKeyValue objectForKey:@"name"]

//消息通知
//NSUbiquitousKeyValueStoreDidChangeExternallyNotification，这个通知是在首次使用软件同步的时候，或者其他设备也通过icloud修改数据的时候调用的，可以通过该通知处理相应的逻辑
[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(StringChange:) name:NSUbiquitousKeyValueStoreDidChangeExternallyNotification object:self.myKeyValue];
```


验证方法很简单，直接设置一个字符串，然后把软件卸载了，之后重新安装之后，直接来获取这个字符串即可，因为是在icloud保存的，所以即使软件卸载了，照样可以获取到之前保存的字符串。


### document storage：存储用户文档和应用数据


使用Document Storage来管理应用的关键数据。与应用main data model直接相关的文件和数据，总是应该使用Document Storage。如用户文档、私有的app数据文件、以及应用或用户生成的数据文件。


**使用：**


### UIDocument


UIDocument是操作iCloud的基类，因为文件内容的操作需求比较多，所以需要创建一个子类比如MyDocument来继承UIDocument，并且重写下面这两个函数


```plain text
- (BOOL)loadFromContents:(id)contents ofType:(nullable NSString *)typeName error:(NSError **)outError __TVOS_PROHIBITED
- (nullable id)contentsForType:(NSString *)typeName error:(NSError **)outError __TVOS_PROHIBITED
```


通过这两个函数来做到转换我们本地的数据和iCloud的数据。


```plain text
#import "XDocument.h"

@implementation XDocument

#pragma mark - 重写父类方法
/**
 *  保存时调用
 *  @param typeName 文档文件类型后缀
 *  @param outError 错误信息输出
 *  @return 文档数据
 */
- (id)contentsForType:(NSString *)typeName
                error:(NSError *__autoreleasing *)outError
{
    if (self.data) {
        return [self.data copy];
    }
    return [NSData data];
}

/**
 *  读取数据时调用
 *  @param contents 文档数据
 *  @param typeName 文档文件类型后缀
 *  @param outError 错误信息输出
 *  @return 读取是否成功
 */
- (BOOL)loadFromContents:(id)contents
                  ofType:(NSString *)typeName
                   error:(NSError *__autoreleasing *)outError
{
    self.data = [contents copy];
    return true;
}

@end
```


### 判断iCloud是否可用


```plain text
- (BOOL)iCloudEnable {

    // 获得文件管理器
    NSFileManager *manager = [NSFileManager defaultManager];

    // 判断iCloud是否可用
    // 参数传nil表示使用默认容器
    NSURL *url = [manager URLForUbiquityContainerIdentifier:nil];
    // 如果URL不为nil, 则表示可用
    if (url != nil) {

        return YES;
    }

    NSLog(@"iCloud 不可用");
    return NO;
}
```


### 上传文件到iCloud


```plain text
/**
 上传文件到iCloud，不存在则新建，存在则覆盖

 @param name 存储在iCloud中的名称
 @param localFile 本地文件名称
 @param block 保存状态
 */
- (void)uploadToiCloud:(NSString *)name localFile:(NSString *)localFile callBack:(loadBlock)block {

    NSURL *iCloudUrl = [self iCloudFilePathByName:name];
    NSURL *localUrl = [self localFileUrl:localFile];

    XDocument *localDoc = [[XDocument alloc]initWithFileURL:localUrl];
    XDocument *iCloudDoc = [[XDocument alloc]initWithFileURL:iCloudUrl];

    [localDoc openWithCompletionHandler:^(BOOL success) {
        if (success) {
            iCloudDoc.data = localDoc.data;
            [iCloudDoc saveToURL:iCloudUrl forSaveOperation:UIDocumentSaveForOverwriting completionHandler:^(BOOL success) {

                [localDoc closeWithCompletionHandler:^(BOOL success) {
                }];

                if (block) {
                    block(success);
                }
            }];
        }
    }];
}
```


### 从iCloud下载文件到沙盒目录


```plain text
/**
 下载iCloud文件到本地沙盒，沙盒中存在则覆盖，不存在则新建

 @param name iCloud文件名
 @param localFile 存储在本地的文件名
 @param block 下载下来的Data数据
 */
- (void)downloadFromiCloud:(NSString*)name localfile:(NSString*)localFile callBack:(downloadBlock)block {

    NSURL *iCloudUrl = [self iCloudFilePathByName:name];
    NSURL *localUrl = [self localFileUrl:localFile];

    XDocument *localDoc = [[XDocument alloc]initWithFileURL:localUrl];
    XDocument *iCloudDoc = [[XDocument alloc]initWithFileURL:iCloudUrl];

    [iCloudDoc openWithCompletionHandler:^(BOOL success) {
        if (success) {

            localDoc.data = iCloudDoc.data;
            [localDoc saveToURL:localUrl forSaveOperation:UIDocumentSaveForOverwriting completionHandler:^(BOOL success) {
                [iCloudDoc closeWithCompletionHandler:^(BOOL success) {
                }];

                if (block) {
                    block(success,localDoc.data);
                }
            }];
        }
    }];
}
```


### 删除iCloud上的文件


```plain text
- (BOOL)removeFileIniCloud:(NSString *)name
{
    if (name.length <= 0) {
        NSLog(@"请传入需要删除的文件名 ！");
        return NO;
    }

    if ([self isExistIniCloudByName:name] == NO) {
        NSLog(@"需要删除的文件不存在 ！");
        return YES;
    }

    NSURL *url = [self iCloudFilePathByName:name];
    NSError *error = nil;
    //删除文档文件
    [[NSFileManager defaultManager] removeItemAtURL:url error:&error];
    if (error) {
        NSLog(@"删除文档过程中发生错误，错误信息：%@",error.localizedDescription);
        return NO;
    }else
    {
        return YES;
    }
}
```


### 获取iCloud文件列表


```plain text
self.query = [[NSMetadataQuery alloc] init];
                self.query.searchScopes = @[NSMetadataQueryUbiquitousDocumentsScope];
                //注意查询状态是通过通知的形式告诉监听对象的,iCloud文件索引完成后通知回调(只在初始化的时候回调一次)
                [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(metadataQueryFinish:) name:NSMetadataQueryDidFinishGatheringNotification object:self.query];
//数据获取完成通知,iCloud得到文档数据和修改文档数据时调用(每次更新icloud文件会自动多次回调)
                [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(metadataQueryDidUpdate:) name:NSMetadataQueryDidUpdateNotification object:self.query];//查询更新通知
```


目前这些是常用的iCloud文件同步和修改删除操作，我对这些操作进行了一下封装，加了接口使之用起来更加简单快捷。如果有需要，可以去我的[GitHub](https://github.com/XDislikeCode)下载[Demo](https://github.com/XDislikeCode/XiCouldManager)。


### CloudKit


CloudKit的使用场景并不常见，一般是自己公司没有服务器的时候，CloudKit可以在一定程度上代替云端存储需求，当然这样子非常方便，等于苹果给你搭建了一个服务器，你只需通过制定的api就可以像拥有一个后台一样存取数据，对于独立开发者来说更加重要，但是也有他的局限性，既然是基于iCloud，那么只能在苹果的生态圈内使用。


CloudKit主要由两个部分组成:


一个仪表web页面用于管理公开数据的记录类型。


一组API接口用于iCloud和设备之间的数据传递。


具体的使用可以翻阅[官方文档](https://developer.apple.com/icloud/cloudkit/)，网上也有很多教程如果有需要可以去查找学习，本篇文章不再细说。


---


iCloud是app数据同步的利器，只要了解自己的需求，理清楚同步流程，iCloud开发也会变得很简单。如果文章中有错误欢迎留言指正。


参考链接：


[iCloud File Management](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/iCloud/iCloud.html#//apple_ref/doc/uid/TP40010672-CH12-SW1)


[About Incorporating iCloud into Your App](https://developer.apple.com/library/content/documentation/General/Conceptual/iCloudDesignGuide/Chapters/Introduction.html#//apple_ref/doc/uid/TP40012094-CH1-SW1)


[iCloud Drive - iCloud - Apple Developer](https://developer.apple.com/icloud/icloud-drive/)


[CloudKit](https://developer.apple.com/library/content/documentation/DataManagement/Conceptual/CloudKitQuickStart/Introduction/Introduction.html#//apple_ref/doc/uid/TP40014987-CH1-SW1)


[iOS中理解iCloud数据存储 - CSDN博客](http://blog.csdn.net/pjk1129/article/details/18984575)


[IOS开发之iCloud开发(数据与文档的读写删除) - 胡东东博客](http://www.hudongdong.com/ios/385.html)


[iOS学习笔记32-iCloud入门 - 简书](https://www.jianshu.com/p/bf0e15d1829e)
