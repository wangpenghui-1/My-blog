+++
title = "2026 年 7 月最新版 Codex 实用指南：把它变成会干活的个人助手"
date = "2026-07-25T17:06:36+08:00"
draft = false
publishDate = "2026-07-25T17:06:36+08:00"
summary = "从 ChatGPT 桌面应用中的 Codex 出发，用一个真实任务讲清本地项目、计划模式、浏览器、插件、Computer Use、Worktree 和定时任务怎么用，以及哪些权限不该随便开放。"
tags = ["AI智能体", "Codex", "效率工具", "办公自动化", "个人助手"]
+++

**数据时效：2026-07**
**数据时效：2026-07-25**

![Pasted image 20260725164514](/images/posts/ai-agent-personal-assistant-guide/Pasted image 20260725164514.png)

*▲ Codex 的实用之处，是把资料、操作过程和交付文件放进同一个可检查的工作区。*
## Codex 到底比普通聊天多了什么

假设你把一份会议录音整理稿交给普通聊天机器人，它通常会返回一段摘要。接下来的事仍要你自己做：核对原文、建立任务表、保存文件、查找相关资料、做成汇报。

Codex 可以在你允许的范围内继续往下做：

1. 读取项目文件夹里的会议记录和模板；
2. 先列计划，指出缺少的信息；
3. 生成项目简报、任务表和待确认事项；
4. 使用浏览器核对公开信息；
5. 把结果写进指定文件；
6. 运行检查，再把改动交给你审核。

本文所说的“个人助手”，就是让 Codex 接手这样一段工作：有输入、有步骤、有文件、有验收。它依然会看错资料、误解要求，也可能使用过期信息。最后的判断和对外动作仍由人负责。

![ai-agent-guide-workflow](/images/posts/ai-agent-personal-assistant-guide/ai-agent-guide-workflow.png)

*▲ 一项任务最好留下四样东西：计划、来源、交付文件和待确认事项。*

## 第一次使用，照着这五步走

### 第一步：在 ChatGPT 桌面应用里选择 Codex

打开 ChatGPT 桌面应用，在新对话的模式选择器里选 **Codex**。如果你只使用 Codex CLI 或 IDE 扩展，也能读写项目、运行命令，但桌面应用里的内置浏览器、Computer Use、插件目录和 Worktree 工作流更适合本文的用法。

### 第二步：给任务建一个单独文件夹

先不要把整个“文档”目录交给它。新建一个小文件夹，例如：

```text
季度复盘/
  01-原始资料/
  02-参考模板/
  03-输出/
  brief.md
```

把任务需要的资料放进去，再把这个文件夹作为项目打开。这样做看似多一步，实际省去了两类麻烦：Codex 不必在大量无关文件里猜，出错时也不容易改到别的项目。

`brief.md` 不需要写成长篇说明。四项就够：

```text
目标：把三份周会记录整理成季度复盘初稿。

资料：只使用 01-原始资料/ 和 02-参考模板/。

交付：
1. 03-输出/季度复盘.md
2. 03-输出/行动项.csv
3. 03-输出/待确认.md

边界：不删除原文件，不发送邮件，不登录外部系统。
完成标准：每个结论能追溯到原始记录；负责人和日期不确定时写“待确认”。
```

### 第三步：复杂任务先开 Plan mode

Plan mode 可以先读资料、提出问题、生成计划，再进入实际修改。可以输入快捷命令 `/plan`选择，或直接点击下图所示的加号选择计划模式。
![截屏2026-07-25 16.08.16](/images/posts/ai-agent-personal-assistant-guide/截屏2026-07-25 16.08.16.png)
第一次可以直接发这句话：

```text
阅读 brief.md 和两个资料目录。先不要修改文件。
请列出执行计划、准备创建的文件、目前缺少的信息和需要我确认的权限。
```

