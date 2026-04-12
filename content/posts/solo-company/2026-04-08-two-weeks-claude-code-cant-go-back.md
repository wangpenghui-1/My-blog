+++
title = "用了两周 Claude Code，我再也回不去普通 AI 了"
date = "2026-04-08T19:00:00+08:00"
draft = false
summary = "目前网上最完整的中文 Claude Code 使用指南（2026年4月版）。涵盖安装配置、CLAUDE.md、常用命令、Skills、MCP、Hooks、子代理、IDE集成、GitHub自动化全部核心功能。"
tags = ["Claude Code", "AI编程", "开发工具", "一人公司"]
+++

> **本文约 8000 字，建议收藏后阅读。** 涵盖：安装配置 · CLAUDE.md · 常用命令 · Skills · MCP · Hooks · 子代理 · IDE集成 · GitHub自动化

---

如果你用过 ChatGPT 或 Claude 网页版写代码，你会发现一个反复出现的痛苦：**每次都要重新解释项目背景**。

"我们项目用的是 TypeScript，数据库是 PostgreSQL，测试框架用的是……"

说了三遍，AI 还是给你写了个 Python 脚本。

Claude Code 彻底解决了这个问题。它不是一个网页对话框，而是一个**真正住在你项目里的 AI 程序员**——它能读你的文件，执行命令，直接修改代码，而且每次启动都记得上次的约定。

这篇文章是目前网上最完整的中文 Claude Code 使用指南，基于 2026 年 4 月最新版本（v2.1.88）编写。无论你是刚听说这个工具，还是已经用了一段时间想系统学习，都能从这里找到答案。

---

## 一、Claude Code 到底是什么

用一句话说：**Claude Code 是一个跑在终端里的 AI 编程助手，能真正"进入"你的项目，而不只是回答问题。**

普通 AI 对话工具的工作方式是：你贴代码 → AI 回答 → 你手动复制粘贴。

Claude Code 的工作方式是：你说"帮我加个登录验证" → Claude 读取相关文件 → 展示修改方案 → 你确认 → 直接写入文件。

中间那些复制粘贴、反复解释的步骤，全部消失了。

**它能做什么：**

- 读懂整个代码库的结构，不需要你每次解释
- 直接修改文件（修改前会让你确认）
- 执行终端命令（运行测试、安装依赖等）
- 连接 GitHub、数据库、Slack 等外部服务
- 自动化代码审查、CI 修复等重复性工作

**它不是什么：**

- 不是网页聊天框的升级版
- 不会替你做所有决策（重要操作都需要你确认）
- 不是免费的（需要 Claude Pro 或以上套餐）

---

## 二、安装：10 分钟跑起来

### 系统要求

Claude Code 支持 macOS、Windows 和 Linux，AI 计算在云端完成，**你的电脑不需要显卡**，只要能上网就行。

- **macOS**：13.0（Ventura）及以上
- **Windows**：Windows 10/11
- **Linux**：Ubuntu 20.04+、Debian 10+ 等主流发行版
- **内存**：4GB 起步，建议 8GB

### 安装命令

**macOS / Linux**，打开终端粘贴这行：

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows**，打开 PowerShell 粘贴这行：

```powershell
irm https://claude.ai/install.ps1 | iex
```

安装完后验证一下：

```bash
claude --version
```

看到版本号（比如 `claude v2.1.88`）就成功了。如果出现问题，运行 `claude doctor` 自动诊断。

### 账号要求

Claude Code 需要付费账号。免费账号不包含这个功能。

- **Claude Pro**（$20/月）：入门够用
- **Claude Max**（$100/月）：20 倍用量，重度使用者

### 第一次启动

进入你的项目文件夹，输入 `claude` 回车。第一次会自动打开浏览器引导你登录——完成一次就永久认证，以后直接用。

启动后你会看到一个 `>` 提示符，直接用中文告诉它你想做什么：

```
> 帮我解释一下这个项目的整体结构
> 给用户注册表单加上手机号验证
> 运行测试，修复所有报错
```

Claude 会先展示它打算做什么，等你确认后才真正修改文件。**这个确认机制很重要**——你永远是最终决策者。

---

## 三、CLAUDE.md：让 AI 记住你的项目

这是 Claude Code 最被低估的功能，也是让它从"好用"变成"离不开"的关键。

### 它是什么

CLAUDE.md 是一个放在项目根目录里的文本文件。每次 Claude Code 启动，都会自动把这个文件的内容读进来作为背景知识。

