---
title: APP启动时间优化
slug: app-launch-time-optimization
description: ''
tags:
  - iOS
pubDate: 2018-08-17
category: 技术
---

## 一、 APP启动过程


iOS应用的启动可分为pre-main阶段和main()阶段，其中系统做的事情依次是：


### 1.1 pre-main阶段

1. 加载应用的可执行文件
2. 加载动态链接库加载器dyld（dynamic loader）
3. dyld递归加载应用所有依赖的dylib（dynamic library 动态链接库）

对于main函数之前的一系列启动流程，[优化 App 的启动时间 | yulingtianxia’s blog](http://yulingtianxia.com/blog/2016/10/30/Optimizing-App-Startup-Time/)这篇文章做了深入的探究。


### 1.2 main()阶段

1. dyld调用main()
2. 调用UIApplicationMain()
3. 调用applicationWillFinishLaunching
4. 调用didFinishLaunchingWithOptions
5. rootViewController及其childViewController的加载、view及其subviews的加载

---


## 二、启动时间测量和目标


在进行优化之前，我们首先需要测量出各阶段的耗时，做到心中有数。


### 2.1 pre-main阶段时间测量


对于pre-main阶段，Apple提供了一种测量方法，在 Xcode 中 Edit scheme -> Run -> Auguments 将环境变量DYLD_PRINT_STATISTICS 设为YES ：


![4378C0C3-9F8C-42D5-82DA-CB1173E033F7.png](https://image.xcanoe.top/blog/5bff6a146541dc74bec921b2d31a83a3.png)


然后运行程序，测试结果如下:


```plain text
//pre-main 启动时间
Total pre-main time: 415.20 milliseconds (100.0%)
         dylib loading time:  48.42 milliseconds (11.6%)
        rebase/binding time:  49.79 milliseconds (11.9%)
            ObjC setup time:  51.63 milliseconds (12.4%)
           initializer time: 265.25 milliseconds (63.8%)
           slowest intializers :
             libSystem.B.dylib :   9.23 milliseconds (2.2%)
   libBacktraceRecording.dylib :   9.37 milliseconds (2.2%)
    libMainThreadChecker.dylib :  14.38 milliseconds (3.4%)
          libglInterpose.dylib : 122.43 milliseconds (29.4%)
         libMTLInterpose.dylib :  31.22 milliseconds (7.5%)
                       ModelIO :  20.16 milliseconds (4.8%)
                          LEVE :  74.95 milliseconds (18.0%)
```


### 2.2 main()阶段时间测量


对于main()阶段，主要是测量main()函数开始执行到didFinishLaunchingWithOptions执行结束的耗时，就需要自己插入代码到工程中了。先在main()函数里用变量StartTime记录当前时间：


```plain text
CFAbsoluteTime StartTime;
int main(int argc, char * argv[]) {
      StartTime = CFAbsoluteTimeGetCurrent();
```


再在AppDelegate.m文件中用extern声明全局变量StartTime，在didFinishLaunchingWithOptions里，再获取一下当前时间，与StartTime的差值即是main()阶段运行耗时。


```plain text
extern CFAbsoluteTime StartTime;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

//一些配置和加载......

double launchTime = (CFAbsoluteTimeGetCurrent() - StartTime);
NSLog(@"didFinishLaunchingWithOptions执行完 ---------> %f",launchTime);
return YES;
}
```


然后在首页的ViewDidAppear里面打印一下时间，这代表着程序首页完全加载完成，用户进入操作界面。


```plain text
-(void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    double finishTime = (CFAbsoluteTimeGetCurrent() - StartTime);
    NSLog(@"ViewdidAppear ---------> %f", finishTime);
}
```


如果有启动广告页和启动动画，还需要在启动广告页或者动画结束的时候打印出时间，获取最终进入app的时间。因为广告和动画是在首页加载完成之后才开始执行的。


打印出的时间结果：


```plain text
didFinishLaunchingWithOptions执行完 ---------> 1.145531
ViewdidAppear ---------> 3.642620
启动动画结束 ---------> 5.560365
```


通过测试发现启动时间大约有6秒，优化启动速度已经到了刻不容缓的时候了😂。


### 2.3 目标时间


启动时间测量出来之后，我们就需要给自己定一个优化的目标，对于pre-main阶段，苹果官方的建议时间是400ms以内，因为app启动的放大动画是400ms的时间，而main函数之后到viewDidAppear的时间当然是越短越好，具体也可以根据设计的启动动画的时间以及必须要加载的相关文件做出权衡。app启动整体过程耗时不能超过20秒，否则系统会kill掉进程，App启动失败。我们app设定的启动时间时2s，也就是说在需要在2秒内尽量将内容完整的首页显示给用户。


---


## 三、启动时间优化方案


### 3.1 pre-main阶段的优化


如何尽可能的减少pre-main花费的时间呢？主要从输出日志给出的四个阶段下手:

- 对动态库加载的时间优化。每个App都进行动态库加载，其中系统级别的动态库占据了绝大数，而针对系统级别的动态库都是经过系统高度优化的,不用担心时间的花费。我们应该关注于自己集成到App的那些动态库，这也是最能消耗加载时间的地方。苹果的建议是减少在App里动态库的集成或者有可能地将其多个动态库最终集成一个动态库后进行导入，尽量保证将App现有的非系统级的动态库个数保证在6个以内。
- 减少App的Objective-C类，分类和的唯一Selector的个数。这样做主要是为了加快程序的整个动态链接, 在进行动态库的重定位和绑定(Rebase/binding)过程中减少指针修正的使用，加快程序机器码的生成。关于清理项目中没用到的类，可以使用工具AppCode代码检查功能。删减一些无用的静态变量，删减没有被调用到或者已经废弃的方法。[ios - How to find unused code in Xcode 7? - Stack Overflow](https://stackoverflow.com/questions/35233564/how-to-find-unused-code-in-xcode-7)
- 使用initialize方法进行必要的初始化工作。用+initialize方法替换调用原先在OC的+load方法中执行初始代码工作，从而加快所有类文件的加载速度。

### 3.2 main()阶段的优化


main函数阶段的优化才是我们接触的最多的并且是最明显的，因为由于业务需要，我们会初始化各个二方/三方库，设置系统UI风格，检查是否需要显示引导页、是否需要登录、是否有新版本等，由于历史原因，这里的代码容易变得比较庞大，启动耗时难以控制。所以对main函数做优化最简单，也最有成效。


在这里，我们也需要将优化细分为didFinishLaunchingWithOptions方法内的启动时间和didFinishLaunchingWithOptions方法结束到所有内容加载出来这一段网络加载以及UI渲染的时间。


### didFinishLaunchingWithOptions方法内时间优化


didFinishLaunchingWithOptions 方法里我们一般都有以下的逻辑：

- 初始化第三方 SDK
- 配置 APP 运行需要的环境
- 自己的一些工具类的初始化
- app页面结构的设置
- …

我统计了现有项目中现有的一些任务：

- 配置分享工具
- 配置统计收集工具
- IM的注册和配置
- 推送注册
- 配置app首页
- IQKeyboardManager等三方库加载
- SDImageCache缓存控制
- 地图注册
- 引导页加载
- 版本更新检测
- 启动动画加载

对于这些比较繁多的设置，我们首先就是要给这些任务设定优先级，根据任务的重要程度，我划分了三个等级，**第一级**的是最重要也必须要初始加载的一些任务，这一类放在didFinishLaunchingWithOptions里面一开始就进行启动，**第二级**是一些在用户进入 APP 首页面之前是要加载完的功能，也就是用户已经看到广告页面或者启动动画时，同时进行启动的。**第三级**不是必须的，所以我们可以放在动画显示完成之后，这里完全不会影响到启动时间。


**第一级：**

- 配置统计
- IM的注册和配置
- 配置app首页
- 启动动画加载

统计是从一开始进入就需要配置好的，配置app的首页信息的时候需要根据用户是否登陆以及是否注册的状态来显示不同的页面，所以也需要将IM配置放在第一位。


**第二级**

- 推送注册
- 版本更新检测
- 引导页加载

引导页在用户第一次进入app的时候需要展示出来，需要在动画显示的时候做好准备，版本更新检测也需要提早准备好，等用户进入内容页面时提示出来。


**第三级**

- IQKeyboardManager等三方库加载
- SDImageCache缓存控制
- 地图配置
- 分享配置

分享和地图这些可以等到动画完成之后再执行，不会影响到启动时间。


### View加载阶段优化


不同的界面结构，代码的执行顺序也会有一些区别，先来看tabbarController执行顺序，如下常用结构代码


```plain text
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    [self.window makeKeyAndVisible];
    self.window.rootViewController = [[UIViewController alloc] init];

    MyTabBarViewController *tabbarVC = [[MyTabBarViewController alloc] init];

    ViewController *vc = [[ViewController alloc] init];
    vc.title = @"1";
    [tabbarVC addChildViewController:vc];

    ViewController2 *vc2 = [[ViewController2 alloc] init];
    vc2.title = @"2";
    [tabbarVC addChildViewController:vc2];

    ViewController3 *vc3 = [[ViewController3 alloc] init];
    vc3.title = @"3";
    [tabbarVC addChildViewController:vc3];

    self.window.rootViewController = tabbarVC;

    NSLog(@"didFinishLaunchingWithOptions --------->  加载完成");
    return YES;
}
```


在每个viewController的ViewdidLoad中打印输出，并且在tabbarController中打印输出，运行得到如下结果：


```plain text
MyTabBarViewController --------->  加载完成
ViewController --------->  加载完成
didFinishLaunchingWithOptions --------->  加载完成
```


如果顺序点击ViewController2和ViewController3，则会打印


```plain text
ViewController2 --------->  加载完成
ViewController3 --------->  加载完成
```


如果此时我们在`NSLog(@"didFinishLaunchingWithOptions --------->  加载完成");`这句代码之前加上一句`vc2.view.backgroundColor = [UIColor yellowColor];`那么加载顺序就会变成


```plain text
MyTabBarViewController --------->  加载完成
ViewController --------->  加载完成
ViewController2 --------->  加载完成
didFinishLaunchingWithOptions --------->  加载完成
```


再来看看navigationController为rootViewController时的执行顺序，如下代码


```plain text
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    [self.window makeKeyAndVisible];
    self.window.rootViewController = [[UIViewController alloc] init];

    ViewController *vc = [[ViewController alloc] init];
    vc.title = @"1";

    MyNavigationController *tabbarVC = [[MyNavigationController alloc] initWithRootViewController:vc];

	self.window.rootViewController = tabbarVC;
    NSLog(@"didFinishLaunchingWithOptions --------->  加载完成");
    return YES;
}
```


在viewController的ViewdidLoad中打印输出，并且在MyNavigationController中打印输出，运行得到如下结果：


```plain text
MyNavigationController --------->  加载完成
didFinishLaunchingWithOptions --------->  加载完成
ViewController --------->  加载完成
```


可以看到在使用NavigationController做为rootViewController的时候，加载方式和使用TabbarViewController有些不一样，子ViewController的ViewDidLoad会在didFinishLaunchingWithOptions方法执行完成之后再调用。


然后我们在`NSLog(@"didFinishLaunchingWithOptions --------->  加载完成");`这句代码之前加上一句`vc.view.backgroundColor = [UIColor yellowColor];`那么加载顺序就会变成


```plain text
MyNavigationController --------->  加载完成
ViewController --------->  加载完成
didFinishLaunchingWithOptions --------->  加载完成
```


由此可见，我们尽量不要在程序启动的时候操作ViewController内的View，避免提早加载。


在优化过程中，为了更好的了解代码执行过程，我在多处打印输出，最终得到在进入didFinishLaunchingWithOptions方法之后的执行顺序：

1. 进入didFinishLaunchingWithOptions。
2. 设置NavigationController为rootViewController，执行NavigationController的viewDidLoad。
3. 执行NavigationController添加动画的代码，但是动画不会立即执行，所有的UI渲染会在didFinishLaunchingWithOptions执行完成之后再进行,而且不管是广告页的定时器还是启动动画，都会等到第六步首页ViewDidAppear加载完成之后才执行。
4. 结束didFinishLaunchingWithOptions方法。
5. 执行NavigationController的子ViewController的viewDidLoad。
6. 子viewController执行到ViewDidAppear完成界面的加载。
7. 开始执行动画效果，回调animationDidStart。
8. 动画执行完成，回调animationDidStop。
9. 启动完成。

根据项目具体情况，我做了如下优化。

- 首页控制器用纯代码方式来构建。
- 由于业务需求的不断变更，首页嵌套了很多个子的ViewController，一加载全部加载，于是将一些没有显示的ViewController改成懒加载，需要的时候才去加载，一下子速度提高了很多。
- 减少在首页控制器的viewDidLoad和viewWillAppear的任务量，这2个方法执行完，首页控制器才能显示，部分可以延迟创建的视图做了延迟创建/懒加载处理。
- 首页相机异步启动，可以提升1秒左右的速度。
- 将启动动画LaunchView从window上改成放在在NavigationController上，可以减少0.5s左右。
- 把第二级启动事件在启动动画animationDidStart后执行。
- 把第三级启动事件移到启动动画animationDidStop之后执行。

对于一些特别复杂，操作特别多的界面，我给的建议是参照淘宝和facebook，给用户展示一个空壳View，让用户第一时间进入app，然后再进行数据处理和视图加载，虽然实际加载的时间没变，但是至少体验上做到了很大程度的优化，这给人带来的感受才是最明显的。


## 持续控制启动时间


在进行了一轮优化之后，启动速度得到了明显的提升，成就感也油然而生，但是随着项目的迭代，功能的增长，肯定还会有新的配置和启动事件需要加入进来，这时候我们就需要为之后的持续优化做一些准备，不要优化过后就不管了，等到一段时间过后再从头开始优化一次，耗时耗力。为此，第一，我们可以制定一些项目规范，例如不轻易引入新的SDK，不随意添加新的类和分类，在添加+load方法的时候需要确保一定需要这样做等。第二，可以专门建立一个类来负责didFinishLaunchingWithOptions中的启动事件，根据优先级将任务加入到不同的方法中，在合适的时机调用。第三，提升自己的编程素养，写代码之前多考虑一些性能方面的问题，在需要懒加载的地方使用懒加载，写出结构清晰，方便定制的界面。


---


**优化之后打印出的时间结果：**


```plain text
didFinishLaunchingWithOptions执行完 ---------> 0.329191
ViewdidAppear ---------> 0.691656
启动动画结束 ---------> 2.464439
```


参考资料：


[今日头条iOS客户端启动速度优化](https://techblog.toutiao.com/2017/01/17/iosspeed/)


[iOS一次立竿见影的启动时间优化 - CocoaChina_让移动开发更简单](http://www.cocoachina.com/ios/20170816/20267.html)


[优化 App 的启动时间 | yulingtianxia’s blog](http://yulingtianxia.com/blog/2016/10/30/Optimizing-App-Startup-Time/)


[阿里数据iOS端启动速度优化的一些经验 - 简书](https://www.jianshu.com/p/f29b59f4c2b9)


[Facebook iOS App如何优化启动时间 - CocoaChina_让移动开发更简单](http://www.cocoachina.com/ios/20160104/14870.html)
