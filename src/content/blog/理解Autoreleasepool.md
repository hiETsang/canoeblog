---
title: 理解Autoreleasepool
slug: autoreleasepool
description: ''
tags:
  - iOS
pubDate: 2017-01-21
category: 技术
---

## autoreleasepool分析


main函数是整个程序的入口，从我们一进入main 函数就会接触到autoreleasepool。


```plain text
int main(int argc, char * argv[]) {
    @autoreleasepool {
        return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
    }
}
```


**整个iOS应用都是包含在一个自动释放池block中。**


使用`clang -rewrite-objc`对main.m编译之后我们会发现autoreleasepool@{}被转换成为一个__AtAutoreleasePool结构体


```plain text
struct __AtAutoreleasePool {
  __AtAutoreleasePool() {atautoreleasepoolobj = objc_autoreleasePoolPush();}
  ~__AtAutoreleasePool() {objc_autoreleasePoolPop(atautoreleasepoolobj);}
  void * atautoreleasepoolobj;
};
```


实际上，我们的main函数在工作时是这样的


```plain text
int main(int argc, const char * argv[]) {
    {
        void * atautoreleasepoolobj = objc_autoreleasePoolPush();

        return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));

        objc_autoreleasePoolPop(atautoreleasepoolobj);
    }
    return 0;
}
```


**autoreleasepool的实际是调用objc_autoreleasePoolPush和objc_autoreleasePoolPop方法**


## AutoreleasePoolPage分析


objc_autoreleasePoolPush和objc_autoreleasePoolPop的实现：


```plain text
void *objc_autoreleasePoolPush(void) {
    return AutoreleasePoolPage::push();
}

void objc_autoreleasePoolPop(void *ctxt) {
    AutoreleasePoolPage::pop(ctxt);
}
```


通过方法内部我们能看到，push和pop方法是对AutoreleasePoolPage两个方法的封装。


`AutoreleasePoolPage`是C++的一个类，定义如下：


```plain text
class AutoreleasePoolPage {
    magic_t const magic;		//对当前AutoreleasePoolPage完整性的校验
    id *next;	  //指向栈顶最新add进来的autorelease对象的下一个位置
    pthread_t const thread;	//当前类所在的线程
    AutoreleasePoolPage * const parent; //指向上一个AutoreleasePoolPage
    AutoreleasePoolPage *child; //指向下一个AutoreleasePoolPage
    uint32_t const depth;  //深度
    uint32_t hiwat;
};
```


每一个自动释放池都是由一系列`AutoreleasePoolPage`组成的，每一个`AutoreleasePoolPage`大小都是4096字节。


自动释放池中的`AutoreleasePoolPage` 是以双向链表的形式连接起来的：


![F4E2C50C-3901-4577-B15E-5D0E476E0968.png](https://image.xcanoe.top/blog/07e54423ca2e01b5b20ed6606d989073.png)


一个`AutoreleasePoolPage`的空间被占满的时候，会新建一个`AutoreleasePoolPage`对象，连接链表。


如果一个`AutoreleasePoolPage`初始化在内存的`0x100816000 ~ 0x100817000`中，那么他的结构就像这样：


![7380B3C4-10B5-4DB1-BD31-8DC57CCB0869.png](https://image.xcanoe.top/blog/2c7ded4ebfa635b81f57ee49c3eed985.png)


`0x100816038 ~ 0x100817000`用来储存加入到自动释放池中的对象。


## POOL_SENTINEL（哨兵对象）


上图中能够看到有一个哨兵对象，他本质就是nil。


`#define POOL_SENTINEL nil`


每当进行一次`objc_autoreleasePoolPush` 的时候，runtime会向当前的`AutoreleasePoolPage`中添加一个哨兵对象，值为nil，然后将这个哨兵对象的地址返回，被`objc_autoreleasePoolPop(哨兵对象)`当作入参。


```plain text
int main(int argc, const char * argv[]) {
    {
        void * atautoreleasepoolobj = objc_autoreleasePoolPush();
        //do some thing
        objc_autoreleasePoolPop(atautoreleasepoolobj);
    }
    return 0;
}
```


`atautoreleasepoolobj`就是哨兵对象。


当方法`objc_autoreleasePoolPop`调用的时候，就会向自动释放池中的所有晚于autorelease对象发送一次release消息，从最新加入的对象一直向前清理，可以跨越多个page，一直到哨兵所在的page。并向回移动`next`指针到正确的位置。


## objc_autoreleasePoolPush分析


objc_autoreleasePoolPush()


```plain text
void *objc_autoreleasePoolPush(void) {
    return AutoreleasePoolPage::push();
}
```


AutoreleasePoolPage 的类方法push


```plain text
static inline void *push() {
   return autoreleaseFast(POOL_SENTINEL);
}
```


这里会进入到一个方法`autoreleaseFast`，并且传入哨兵对象。


```plain text
static inline id *autoreleaseFast(id obj)
{
   AutoreleasePoolPage *page = hotPage();
   if (page && !page->full()) {
       return page->add(obj);
   } else if (page) {
       return autoreleaseFullPage(obj, page);
   } else {
       return autoreleaseNoPage(obj);
   }
}
```


上面可以看到有一个hotpage，hotpage可以理解为当前正在使用的`AutoreleasePoolPage`，有三种执行情况：

- 有hotpage并且hotpage不满的时候，调用`page->add(obj)`将对象加入`AutoreleasePoolPage`栈中。
- 有hotpage并且hotpage已满的时候，调用`autoreleaseFullPage`，初始化新页，然后调用`page->add(obj)`将对象加入`AutoreleasePoolPage`栈中。
- 无hotpage的时候，调用`autoreleaseNoPage`创建一个hotPage，然后调用`page->add(obj)`将对象加入`AutoreleasePoolPage`栈中。

## objc_autoreleasePoolPop分析


objc_autoreleasePoolPop


```plain text
void objc_autoreleasePoolPop(void *ctxt) {
    AutoreleasePoolPage::pop(ctxt);
}
```


AutoreleasePoolPage的类方法pop(ctxt);


```plain text
static inline void pop(void *token) {
    AutoreleasePoolPage *page = pageForPointer(token);
    id *stop = (id *)token;

    page->releaseUntil(stop);

    if (page->child) {
        if (page->lessThanHalfFull()) {
            page->child->kill();
        } else if (page->child->child) {
            page->child->child->kill();
        }
    }
}
```


这个方法主要做了三件事：

1. 使用`pageForPointer`获取当前token所在的`AutoreleasePoolPage`，就是哨兵对象所在的`AutoreleasePoolPage`。
2. 调用`releaseUntil`方法释放栈中的对象，一直到stop指针。
3. 调用`child`的`kill`方法。

## 小结

- 自动释放池实际上是调用了`AutoreleasePoolPage`的push和pop方法向里面加入和释放对象。
- `AutoreleasePoolPage`是以双向链表实现的。
- 其中需要注意的是哨兵对象的含义以及push和pop方法的具体实现。

---


**参考：**


[Using Autorelease Pool Blocks](https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/MemoryMgmt/Articles/mmAutoreleasePools.html)


[NSAutoreleasePool - Foundation | Apple Developer Documentation](https://developer.apple.com/documentation/foundation/nsautoreleasepool#//apple_ref/occ/cl/NSAutoreleasePool)


[黑幕背后的Autorelease · sunnyxx的技术博客](http://blog.sunnyxx.com/2014/10/15/behind-autorelease/)