计划让你在 Codex 动手前发现误解。比如，它准备把“讨论过的人”当成负责人，或者打算访问你没授权的网站，你可以立刻纠正。

### 第四步：把权限放在输入框附近检查

桌面应用会在输入框附近显示权限选项。官方文档目前列出的常见选项包括 **Ask for approval**、**Approve for me**、**Full acces!**，具体文字会随设置变化。
![截屏2026-07-25 16.15.00](/images/posts/ai-agent-personal-assistant-guide/截屏2026-07-25 16.15.00.png)
普通用户可以这样选：

- **第一次做任务：** 用默认权限或 Ask for approval。
- **只分析、不改文件：** 切到只读权限。
- **反复处理同一个可信项目：** 再考虑让系统自动批准符合规则的低风险动作。
- **Full access：** 不作为日常默认。它会明显扩大可操作范围。

权限控制分两层。**Sandbox（沙箱）**规定 Codex 技术上能碰哪些文件、能不能联网；**Approval（批准规则）**规定它在什么动作前必须停下来问你。一个控制“能不能”，一个控制“何时问”。

### 第五步：验收文件，不只看最后一句回复

任务完成后，先看这四项：

1. `待确认.md` 里有没有把缺证据的地方明确留下；
2. 行动项中的负责人、日期能否在原记录里找到；
3. 输出目录之外有没有出现意外改动；
4. Codex 是否运行了约定的检查，并报告真实结果。

如果项目受 Git 管理，可以直接查看 Diff（文件差异）面板。Diff 会逐行显示哪些内容被增加、删除或修改。普通文档项目没有 Git，也要让 Codex 生成 `change-log.md`，说明它改了什么。

## 最新版里，哪些功能真的适合普通人

Codex 现在的能力很多。个人用户不必一次全开。下面按“你要完成什么”来选。

| 你要做的事 | 优先使用 | 它解决什么问题 | 需要留意 |
| --- | --- | --- | --- |
| 整理本地资料、批量改文件 | 本地项目 + Codex | 读取、生成、重命名和检查文件 | 先限定项目目录，保留原件 |
| 任务很模糊 | Plan mode | 先问清需求，再动手 | 计划合理也不等于事实正确 |
| 查公开资料、预览本地网页 | 内置 Browser | 搜索网页、点击、截图、检查页面 | 浏览器使用独立资料，不自动继承你的 Chrome 登录 |
| 使用已经登录的网页 | Chrome 插件 | 在现有标签页和 Chrome 资料中工作 | 它可能接触真实账号，操作范围要更小 |
| 操作只能靠鼠标点击的软件 | Computer Use | 看见并操作获准的桌面应用 | 只开放必要应用，敏感窗口先关闭 |
| 读取网盘、邮箱、Slack、GitHub | Plugins / Connectors | 从已连接服务读取信息或执行操作 | 安装插件不等于授权全部数据；写入和发送要单独确认 |
| 同一项目并行做两件事 | Worktree | 创建隔离的 Git 工作副本 | 只适用于 Git 项目，不是普通文件夹的万能分身 |
| 定期生成内部草稿 | Scheduled tasks | 按时间在后台运行固定任务 | 本地任务要求电脑开机、桌面应用运行，且资料在磁盘上可用 |
| 重复同一套步骤 | Skill 或 `AGENTS.md` | 保存固定规则、模板和检查方法 | 先手工跑通，再固化 |

### Browser、Chrome 和 Computer Use，不要混着理解

官方现在把三种入口分得很清楚。

**内置 Browser** 使用独立的浏览器资料。它适合查公开网页、对比产品、测试你刚做出的本地页面。它不会自动继承日常 Chrome 的标签页和登录状态。

**Chrome 插件** 用于现有 Chrome 标签页和常用浏览器资料。比如你已经登录后台，需要 Codex 读取当前页面。便利性更高，账号风险也更高。