**没有 CLAUDE.md**：Claude 每次都是"第一天入职的新人"，你需要反复解释"我们用 TypeScript 不用 JavaScript""测试命令是 pnpm test 不是 npm test"……

**有了 CLAUDE.md**：Claude 一上来就知道所有这些，你直接说"帮我写个测试"，它就会用正确的框架和命令。

### 写什么

**一个核心原则：只写"不写 Claude 就会犯错"的内容。**

通用知识（TypeScript 语法、React 用法）不需要写，Claude 早就知道了。要写的是你项目里独特的约定：

✅ **该写的：**

```markdown
# 我的项目

## 常用命令
- 构建：bun run build
- 测试：bun test（用 Bun 自带的，别用 Jest）
- 检查代码：bun run lint

## 目录结构
- src/handlers/ — 路由处理
- src/services/ — 业务逻辑（不直接查数据库）
- src/db/ — 数据库查询（用 Drizzle，不写原始 SQL）

## 注意事项
- 不要用 console.log，用 src/utils/logger.ts 里的 logger
- 金额统一用整数（单位：分），不用浮点数
- 时间戳用 Unix 秒，不用 Date 对象
```

❌ **不该写的：**

- API 密钥、密码
- 通用的"写好代码"之类的废话
- 代码格式规则（这是 linter 的事）

**建议总行数控制在 100 行以内。**

### 文件层级

Claude Code 支持多层 CLAUDE.md，越靠近项目的优先级越高：

- `~/.claude/CLAUDE.md`：全局配置，对你所有项目生效
- 项目根目录 `CLAUDE.md`：整个团队共用，提交到 Git
- `CLAUDE.local.md`：你个人的配置，不提交（自动被 gitignore）
- 子目录里的 `CLAUDE.md`：只在 Claude 处理那个目录时生效

### 快速生成

不知道怎么写？在 Claude Code 里输入 `/init`，它会分析你的项目自动生成一份。生成后记得删掉没用的内容，只留真正重要的部分。

犯了错被你纠正后，Claude 还会自动把这条教训记录下来，下次不再重犯。这个自动学习功能从 v2.1.59 版本开始有。

---

## 四、常用命令速查

### 斜杠命令

在对话框里输入 `/` 就能看到所有命令。最常用的：

**日常管理：**

| 命令 | 干什么 |
|---|---|
| `/init` | 自动生成 CLAUDE.md |
| `/clear` | 清空对话历史，重新开始 |
| `/compact` | 压缩对话，节省上下文空间 |
| `/resume` | 恢复上次的对话 |
| `/cost` | 查看这次会话花了多少 token |
| `/doctor` | 环境诊断，出问题先跑这个 |

**进阶操作：**

| 命令 | 干什么 |
|---|---|
| `/model` | 切换模型（sonnet / opus / haiku） |
| `/plan` | 切换到规划模式（只分析不修改） |
| `/voice` | 语音输入模式（按住空格说话） |
| `/btw` | 插一个临时问题，不影响主对话 |
| `/review` | 让 Claude 审查 GitHub PR |

### 键盘快捷键

| 快捷键 | 作用 |
|---|---|
| `Shift+Tab` | 循环切换模式（最重要！） |
| `Esc` | 打断 Claude 当前的回复 |
| `Esc` 连按两次 | 打开回退菜单 |
| `Ctrl+C` 连按两次 | 退出 Claude Code |
| `Ctrl+G` | 用外部编辑器编辑当前输入 |
| `Tab` | 开关扩展思考模式 |

**`Shift+Tab` 是最值得记住的快捷键**，它在三种模式间切换：

1. **普通模式**：每次修改都要你确认
2. **自动接受模式**：自动批准文件修改（命令执行还是要确认）
3. **Plan 模式**：只分析规划，不做任何修改

### 特殊语法

在对话里随时可以用：

- `@文件名` — 引用某个文件，让 Claude 读取它的内容
- `!命令` — 直接执行 shell 命令，结果自动加入上下文
- 在提示里写 `ultrathink` — 触发最深度的思考模式

---

## 五、Plan Mode：先想清楚再动手

这是避免 AI "一头扎进去乱改"的最重要工具。

按 `Shift+Tab` 两次切换到 Plan Mode（提示符附近会显示 `plan mode on`）。在这个模式下，**Claude 只能读文件和分析，不能修改任何东西**。

用法很简单：

