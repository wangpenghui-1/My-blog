+++
title = "AI Agent 命令行工具横评：四款主流工具的选型与一页上手教程"
content_id = "02e71b83-c65b-4934-b686-64c5beb1567f"
platforms = ["wechat", "blog"]
date = "2026-08-17T20:12:43+08:00"
draft = false
publishDate = "2026-08-17T20:12:43+08:00"
summary = "对比 Codex CLI、Claude Code、DeepSeek Harness 与 Pi AI Agent 四款 AI 命令行工具的能力边界、定价与适用场景，给出横向对比表、选型建议与每款工具的一页上手教程。"
tags = ["AI 编程", "命令行工具", "Agent 选型", "开发者效率", "上手教程"]
+++

**数据时效：2026-08**
<!-- studio:image:cover -->

2026 年 8 月 13 日，DeepSeek 把自家的 Agent 运行框架开源，项目叫 DeepSeek Harness，命令名 dsh，MIT 协议。这类工具现在通常叫 AI Agent，简单说就是能读代码、改文件、跑命令的终端助手。README 第一屏就写明这是开发者预览，会有兼容性破坏变更。开源后几天内，仓库涨到约十四万 star。加上早已在用的 Codex CLI、Claude Code，和社区维护的 Pi，命令行里现在至少四款能写代码的 AI 工具。

我把四款的官方仓库和定价页逐一对过。选型难的地方不在模型。四款都能接主流大模型，Pi 甚至能在会话中途切换厂商。拉开差距的是模型外面的三件事。代码和提示词去了哪里，账单是封顶订阅还是按量累积，工具默认对文件系统和命令执行有多少权力。厂商宣传恰好绕开这三件。

这三问落到具体账上就清楚了。一个每周跑几十次重构的开发者，订阅封顶通常比 API 按量划算，前提是用量确实低于套餐窗口。一个把客户数据写进提示词的团队，先要确认数据流向了哪里，再谈模型强弱。先答三问，功能列表退到第二位。

判断数据边界有个土办法。去官方文档搜数据保留与处理条款，看企业套餐给了哪些书面承诺。Claude 的企业版写明数据保留与合规接口，Codex 的云端沙箱把任务放进 OpenAI 管理的容器，DeepSeek Harness 和 Pi 把选择权交给用户，数据去哪取决于你填的 key 指向哪家。条款里没有写的东西，就当它不存在。

<!-- studio:image:generated-body-1 -->

![数据边界、计费结构与执行信任三把尺子，决定 AI 命令行工具的选型](/images/posts/ai-agent-cli-tools-comparison-guide/generated-body-1-7af2defcaa1f.jpg)

## 四款工具，各把一件事做到位

Codex CLI 是 OpenAI 的编码代理，Rust 编写，Apache 协议开源。它把执行安全做成卖点。本地沙箱（一个隔离的执行环境）分三档，只读、工作区内写、全权限，默认在沙箱里自动跑命令，离开工作区才来问你。还有云端沙箱，任务在 OpenAI 托管的容器里执行，本地只收改动。登录 ChatGPT 账号后，还能让它在 GitHub 上直接评论审查 PR，团队协作时省去来回贴代码。计费走 ChatGPT 订阅，也可以换成 API key（接口密钥）按量付，gpt-5-codex 的上下文窗口是 400K。适合需要反复执行代码、又不想让命令乱跑的迭代任务。代价是订阅用量按窗口卡，API 路径少了 GitHub 审查这类云功能。

Claude Code 没有独立套餐，随 Claude 订阅走。它最擅长长会话和文档理解，Opus 与 Sonnet 的 1M 上下文窗口（一次能放进约一百万个 token 的文本）在 2026 年 3 月正式放开，读整个中型代码库不用换段。终端、IDE、桌面、网页、手机各端互通，会话可以搬着走。改动前先列计划，/rewind 能退回检查点，CLAUDE.md 放项目约定，headless 模式接 CI。企业如果不想让代码进 Anthropic 的云，还能通过亚马逊 Bedrock、谷歌 Vertex 这类云厂商接入，账单和数据处理都走云厂商那条线。代价也要讲清。1M 上下文吃订阅用量很快，API 模式账单随任务变长涨得快，环境变量里放了 ANTHROPIC_API_KEY 还会绕过订阅直接计费。

<!-- studio:image:screenshot-2 -->