**Computer Use** 用于桌面图形软件，例如需要鼠标点击的表单工具或设计软件。它能查看屏幕、截图、点击和输入，但只能操作你允许的应用。官方还明确说明：它不能自动操作终端应用或 ChatGPT 自身。

![ai-agent-guide-codex-browser-doc](/images/posts/ai-agent-personal-assistant-guide/ai-agent-guide-codex-browser-doc.png)

*▲ OpenAI 官方 Browser 文档：内置浏览器使用独立资料；需要已有 Chrome 标签页时应改用 Chrome 插件。*

一个简单的判断方法：公开网页用 Browser；已有 Chrome 会话用 Chrome 插件；桌面软件用 Computer Use。

### 插件把外部资料接进任务，但不要把“已连接”理解成“随便用”

最新版的 Plugins 可以包含两种东西：

- **Skill（技能）：** 一套可复用的工作方法、参考资料或脚本；
- **Connector（连接器）：** 连接 Gmail、Google Drive、Slack、GitHub 等外部服务。
![Pasted image 20260725161758](/images/posts/ai-agent-personal-assistant-guide/Pasted image 20260725161758.png)
例如，你可以要求 Codex“读取 Drive 里的最新项目计划，再结合 Slack 中本周的决定，生成内部周报”。前提是对应插件已经安装、账号完成授权，而且团队管理员允许使用。

涉及发送邮件、发布消息、删除文件、修改线上数据时，仍要核对收件人、目标位置和最终内容。连接器让资料更容易取得，也让误操作更容易抵达真实业务系统。

![ai-agent-guide-codex-plugins-doc](/images/posts/ai-agent-personal-assistant-guide/ai-agent-guide-codex-plugins-doc.png)

*▲ OpenAI 官方 Plugins 文档列出了 Gmail、Google Drive、Slack 等典型用法，也说明插件由技能和连接器组成。*

### Worktree 适合并行项目，普通文件整理用不上

Worktree 可以理解为“同一个 Git 项目的隔离工作副本”。你可以让一个 Codex 对话修首页，另一个对话写测试，两个任务暂时不碰同一份工作目录。完成后再用 Handoff 把对话和改动移回本地工作区。

它只适用于 Git 项目。你只是整理一批 Word、PDF 或图片时，建两个普通任务文件夹更直接。

![ai-agent-guide-codex-worktrees-doc](/images/posts/ai-agent-personal-assistant-guide/ai-agent-guide-codex-worktrees-doc.png)

*▲ Worktree 只在 ChatGPT 桌面应用的 Codex 中使用，并依赖 Git 仓库。*

### 定时任务要等手工流程稳定后再开

Scheduled tasks 可以定时生成报告、检查项目变化或运行一个技能。桌面应用中的本地定时任务可以在项目目录或隔离的 Worktree 里运行。
![截屏2026-07-25 16.19.29](/images/posts/ai-agent-personal-assistant-guide/截屏2026-07-25 16.19.29.png)
它有两个经常被忽略的条件：**电脑需要开机，ChatGPT 桌面应用也要保持运行**。如果项目文件还没准备好，定时任务只会按时重复同一个错误。

![ai-agent-guide-codex-automations-doc](/images/posts/ai-agent-personal-assistant-guide/ai-agent-guide-codex-automations-doc.png)

*▲ OpenAI 官方 Scheduled tasks 文档明确写出了本地项目运行所需的条件。*

## 三个可以直接复制的实用任务

### 任务一：把会议记录变成可追踪的行动表

```text
阅读 01-原始资料/ 中的会议记录。

目标：生成一份给项目组看的会议简报和行动项表格。
输出：
- 03-输出/会议简报.md：决定、分歧、风险、下一步；
- 03-输出/行动项.csv：事项、负责人、截止日期、原文依据；
- 03-输出/待确认.md：负责人或日期不明确的项目。

边界：不要根据发言者身份猜负责人；不要删除原文件；不要发送消息。
完成标准：每个行动项都能指向具体会议记录和段落。
先进入 Plan mode 检查资料，再开始写入。
```