1. 切换到 Plan Mode
2. 描述你要做的事：「我想给项目加 Google OAuth 登录」
3. Claude 会读相关文件、提出问题、给出详细计划
4. 你审查计划，觉得没问题
5. 切回普通模式，Claude 按计划执行

**什么时候用：**

- 改动涉及多个文件时
- 不熟悉这部分代码时
- 做重构或架构调整时

**什么时候不用：**

- 改个变量名、加行日志这种小事，直接说就好

---

## 六、Skills：给 Claude 装插件

如果说 CLAUDE.md 是告诉 Claude"这个项目是什么"，那 **Skills** 就是告诉 Claude"遇到这类任务该怎么做"。

### 它的工作原理

每个 Skill 就是一个文件夹，里面放一个 `SKILL.md`，写清楚这个技能的触发条件和操作步骤。

Claude 会扫描所有已安装 Skill 的描述（消耗极少 token），自动判断当前任务是否需要激活某个 Skill。你不需要手动调用——说"帮我解释这段代码"，它就会自动用 `explain-code` 这个 Skill 的方式来解释。

### 放在哪里

- `~/.claude/skills/技能名/` — 个人全局，所有项目都能用
- `.claude/skills/技能名/` — 当前项目，可以提交给团队共用

### 自己写一个

以"智能提交助手"为例：

第一步，建目录：

```bash
mkdir -p ~/.claude/skills/smart-commit
```

第二步，建文件 `~/.claude/skills/smart-commit/SKILL.md`：

```markdown
---
name: smart-commit
description: 生成规范的 git commit 信息。用户准备提交代码或说"帮我提交"时触发。
---

# 提交助手

步骤：
1. 运行 git diff --staged 查看改动
2. 分析改动意图（新功能/修 bug/重构？）
3. 生成 commit 信息，格式：类型(范围): 描述
   - feat: 新功能
   - fix: 修 bug
   - refactor: 重构
4. 询问用户是否直接提交
```

重启 Claude Code 后，说"帮我提交"，这个 Skill 就会自动激活。

### 直接用现成的

不想自己写？安装社区现成的：

```bash
# 从 Anthropic 官方市场安装
/plugin marketplace add anthropics/skills
```

**2026 年装机必备 Skills：**

- **frontend-design**（27 万次安装）：生成有设计感的前端界面，告别"AI 味"
- **remotion-best-practices**：用 React 做视频的专家指引
- **superpowers**：20+ 实用技能合集，含 TDD、调试等
- **explain-code**：用类比和图表解释代码，适合写文档

> ⚠️ **安全提醒：Skills 可以执行代码，只安装来自可信来源的。**

---

## 七、MCP：让 Claude 连接外部世界

到目前为止，Claude Code 做的都是"本地"的事——读你的文件，改你的代码。**MCP（模型上下文协议）让它能连接外部服务。**

连接之后，你可以说：

- "把 GitHub 上 #234 这个 Issue 实现一下，开个 PR"
- "看一下 Sentry 最近的报错，帮我找原因"
- "查一下数据库，找出最近 7 天没活跃的用户"

### 添加 MCP 服务

**最简单的方式**，一行命令：

```bash
# 连接 GitHub
claude mcp add --transport http github https://api.githubcopilot.com/mcp

# 连接 Slack
claude mcp add --transport http slack https://mcp.slack.com/mcp
```

**团队共用配置**，在项目根目录建 `.mcp.json`：

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp"
    }
  }
}
```

提交到 Git，团队所有人都能用同样的配置。

### 常用 MCP 服务

| 服务 | 能干什么 |
|---|---|
| GitHub | PR、Issue、代码搜索 |
| Slack | 收发消息、频道管理 |
| Notion | 读写文档 |
| Figma | 设计稿转代码 |
| Sentry | 读取错误日志 |
| PostgreSQL | 查询数据库 |
| Playwright | 浏览器自动化测试 |

> ⚠️ MCP 服务器能访问你的代码和数据，只用官方或经过验证的服务，敏感密钥别提交到 Git。

---

## 八、Hooks：让 Claude Code 自动干活

Hooks 是 Claude Code 的自动化引擎。你可以设定：**每当某件事发生，就自动执行某个脚本。**

比如：

- Claude 改了文件 → 自动格式化
- Claude 准备执行 `rm -rf` → 自动阻断
- 任务完成 → 发一条桌面通知

### 配置在哪里

在 `.claude/settings.json` 里配置，可以提交给团队共用；个人配置放 `.claude/settings.local.json`，不提交。

### 最实用的三个 Hook

**① 改完文件自动格式化**（最常用）

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null || true"
      }]
    }]
  }
}
```