![Claude 官方定价页展示 Pro、Max 与团队档位，Claude Code 随订阅提供](/images/posts/ai-agent-cli-tools-comparison-guide/screenshot-2-screenshot-ef91615a5002.jpg)

DeepSeek Harness 是四款里最新的，开源才几天。它把架构叫一切皆插件，模型、工具、会话记录都能替换，默认跑一个本地 Web UI，地址 127.0.0.1:3080，没有独立桌面应用。它没有订阅制，全部用 API key。官方 DeepSeek 模型按量很便宜，deepseek-v4-flash 输出每百万 token 定价人民币两元，2026 年 8 月 17 日起还分了峰谷时段，低谷时段的钱更少。成本还讲究缓存，命中的输入每百万 token 只要两分钱，比未命中的一块钱低五十倍，工具说明和 skill 清单这类固定前缀能省下大头。面向多步任务，它有一个 PTC 模式，把工具调用打包成可复用的代码，token 消耗能省约二十倍。想更省，还可以把模型指到本地 Ollama 或 vLLM，图片识别这类工具零成本，数据不出本机。代价写在明面上。开发者预览阶段，README 自己警告会有破坏性变更，web_fetch 默认关闭，个别插件有坑，升级后部分配置要重填。

<!-- studio:image:screenshot-1 -->

![DeepSeek Harness 开源仓库首屏，安装命令与开发者预览声明一目了然](/images/posts/ai-agent-cli-tools-comparison-guide/screenshot-1-screenshot-675bb6f10906.jpg)

Pi 是社区维护的工具包，earendil-works 出品，MIT 开源。它把核心做得极简，系统提示词不到一千 token，默认只给读、写、改、跑命令四样工具，其余全部靠扩展。十五家以上的模型厂商可以中途切换。软件本身免费，自带 API key，只付模型钱，第三方估的典型月成本在五到三十美元。到 2026 年 7 月，npm 版本约 0.82.1，周下载量约一百三十万，是同类里迭代最勤的一款。代价是它默认没有任何权限系统，没有沙箱，以你当前的用户权限直接执行。官方给了容器隔离方案，要不要加这层由你决定。安装扩展前最好自己审一遍源码和依赖，社区建议装包时加参数跳过安装脚本。

## 横向对比，一表看清

| 对照项 | Codex CLI | Claude Code | DeepSeek Harness | Pi |
| --- | --- | --- | --- | --- |
| 厂商与授权 | OpenAI，Apache 开源 | Anthropic，闭源 | DeepSeek，MIT 开源 | earendil-works，MIT 开源 |
| 安装 | npm 或官方脚本 | 官方脚本或 Homebrew | npm 全局安装 | npm 或 x 命令 |
| 运行方式 | 终端，可选云端沙箱 | 终端 IDE 桌面 Web | 本地 Web UI 端口 3080 | 终端 TUI |
| 数据边界 | 默认本地沙箱，云沙箱数据到 OpenAI | 代码上传 Anthropic，企业可走云厂商 | 本地框架，数据取决于所接 API | 数据到所选厂商，可接自托管 |
| 计费 | ChatGPT 订阅或 API 按量 | Claude 订阅或 API 按量 | 无订阅，全 API key | 无订阅，全 API key |
| 执行信任 | 三级沙箱加云容器 | 默认只读，改动要确认 | 需自己配 key 与工作区 | 默认无权限系统 |
| 适合场景 | 需要安全执行代码的迭代 | 大型代码库与跨文件任务 | 数据敏感、批量、成本敏感 | 进阶玩家与特定流程 |

四款的计费分成两族。Codex CLI 和 Claude Code 走订阅加 API 双轨，订阅封顶省心，适合用量稳定的个人，API 按量上不封顶，适合偶尔跑大任务的人。DeepSeek Harness 和 Pi 只有 API key 一条路，软件免费，成本随用量线性涨，适合批量跑便宜模型的人。团队做预算，订阅制容易对账；个人摊成本，按量制更透明。

有人会反驳，外壳只是载体，模型进步之后四款差异就被抹平，选型没有意义。这话一半成立。模型确实在快速进步，各家都能接主流模型，纯能力差距在缩小。但外壳管的事不会随模型进步自动对齐。数据流向由你接谁决定，账单结构由订阅还是 API 决定。模型越强，任务越长，账单累积越快，数据出境的顾虑越重。选型要落在这三问上，不落在功能列表上。

