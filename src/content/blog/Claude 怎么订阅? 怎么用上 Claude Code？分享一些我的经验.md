---
title: Claude 怎么订阅? 怎么用上 Claude Code？分享一些我的经验
slug: claude-subscribe-and-code-experience
description: '真实踩坑经验分享'
tags:
  - AI
  - 工具
pubDate: 2025-07-11
category: 经验
---

前两天发的 Claude Code 使用的文章，有很多朋友反馈 Claude 购买不了，想知道应该怎么使用上 Claude Code。

说实话，我刚开始也被这些问题折腾得够呛。不过既然都踩过坑了，就把经验整理出来，希望能让你少走些弯路。

## 怎么注册 Claude？

很多人可能到现在还没用过 Claude，确实因为不对国内开放，注册确实有点门槛。但别被吓住，其实还好，一个一个的解决，花不了多少时间。

你需要准备：

- Gmail 邮箱（必须）
- 稳定的科学上网工具（必须）
- 海外手机号（如果需要验证的话）

我注册比较早，记不清当时要不要手机验证了。如果需要手机号和验证码，可以使用 Sms-activate 这个验证码接收平台。官网地址：https://sms-activate.io/?ref=2863465

1. 进入这个网站，将语言改为中文，注册一个账号，然后支付宝充值 1 美元（足够用了）。

2. 选择左侧的激活功能，搜索 Claude，然后选择 Claude 服务，选个国家买个号码

3. 填入 Claude 注册页面，等验证码

4. 没收到也别慌，可以退款重试

   ![](https://image.xcanoe.top/blog/1752241632.png)

## 怎么订阅 Claude？购买不了会员怎么办？

这个问题困扰了我很久，同样因为 Claude 不支持国内的银行卡和信用卡支付，我也没有国外的银行卡。后来发现一个技巧，可以通过 Apple 订阅的方式购买。
具体操作：

1. 注册一个美区 Apple ID （网上教程很多）
2. 然后在 App Store 切换成美区 ID，进入支付宝，切换地区到旧金山
3. 在首页你能看到大牌礼品卡限时优惠，进入选择 Apple，然后充值 20 美元，就能获得一个兑换码。
4. 在 App Store 里面兑换充值卡或代码，输入兑换。
5. 然后下载好 Claude，直接通过 Apple  支付订阅。

这种方式相对稳定，而且是通过苹果官方渠道，比较安全。

![](https://image.xcanoe.top/blog/1752241780.png)

## 封号问题

这个问题我还没有遇到过，所以给不了太多参考，只能将我了解的方式贴在下面：

- 联系官方支持团队：通过发送邮件至“support[@]anthropic.com”，详细说明账号被封禁的具体情况。在邮件中，应包括账号的注册信息、使用场景和封禁发生的时间，并表明你的使用行为符合平台规定，同时真诚表达希望解封账号的意愿。
- 提交详细的申诉信息：提供注册时使用的海外手机号、支付信息（如订阅Claude Pro时的记录）以及登录时的网络环境。清晰且详细的信息将有助于提高申诉成功的可能性。
- 耐心等待回复：发送申诉邮件后，Claude的官方支持团队通常需要数天时间进行审核。在此期间，请保持耐心，避免重复发送申诉邮件，以免被系统视为垃圾信息处理。

不过最好的办法还是一开始就规范使用，避免触发风控。

## 如果没有账号想直接使用 Claude Code，也有办法

也正是因为想要用上不容易，所以有平台提供了 Claude Code 的中转服务，帮你去调用 Claude Code 的接口。

最近了解到的一个平台是 AnyRouter，可以直接在他们平台注册账号，可以通过他们使用上 Claude Code，使用方式也很简单。

1. 注册账号 https://anyrouter.top/register?aff=k3Ka。（通过链接注册，我们都可获得额外 $50 Claude Code 额度奖励，初次注册账户就有 100 刀余额）

2. 添加 API 令牌。设置额度（不超过你的余额），选择 claude 4 的两个模型，保存，复制生成的令牌。

   ![](https://image.xcanoe.top/blog/1752241666.png)

3. 安装好 Claude Code，在项目目录运行下面的命令。（设置密钥和代理平台）

```
export ANTHROPIC_AUTH_TOKEN=你复制的token
export ANTHROPIC_BASE_URL=https://anyrouter.top
claude
```

4. 如果不想要每次运行都运行这个命令，可以将环境变量写入 bash_profile 和 bashrc：

```
echo -e '\n export ANTHROPIC_AUTH_TOKEN=你复制的token' >> ~/.bash_profile
echo -e '\n export ANTHROPIC_BASE_URL=https://anyrouter.top' >> ~/.bash_profile
echo -e '\n export ANTHROPIC_AUTH_TOKEN=你复制的token' >> ~/.bashrc
echo -e '\n export ANTHROPIC_BASE_URL=https://anyrouter.top' >> ~/.bashrc
echo -e '\n export ANTHROPIC_AUTH_TOKEN=你复制的token' >> ~/.zshrc
echo -e '\n export ANTHROPIC_BASE_URL=https://anyrouter.top' >> ~/.zshrc
```

重启终端后，就可以直接使用 Claude 命令来使用了，不需要每次设置环境变量。

## 写在最后

虽然中转服务很方便，但我还是建议：能用官方就用官方。

关乎你的数据安全，小心点总没错。特别是涉及代码和敏感信息的时候，多一层中转就多一分风险。

当然，如果只是想体验一下 Claude Code 的能力，中转服务也是不错的选择。用哪种方式，还是看你自己的需求和风险承受度。

希望这些经验能帮你顺利用上 Claude Code。如果你有其他更好的方法，也欢迎一起讨论。