每次 Claude 写或改文件，Prettier 自动跑一遍，代码格式永远整洁。

**② 拦截危险命令**

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "echo \"$CLAUDE_TOOL_INPUT\" | grep -qE 'rm -rf|DROP TABLE' && exit 2 || exit 0"
      }]
    }]
  }
}
```

检测到危险命令（退出码 `2`）就自动阻断，不会等到 Claude 真的执行。

**③ 会话开始注入 Git 信息**

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "echo '{\"additionalContext\": \"当前分支: '$(git branch --show-current)'\"}'"
      }]
    }]
  }
}
```

每次启动 Claude Code，它就自动知道你在哪个分支。

### 关键规则

- `PreToolUse` 是唯一能**阻断**操作的 Hook（退出码 2 = 拦截）
- 加 `"async": true` 让通知类 Hook 异步执行，不阻塞工作流
- 每个 Hook 建议 200ms 内跑完，否则会明显拖慢操作速度
- 用 `/hooks` 命令可以在会话中直接管理 Hooks，不用手动改 JSON

---

## 九、Sub-agents：让 Claude 自己派助手

当你要 Claude 处理一个很大的任务，它会"分身"出子代理来帮忙。

**类比：** Claude 是项目经理，子代理是被派出去调研的专员。专员把几十个文件翻了个遍、写了详细调研报告，但项目经理看到的只有最终结论——不会把所有调研过程都塞进自己的脑子里。

这就解决了一个关键问题：**大规模代码探索不会撑爆主对话的上下文。**

### 内置子代理

Claude Code 自带这几个，会自动激活：

- **Explore**：只读，专门搜索和分析代码库
- **Plan**：Plan Mode 下用于收集信息
- **General-purpose**：需要又读又改的复杂任务

### 自己定义子代理

在 `.claude/agents/` 目录建一个 Markdown 文件：

```markdown
---
name: code-reviewer
description: 代码审查专家。需要检查代码质量、安全漏洞时调用。
tools: Read, Grep, Glob
model: sonnet
---

你是资深代码审查专家。

审查重点：
1. 安全漏洞（SQL注入、权限校验缺失）
2. 性能问题（N+1查询、内存泄漏）
3. 可读性（命名、逻辑清晰度）

输出格式：
每个问题标注文件名和行号，说明问题和修改建议。
```

存到 `~/.claude/agents/` 对所有项目生效，存到 `.claude/agents/` 只对当前项目生效。

调用方式：直接说"用 code-reviewer 检查一下最新提交"，或者 Claude 自己判断需要时自动激活。

### 成本提醒

子代理会开独立上下文窗口，**token 消耗是普通会话的 4-7 倍**。用在适合的场景（大规模代码搜索、独立模块研究），别什么任务都拆给子代理。

---

## 十、IDE 集成：不想用终端怎么办

终端不是所有人的舒适区。Claude Code 有 VS Code 扩展和 JetBrains 插件，让你在编辑器里直接用。

### VS Code 扩展（推荐）

安装方式：按 `Cmd+Shift+X`（Mac）或 `Ctrl+Shift+X`（Windows），搜索 **"Claude Code"**，确认发布者是 **Anthropic** 再安装（防止安装仿冒品）。

Cursor、Trae 等 VS Code 系的编辑器同样适用。

**主要功能：**

- **可视化 Diff**：Claude 修改文件时，左右对比展示原文和改动，一键接受或拒绝
- **检查点回退**：每次修改自动存档，可以随时撤销到某条消息之前的状态
- **@引用文件**：聊天中直接 `@文件名`，甚至可以精确到行号，比如 `@auth.ts#15-30`
- **诊断共享**：Claude 自动看到你的 lint 报错，不需要手动复制粘贴

**快捷键：**

- `Cmd+Esc` / `Ctrl+Esc`：快速打开/关闭 Claude 面板
- `Option+K` / `Alt+K`：把选中的代码插入为 @引用

### JetBrains 插件（Beta）

支持 IntelliJ、PyCharm、WebStorm、GoLand 等全系列。

在 `Settings → Plugins → Marketplace` 搜索 **"Claude Code"** 安装。注意：**插件依赖 CLI**，需要先安装 Claude Code 命令行工具。

### 两者对比