### 任务二：用公开网页做竞品表

```text
使用内置 Browser 调查 8 个公开可访问的同类产品。

先提出字段表和来源优先级，等我确认后再检索。
输出：
- output/competitors.csv：产品、目标用户、公开价格、计费周期、核心功能、来源 URL、访问日期；
- output/report.md：只写有来源支持的共同点和差异；
- output/to-verify.md：页面冲突、缺失或可能过期的信息。

禁止登录、提交表单、试用付费、发送消息。
价格必须同时记录货币、周期和访问日期；无法确认就留空。
```

### 任务三：做一个可以当场评审的网页原型

```text
阅读 brief.md，在 prototype/ 中制作一个本地可预览的单页原型。

先用 Plan mode 列出页面结构、素材缺口和验收方法。
未经确认，不接入登录、支付、分析脚本、线上数据库或第三方密钥。
完成后：
1. 运行项目已有检查；
2. 使用内置 Browser 打开本地页面；
3. 分别检查桌面宽度和手机宽度；
4. 把发现的问题修复后，再提交 README.md 和修改说明。
```

这三个例子有同一套骨架：**目标、资料、输出、边界、完成标准**。提示词不需要写得像程序，只要把这五件事说清楚。

## 把一次成功任务变成长期助手

当一项任务连续跑对两三次，再决定把规则放在哪里：

- 只用一次的要求，留在当前提示词里；
- 同一项目长期遵守的目录、禁区和验收方式，写进 `AGENTS.md`；
- 跨项目重复使用的步骤，做成 Skill；
- 需要 Gmail、Drive、Slack 等外部服务时，安装对应 Plugin；
- 输入稳定、风险较低、结果只供内部审阅的流程，再设成 Scheduled task。

`AGENTS.md` 可以理解成“给 Codex 看的项目说明书”。它适合写目录结构、文件命名、禁止动作和验证方法。内容越具体越有用。例如：

```markdown
# AGENTS.md

- 所有生成文件只写入 output/。
- 不删除原始资料。
- 引用网页时记录 URL 和访问日期。
- 遇到姓名、金额、日期冲突时写入 output/to-verify.md，不自行裁决。
- 完成前检查 Markdown 链接和 CSV 列数，并报告结果。
```

Codex 重复犯同一个错误时，再把对应规则加进去。不要第一天就写一份几十页的制度。

## 今天先做一个 20 分钟练习

今天先完成一件低风险、能验收的小任务：整理三份会议记录、核对一张公开竞品表，或做一个不联网的网页原型。

先开独立文件夹，使用 Plan mode，把输出位置和禁止动作写清楚。完成后检查来源、文件和改动记录。这个流程跑通一次，你已经掌握了 Codex 最常用的工作方式。

浏览器、插件、Computer Use、Worktree 和定时任务可以以后再加。工具越多，权限和验收也越复杂。先让它稳定交出一份你敢继续使用的结果。

---

## 官方资料与版本核验

- [OpenAI：Codex Best practices](https://learn.chatgpt.com/guides/best-practices)
- [OpenAI：Prompting](https://learn.chatgpt.com/docs/prompting)
- [OpenAI：Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)
- [OpenAI：Browser](https://learn.chatgpt.com/docs/browser)
- [OpenAI：Computer Use](https://learn.chatgpt.com/docs/computer-use)
- [OpenAI：Plugins](https://learn.chatgpt.com/docs/plugins)
- [OpenAI：Scheduled tasks](https://learn.chatgpt.com/docs/automations)
- [OpenAI：Worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)
- [OpenAI Codex 0.145.0 Release](https://github.com/openai/codex/releases/tag/rust-v0.145.0)

*本文功能信息核验于 2026 年 7 月 25 日。产品入口、套餐、地区可用性和团队权限可能变化，请以账号内实际界面与 OpenAI 官方文档为准。*