另一种反对意见说，工具应该收敛到一家，混用四款徒增切换成本。这话对团队成立。团队要审计、要统一账单，收敛是对的选择。对个人不成立。个人工作流本来就可以按项目换工具，一个仓库用 Codex 跑沙箱，另一个仓库用 Pi 做定制流程，切换成本几乎为零。

## 一页上手，先装再跑

安装版本按 2026 年 8 月验证。四款迭代都很快，DeepSeek Harness 明确会有破坏性变更，装完先跑版本或帮助命令确认，再往下走。官方安装脚本在部分网络环境下会失败，npm 路径更稳；DeepSeek Harness 要求 Node 在 22.19 以上，低于这个版本直接装不上。

四款的首个任务都长一个样。进项目，描述一句话，看它读文件、改代码、跑测试。差别在出问题的时候。Codex 会问要不要放行命令，Claude Code 先列计划再动手，DeepSeek Harness 在浏览器里给一个会话界面，Pi 直接按你的权限执行。上手成本集中在第一次配置，把登录和 key 弄好，后面是同一套流程。

装不上先查三样。网络代理有没有挡住安装脚本，Node 版本够不够，环境变量里有没有旧的 key 把登录路径带偏。四款都支持版本自检，版本号对不上就先升级再继续。

Codex CLI 三条命令就能开始。装好以后运行 codex 登录 ChatGPT 账号，在项目目录描述任务，默认在改动和跑命令前会询问，想让它自己跑就切沙箱档位。CI 里用非交互模式。装完用 codex --version 确认版本。

```bash
npm install -g @openai/codex
codex
codex --version
codex exec "给登录模块补测试并跑通"
```

Claude Code 装好以后，cd 进项目再运行 claude，登录账号后用一句话说清任务，它读整个仓库再动手。管道和 CI 用 -p 参数，回退用 /rewind。装完运行 claude --version 确认。

```bash
curl -fsSL https://claude.ai/install.sh | bash
cd 你的项目
claude --version
claude
tail -200 app.log | claude -p "看看有没有异常"
```

DeepSeek Harness 先确认 Node 版本，再全局安装。运行 dsh web 后浏览器打开 127.0.0.1:3080，首次运行生成 ~/.dsh 目录，在设置里填 DeepSeek API key，添加一个工作区，会话框就能用。批量任务走 headless。

```bash
node --version
npm install -g @deepseek-ai/dsh
dsh web
dsh --profile headless "重构这个模块并跑测试"
```

Pi 装的是编码 agent 包。默认读环境变量里的 API key，想中途换厂商加 --provider，继续上次会话用 -c，脚本解析用 --mode json。没有内置沙箱，重要项目先在容器里跑。装完用 pi --version 确认。

```bash
npm install -g @earendil-works/pi-coding-agent
pi --version
pi "给这个函数写单元测试"
pi -c
pi --provider anthropic --model sonnet "换模型继续"
```

## 结尾，按工作流对号入座

代码和数据不能出内网，或者要长期批量跑任务，先看 DeepSeek Harness，本地框架加便宜模型，必要时把模型指到本地端点。需要安全执行代码、要 GitHub 审查、手上已有 ChatGPT 订阅，用 Codex CLI，沙箱是它的主场。大型代码库、跨多文件重构、要读整个项目再动手，Claude Code 的 1M 上下文最省心。想完全掌控工具本身、手里已有多个 API key、愿意自己补隔离，Pi 合适。团队要审计、单点登录和合规，优先看带团队管理的闭源款，这类需求开源工具目前接不住。

还有两条路要绕开。冲着某款工具的名气先买一年的订阅，回头算账才发现用量和套餐对不上，先按三问估一遍用量再掏钱。让工具在你没看过的权限下跑生产仓库，先补隔离，尤其 Pi 和 DeepSeek Harness 这两款默认没有现成的权限墙。

再提醒一次数据时效。四款的价格和功能都在快速迭代，本文写于 2026 年 8 月，购买或部署前以官方最新页面为准。

## 主要来源

- [OpenAI Codex CLI 仓库](https://github.com/openai/codex)
- [Claude Code 官方文档](https://code.claude.com/docs/en/overview)
- [Claude 官方定价页](https://claude.com/pricing)
- [DeepSeek Harness 仓库](https://github.com/deepseek-ai/deepseek-harness)
- [Pi 仓库（earendil-works）](https://github.com/earendil-works/pi)