| | VS Code 扩展 | JetBrains 插件 |
|---|---|---|
| 成熟度 | 正式版 | Beta |
| 检查点回退 | ✅ | ❌ |
| 浏览器联动 | ✅ | ❌ |
| Diff 体验 | 内置面板 | 原生 Diff 查看器 |

---

## 十一、GitHub Actions：让 Claude 加入 CI/CD

这是"解放双手"的终极玩法：把 Claude Code 接进 GitHub 的自动化流水线，让它在你不在的时候也在干活。

### 能做什么

- **PR 自动审查**：每次有人开 PR，Claude 自动分析代码并发评论
- **@claude 交互**：在 PR 或 Issue 里 `@claude 帮我实现这个功能`，Claude 直接写代码开 PR
- **CI 自动修复**：测试失败时，Claude 自动分析原因并推送修复
- **自动生成文档**：代码改了，文档自动跟着更新

### 快速配置

最简单的方式：在 Claude Code 终端里输入：

```bash
/install-github-app
```

这个命令会引导你完成所有配置——安装 GitHub App、设置密钥、创建 workflow 文件。

**手动配置**的话，建 `.github/workflows/claude.yml`：

```yaml
name: Claude 助手

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

permissions:
  contents: write
  pull-requests: write

jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

提交后，在任意 PR/Issue 评论里写 `@claude` 就能触发。

### 费用参考

月均 50 个 PR 的小团队，每月 API 费用通常在 **$5 以内**。配置时避免对每次代码推送都触发全量分析，从"只分析 PR 中改动的文件"开始。

> ⚠️ API 密钥必须放在 GitHub Secrets 里，绝对不能写在代码文件里。

---

## 十二、上下文管理：别让 Claude "失忆"

Claude Code 有一个核心约束：**上下文窗口**。它能"记住"的内容总量是有限的——对话历史、读过的文件、命令输出……全都算在里面。窗口快满时，Claude 会开始"遗忘"早期的指令，质量下降。

**几个关键数字：**

- 标准上下文：20 万 token
- Opus 4.6 / Sonnet 4.6：最高 **100 万 token**
- 超过 70%：开始注意
- 超过 90%：必须清理

**管理方法：**

| 方法 | 效果 |
|---|---|
| `/compact` | 把旧对话压缩成摘要，释放空间（可指定保留重点） |
| `/clear` | 完全清空，重新开始（CLAUDE.md 保留） |
| `/context` | 查看当前上下文使用量 |
| 开新会话 | 最彻底，用 `claude -c` 可以找回上次的对话 |

**一个好习惯：** 把反复用到的规则写进 CLAUDE.md，而不是在对话里反复说。CLAUDE.md 的内容不占用对话上下文。

---

## 十三、常见问题速查

| 问题 | 解决方法 |
|---|---|
| 输入 `claude` 提示"找不到命令" | 安装后重新打开终端 |
| 认证失败 401/403 | `/logout` 后重新登录 |
| 提示账号被禁用 | `unset ANTHROPIC_API_KEY`（旧密钥覆盖了订阅认证） |
| 回答质量越来越差 | 运行 `/compact` 或开新会话 |
| MCP 服务不显示 | 检查 JSON 格式，重启 Claude Code |
| Skill 安装后不出现 | 确认 SKILL.md 格式正确，重启 |
| 任何奇怪问题 | 先跑 `/doctor` 诊断 |

---

## 结语：怎么开始用

学了这么多，最好的入门方式还是**从一个真实任务开始**。

**建议的学习节奏：**

**第 1 周**：装好，打开一个自己的项目，直接说中文。让它解释代码、修小 bug、跑测试。感受一下和普通 AI 的区别。

**第 2 周**：跑 `/init` 生成 CLAUDE.md，把项目的构建命令和注意事项写进去。学会用 `Shift+Tab` 切模式，用 `/compact` 管理上下文。

**第 3 周**：安装一两个 Skill（frontend-design 或 explain-code），试试 Plan Mode 处理复杂任务。

**第 4 周及之后**：配 MCP 连 GitHub，试试 Git worktree 并行开发，写第一个 Hook 自动格式化代码。

不需要一次学完所有功能。**每次遇到反复输入相同指令的情况，就把它写成 Skill 或 CLAUDE.md 规则。** Claude Code 会随着你的使用越来越懂你的项目和习惯，这才是它真正强大的地方。

---

_本文基于 Claude Code v2.1.88（2026年4月版）编写，如有功能更新以官方文档为准。_
