+++
title = "Claude Code 零基础完全使用指南（2026年4月版）"
date = "2026-04-01T00:00:00+08:00"
draft = false
summary = "从安装到 GitHub Actions，手把手掌握 Claude Code 的全部核心功能"
tags = ["Claude Code", "AI编程", "开发工具"]
+++

> 工欲善其事，必先利其器。Claude Code 不只是一个编程助手——它是重塑你与代码协作方式的新基础设施。


**Claude Code 是 Anthropic 推出的 AI 编程助手，直接在终端（命令行）中运行，能读懂你的代码、帮你写代码、执行命令、调试错误。** 它不是一个普通的聊天机器人——它能真正"看到"你的整个项目，理解文件结构，并直接修改代码文件。截至 2026 年 4 月，Claude Code 已迭代至 **v2.1.88**，拥有超过 50 个内置命令、语音输入、多会话并行、1M 超长上下文窗口等强大功能。本指南将从零开始，手把手教你安装、配置和使用 Claude Code 的所有核心功能。

---

## 目录

1. [安装与入门配置](#一安装与入门配置)
2. [CLAUDE.md：让 AI 真正理解你的项目](#二claudemd让-ai-真正理解你的项目)
3. [常用命令与快捷键大全](#三常用命令与快捷键大全)
4. [Skills：给 Claude 安装专属技能包](#四skills给-claude-安装专属技能包)
5. [MCP：让 Claude 连接整个世界](#五mcp让-claude-连接整个世界)
6. [Hooks：自动化触发脚本](#六hooks自动化触发脚本)
7. [Sub-agents：子代理系统](#七sub-agents子代理系统)
8. [IDE 集成：在编辑器中使用 Claude Code](#八ide-集成在编辑器中使用-claude-code)
9. [GitHub Actions：让 Claude 加入你的 CI/CD 流水线](#九github-actions让-claude-加入你的-cicd-流水线)
10. [进阶功能详解](#十进阶功能详解)
11. [结语：从零到精通的学习路径](#结语从零到精通的学习路径)

---

## 一、安装与入门配置

### 你的电脑需要满足什么条件

Claude Code 支持三大操作系统。所有 AI 运算都在 Anthropic 的云端服务器上完成，你的电脑不需要显卡，只需要能联网。

| 条件 | 要求 |
|------|------|
| **macOS** | 13.0（Ventura）或更高版本，支持 Intel 和 Apple Silicon（M1/M2/M3/M4） |
| **Windows** | Windows 10（1809+）或 Windows 11，需要安装 Git for Windows |
| **Linux** | Ubuntu 20.04+、Debian 10+ 等主流 64 位发行版 |
| **内存** | 最低 4GB，建议 8GB |
| **网络** | 必须联网（Claude Code 连接 Anthropic 云端 API） |
| **Node.js** | 使用原生安装器则**不需要**；如使用 npm 安装则需 18.0 以上版本 |

### 三步完成安装

**推荐方式：原生安装器**（零依赖，自动更新，Anthropic 官方首推）

**macOS 和 Linux 用户**——打开终端（Terminal），粘贴以下命令后按回车：
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows 用户**——打开 PowerShell，粘贴以下命令后按回车：
```powershell
irm https://claude.ai/install.ps1 | iex
```

安装完成后，输入以下命令验证：
```bash
claude --version
```
如果看到版本号（如 `claude v2.1.88 (stable)`），说明安装成功。还可以运行 `claude doctor` 进行环境诊断，自动检测潜在问题。

**其他安装方式（非首推）：**

- **Homebrew（macOS/Linux）**：`brew install --cask claude-code`（不会自动更新，需手动 `brew upgrade claude-code`）
- **WinGet（Windows）**：`winget install Anthropic.ClaudeCode`
- **npm（已标记为旧版方式）**：`npm install -g @anthropic-ai/claude-code`（需要 Node.js 18+）

### 首次启动与身份验证

Claude Code 需要**付费账号**。免费的 Claude.ai 账号不包含 Claude Code 权限。最低需要 **Claude Pro（$20/月）**，更高级的 **Claude Max（$100/月）** 提供 20 倍用量。

首次启动流程：

1. 在终端中进入你的项目文件夹：`cd ~/my-project`
2. 输入 `claude` 并回车
3. Claude Code 会自动打开浏览器，引导你登录 Anthropic 账号
4. 在浏览器中完成授权后，终端自动接收认证令牌
5. **这是一次性操作**——之后每次启动都会自动使用已保存的认证信息

如果你使用 API 密钥（适合自动化场景），可以设置环境变量：
```bash
export ANTHROPIC_API_KEY=sk-ant-你的密钥
```

### 基本界面是什么样的

启动后，你会看到一个 `>` 提示符。这就是你和 Claude 对话的地方——直接用自然语言描述你想做什么：

```
> 解释一下这个项目的架构
> 给用户注册表单添加输入验证
> 运行测试，修复所有失败的测试用例
```

Claude 会读取你的文件、展示它打算做的修改（以差异对比的形式），并在实际修改文件前**征求你的同意**。这是一个核心安全机制——默认情况下，Claude 不会未经许可就改动任何东西。

你还可以用"一次性模式"快速执行任务而不进入交互会话：
```bash
claude -p "为 auth 模块编写单元测试"
```

也可以通过管道传入内容：
```bash
git diff | claude "审查这段代码变更"
cat error.log | claude "诊断这些错误的根本原因"
```

---

## 二、CLAUDE.md：让 AI 真正理解你的项目

### CLAUDE.md 是什么

CLAUDE.md 是一个特殊的 Markdown 文件，相当于你写给 Claude 的**项目说明书**。每次启动会话时，Claude Code 会自动读取这个文件的内容，作为它理解你项目的基础知识。没有 CLAUDE.md，Claude 每次都像一个刚入职的新人，需要你反复解释项目背景。有了它，Claude 就像一个已经熟悉项目的老同事。

**核心作用：**
- 告诉 Claude 项目的技术栈和架构
- 设定编码规范和约束规则
- 提供常用的构建、测试、部署命令
- 记录项目特有的注意事项和常见坑

### 放在哪里：文件层级体系

Claude Code 支持多层级的 CLAUDE.md 文件，从全局到项目再到子目录，优先级递增：

| 文件位置 | 作用范围 | 是否提交到 Git |
|----------|----------|---------------|
| `~/.claude/CLAUDE.md` | 你所有项目的全局配置 | 否 |
| 项目根目录 `CLAUDE.md` | 整个团队共享的项目规则 | **是** |
| 项目根目录 `.claude/rules/*.md` | 模块化规则文件（可按主题拆分） | 是 |
| 项目根目录 `CLAUDE.local.md` | 你个人的项目配置（不分享给团队） | 否（自动被 gitignore） |
| 子目录中的 `CLAUDE.md` | 仅在 Claude 进入该子目录时生效 | 是 |

**`.claude/rules/` 目录**支持用 YAML 前置元数据限定规则的适用范围：

```yaml
---
paths:
  - "src/api/**/*.ts"
---

# API 开发规范
所有 API 处理函数必须使用 validate() 进行输入校验。
```

这样，只有当 Claude 处理 `src/api/` 下的 TypeScript 文件时，这条规则才会生效，避免不必要地占用上下文空间。

### 应该写什么内容

**一条关键原则：只写"如果不写，Claude 就会犯错"的内容。** Claude 已经知道通用编程知识（TypeScript 语法、常用库 API 等），不需要你重复。

推荐写入的内容包括：

- **构建和测试命令**：写出完整的命令，如 `pnpm test:integration`，而不是只说"运行测试"
- **项目架构**：哪个目录放什么代码，层级关系如何
- **编码约定**：项目特有的命名规范、文件组织规则
- **常见陷阱**：Claude 容易犯的错误，比如"不要使用 `new Date()`，使用 `getCurrentTimestamp()`"
- **环境要求**：必要的环境变量、依赖服务

**不要写入的内容：**
- API 密钥、密码等敏感信息
- 代码检查工具（linter）已覆盖的格式规则
- 通用的"写好代码"之类的提醒
- 频繁变化会很快过时的信息

**建议总行数控制在 200 行以内**，主文件保持 50-100 行，详细内容通过 @imports 引入。

### 具体示例模板

```markdown
# 项目：电商支付 API

## 构建和测试

- 构建：`bun run build`
- 测试：`bun test`（使用 Bun 内置测试器，不要用 Jest）
- 代码检查：`bun run lint`（使用 biome，不是 eslint）
- 类型检查：`bun run typecheck`

每次修改完成前，务必运行 `bun run typecheck`。

## 架构

- `src/handlers/` — HTTP 请求处理，每个路由组一个文件
- `src/services/` — 业务逻辑，不直接访问数据库
- `src/db/` — 数据库层（Drizzle ORM），所有查询在此
- `src/schemas/` — Zod 校验模式，被处理层和数据库层共用

Handler 调用 Service，Service 调用 DB 层。不允许跳层调用。

## 约定

- 所有输入校验使用 `z.object().strict()`
- 错误通过 `Result<T, AppError>` 传播，Service 层禁止 throw
- 所有金额使用整数（单位：分）
- 时间戳使用 Unix 秒（number 类型），不用 Date 对象

## 常见错误

- 不要使用 `console.log`，使用 `src/utils/logger.ts` 中的 logger
- 不要写原始 SQL，使用 Drizzle 查询构建器
```

### @imports 功能：拆分和引用外部文件

这是 CLAUDE.md 的一个强大新特性。你可以在 CLAUDE.md 中用 `@` 符号引入其他文件的内容，让主文件保持精简：

```markdown
# CLAUDE.md

@./docs/architecture.md
@~/shared/style-guide.md

## 项目特定规则
...
```

| 语法 | 含义 |
|------|------|
| `@./relative/path` | 相对于当前文件所在目录 |
| `@~/path/in/home` | 相对于用户主目录 |
| `@/absolute/path` | 绝对路径 |

**关键规则：** 引用的文件不存在时会被静默忽略；支持最多 **5 层嵌套**引用；代码块内的 `@` 不会被处理；首次引用项目目录外的文件需要手动批准。

### 快速生成和管理 CLAUDE.md

- **`/init`**：自动分析项目结构，生成一份初始 CLAUDE.md（建议删除大部分自动生成的内容，只保留真正有用的部分）
- **`/memory`**：在会话中打开内存编辑器，直接查看和编辑所有已加载的 CLAUDE.md 文件，修改立即生效

Claude Code 还有**自动记忆系统**（v2.1.59+）：当你纠正 Claude 的错误时，它会自动把经验保存到 `~/.claude/projects/<项目>/memory/MEMORY.md`。这些自动记忆在每次会话开始时加载，让 Claude 越用越聪明。

---

## 三、常用命令与快捷键大全

### 斜杠命令（Slash Commands）

在 Claude Code 的输入提示符处输入 `/` 即可触发命令菜单。以下是最常用的命令分类：

**项目与会话管理：**

| 命令 | 功能说明 |
|------|----------|
| `/init` | 自动生成 CLAUDE.md 项目文件 |
| `/memory` | 编辑 CLAUDE.md 内存文件 |
| `/compact` | 压缩对话上下文（可加参数如 `/compact 保留 API 相关内容`） |
| `/clear` | 清除对话历史重新开始（CLAUDE.md 保留） |
| `/resume` | 恢复之前的会话（可按 ID 或名称选择） |
| `/fork` | 将当前对话分支为新会话 |
| `/diff` | 查看未提交的代码变更 |
| `/rewind` | 回退对话和/或代码变更到之前的某个节点 |
| `/copy` | 复制最后一条回复到剪贴板 |
| `/export` | 导出对话为纯文本 |

**信息与状态：**

| 命令 | 功能说明 |
|------|----------|
| `/help` | 列出所有可用命令 |
| `/cost` | 显示当前会话的 token 用量和费用 |
| `/usage` | 检查套餐用量和速率限制状态 |
| `/status` | 查看版本、模型、账户、连接状态 |
| `/context` | 可视化上下文窗口使用情况 |
| `/doctor` | 运行环境诊断 |
| `/stats` | 生成使用统计报告 |

**模式与模型控制：**

| 命令 | 功能说明 |
|------|----------|
| `/model` | 切换模型（sonnet、opus、haiku 或完整名称） |
| `/plan` | 切换 Plan Mode（只读规划模式） |
| `/effort` | 设置思考深度（low/medium/high/max） |
| `/vim` | 切换 Vim 编辑模式 |
| `/config` | 打开设置界面（20+ 可配置项） |
| `/fast` | 切换快速模式（Opus 4.6 以 2.5 倍速运行） |

**特殊功能：**

| 命令 | 功能说明 |
|------|----------|
| `/btw` | **侧问功能**——提出一个不影响主对话上下文的临时问题，即使 Claude 正在处理任务也能使用 |
| `/review` | 对指定 PR 进行代码审查（需要 gh CLI） |
| `/voice` | 启动语音输入模式（按住空格说话） |
| `/mcp` | 检查 MCP 服务器连接状态 |
| `/permissions` | 更改权限设置 |

**内置技能命令（v2.1.63+）：**

| 命令 | 功能说明 |
|------|----------|
| `/batch <指令>` | 大规模并行修改——自动拆分任务、创建 worktree、并行执行、自动建 PR |
| `/simplify` | 三代理并行代码审查——检查代码复用、质量、效率 |

**Skills 与插件管理：**

| 命令 | 功能说明 |
|------|----------|
| `/plugin list` | 查看已安装的插件/skills |
| `/plugin install <名称>` | 从本地路径安装插件 |
| `/plugin marketplace add <名称>` | 从插件市场安装 |
| `/plugin remove <名称>` | 卸载插件 |
| `/<skill名称>` | 直接调用某个 skill（如 `/explain-code`） |

### 键盘快捷键

**核心操作：**

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 发送消息 |
| `Esc` | 中断 Claude 当前的回复（按一次） |
| `Esc` × 2（连按两次） | 打开回退菜单，可选择回退对话或代码 |
| `Ctrl+C` | 取消当前输入/生成；连按两次退出会话 |
| `Ctrl+D` | 退出 Claude Code |
| `Shift+Enter` | 换行（在 iTerm2、WezTerm 等终端原生支持；其他终端需运行 `/terminal-setup`） |
| `\` + `Enter` | 换行（所有终端通用） |
| `Ctrl+G` | 用外部编辑器打开当前输入（适合编辑长提示） |
| `Ctrl+L` | 清屏（保留对话） |
| `上/下方向键` | 浏览历史命令 |
| `Ctrl+R` | 反向搜索历史命令 |

**模式切换——这是最重要的快捷键之一：**

| 快捷键 | 功能 |
|--------|------|
| **`Shift+Tab`** | **循环切换模式：普通模式 → 自动接受模式 → Plan 模式** |
| `Tab` | 切换扩展思考（Extended Thinking）开/关 |
| `Ctrl+O` | 切换详细显示（显示思考过程） |
| `Ctrl+T` | 切换任务列表显示 |

**文件操作：**

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+V` | 从剪贴板粘贴图片 |
| `Shift` + 拖拽文件 | 添加文件作为引用 |

### CLI 启动参数

从终端启动 Claude Code 时可以附加各种参数：

| 参数 | 功能 |
|------|------|
| `claude` | 启动交互式会话 |
| `claude "问题"` | 带初始提示启动 |
| `claude -p "问题"` | 非交互模式——执行后直接输出结果并退出 |
| `claude -c` | 恢复最近的会话 |
| `claude -r "ID"` | 恢复指定会话 |
| `claude --model opus` | 指定使用的模型 |
| `claude --effort high` | 设置思考深度 |
| `claude --worktree` | 在 git worktree 中启动隔离会话 |
| `claude --output-format json` | JSON 格式输出 |
| `--dangerously-skip-permissions` | 跳过所有权限检查（**仅在可信容器中使用**） |
| `--append-system-prompt "..."` | 在默认系统提示后追加自定义指令 |

### @ 文件引用语法与特殊输入

| 语法 | 说明 |
|------|------|
| `@filename.js` | 引用文件（Tab 键自动补全） |
| `@path/to/directory/` | 引用目录（显示目录列表） |
| `!<命令>` | 直接执行 shell 命令，如 `!ls -la`，输出加入上下文 |
| `& <任务>` | 在后台运行任务 |
| `ultrathink` | 在提示中包含此关键词可触发最大思考预算（31,999 tokens） |

---

## 四、Skills：给 Claude 安装专属技能包

### Skills 是什么

**Skills（技能）** 是 Claude Code 最具扩展性的功能之一。如果说 CLAUDE.md 是告诉 Claude"这个项目是什么"，那么 Skills 就是告诉 Claude"遇到这类任务该怎么做"。

每个 Skill 本质上是一个**文件夹**，里面有：
- 一个 `SKILL.md` 文件（包含给 Claude 的详细操作说明）
- 可选的脚本文件（Python、Bash 等）
- 可选的模板和资源文件

**Skills 的三大优势：**

1. **自动触发**：Claude 读取所有已安装 skill 的元数据（约 100 tokens），自动判断当前任务是否需要激活某个 skill。你不需要手动调用——当你说"帮我解释这段代码"时，Claude 会自动加载 `explain-code` skill
2. **按需加载**：Skill 的完整内容（约 5k tokens）只有在被激活时才加载，不影响日常上下文
3. **跨工具通用**：Skills 遵循开放的 `SKILL.md` 标准（agentskills.io），同一个 skill 文件可以在 Claude Code、Cursor、Gemini CLI 等多种 AI 工具中使用

### Skills 与其他功能的区别

| 功能 | 作用 | 适用场景 |
|------|------|----------|
| **CLAUDE.md** | 提供项目背景和约束 | 一直生效，全局性规则 |
| **Skills** | 提供特定任务的详细操作步骤 | 按需加载，可复用的工作流 |
| **MCP** | 连接外部服务（GitHub、数据库等） | 需要访问外部系统时 |
| **斜杠命令** | 用户主动触发的操作 | 明确需要执行某个动作时 |

### Skills 的存放位置

| 位置 | 作用范围 | 说明 |
|------|----------|------|
| `~/.claude/skills/<skill名>/` | **个人全局**，所有项目可用 | 适合你个人惯用的工作流 |
| `.claude/skills/<skill名>/` | **当前项目**，团队共享 | 提交到 Git，团队所有人可用 |
| 插件目录（通过 `/plugin` 安装） | 全局或项目级 | 来自社区或官方市场 |

### SKILL.md 的文件结构

每个 skill 都以 `SKILL.md` 为核心，包含两部分：

```markdown
---
name: explain-code
description: 用图表和类比解释代码。当需要解释代码如何工作，或用户问"这段代码是什么意思"时使用。
---

# 代码解释技能

解释代码时，请始终包含以下内容：

## 步骤
1. **先打比方**：用日常生活中的事物来类比代码的功能
2. **画出结构图**：用 ASCII 艺术展示流程、结构或关系
3. **逐层解释**：先说整体目的，再解释关键部分，最后说实现细节
4. **举一个实际例子**：说明这段代码在真实项目中如何被使用
```

**YAML 前置元数据（frontmatter）字段：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | skill 的名称，同时成为 `/name` 斜杠命令 |
| `description` | ✅ | 简洁描述，Claude 据此判断是否自动激活（建议控制在 1-2 句） |
| `invocation` | 否 | `auto`（Claude 自动决定）或 `manual`（仅斜杠命令触发），默认 `auto` |
| `paths` | 否 | 限定生效的文件路径模式，如 `["src/**/*.test.ts"]` |

### 创建你的第一个 Skill

**示例：创建一个"代码提交助手"skill**

第一步，创建 skill 目录：
```bash
mkdir -p ~/.claude/skills/smart-commit
```

第二步，创建 `SKILL.md` 文件（`~/.claude/skills/smart-commit/SKILL.md`）：

```markdown
---
name: smart-commit
description: 生成规范的 git commit 信息。当用户完成一段修改准备提交代码，或说"帮我提交"时触发。
invocation: auto
---

# 智能 Git 提交助手

## 操作步骤

1. 运行 `git diff --staged` 查看暂存的变更
2. 如果没有暂存内容，运行 `git diff` 查看所有变更
3. 分析变更的核心意图（是修复 bug、新增功能还是重构？）
4. 按照以下格式生成 commit 信息：

```
<类型>(<范围>): <简短描述>

<可选的详细说明，说明为什么做这个改动>
```

类型选择：
- `feat`：新功能
- `fix`：修复 bug
- `refactor`：重构（不影响功能）
- `docs`：文档更新
- `test`：测试相关
- `chore`：构建/配置变更

5. 生成后询问用户是否直接执行 `git commit -m "..."`
```

第三步，测试：重启 Claude Code 后，说"帮我提交这次的修改"，Claude 会自动激活这个 skill。

### 带脚本的进阶 Skill

Skills 还可以包含可执行脚本，让 Claude 运行真实代码：

```
~/.claude/skills/codebase-visualizer/
├── SKILL.md          # 主说明文件
└── scripts/
    └── visualize.py  # Claude 会运行这个脚本
```

`SKILL.md` 内容：
```markdown
---
name: codebase-visualizer
description: 生成代码库的可视化树状结构，在浏览器中展示。
---

# 代码库可视化

运行 `scripts/visualize.py` 并传入当前目录路径，
脚本会生成一个交互式 HTML 文件并在浏览器中打开。
```

### 安装现成的 Skills

**方式一：从 Anthropic 官方仓库安装**

在 Claude Code 中运行：
```
/plugin marketplace add anthropics/skills
```
然后可以使用官方技能，如：
```
/plugin install document-skills@anthropic-agent-skills
```

**方式二：从 npx 直接安装社区 Skills**

```bash
npx skills add https://github.com/remotion-dev/skills
```

**方式三：手动复制**

从 GitHub 找到感兴趣的 skill，把整个文件夹复制到 `~/.claude/skills/` 目录下即可。

### 2026 年值得了解的热门 Skills

| Skill 名称 | 用途 | 安装量 |
|------------|------|--------|
| **frontend-design** | 生成有设计感的前端界面（避免"AI 审美"） | 277,000+ |
| **remotion-best-practices** | 用 React 制作程序化视频的最佳实践 | 117,000+/周 |
| **docx/pdf/pptx/xlsx** | Office 文档创建和处理 | Anthropic 官方内置 |
| **superpowers** | 20+ 实用技能集合（TDD、调试、协作等） | 社区热门 |
| **explain-code** | 用图表和类比解释代码 | 示例内置 |

完整的社区 skill 目录可以在以下地方找到：
- **skillsmp.com**：700,000+ skills，跨 AI 工具通用
- **github.com/anthropics/skills**：Anthropic 官方 skills 仓库
- **github.com/travisvn/awesome-claude-skills**：精选社区 skills 列表

### 安全提醒

Skills 可以执行任意代码（通过脚本文件），因此：
- **只安装来自可信来源的 skills**——优先选择官方或知名开发者发布的
- 安装前可以用 `/plugin list` 查看已安装的内容
- 如果某个 skill 行为异常，立即用 `/plugin remove <名称>` 卸载

---

## 五、MCP：让 Claude 连接整个世界

### MCP 是什么

**MCP（Model Context Protocol，模型上下文协议）** 是 Anthropic 于 2024 年 11 月推出的开源标准，2025 年 12 月捐赠给 Linux 基金会，成为行业中立标准。截至 2026 年 3 月，月下载量已达 **9700 万次**，被所有主流 AI 提供商采纳。

简单来说，MCP 就像是 Claude 的"USB 接口"——通过它，Claude 可以连接 GitHub、Slack、数据库、Figma 等外部工具和服务，让 Claude 不仅能读写代码，还能与你的整个开发工作流无缝对接。

**连接 MCP 后，你可以对 Claude 说：**
- "把 JIRA 上 ENG-4521 描述的功能实现，然后在 GitHub 上创建 PR"
- "查一下 Sentry 上最近的报错，找到对应的源码，提出修复方案"
- "根据 PostgreSQL 数据库，找出使用过某功能的 10 个用户的邮箱"

> **Skills vs MCP 的区别**：Skills 通过指令和本地脚本扩展 Claude 的能力；MCP 通过网络协议连接**外部服务**。需要访问 GitHub、数据库、Slack 等外部系统时用 MCP；需要给 Claude 安装特定工作流程或专业知识时用 Skills。

### 如何配置 MCP 服务器

**方式一：命令行添加（最简单）**

```bash
# 添加 GitHub（HTTP 方式，推荐）
claude mcp add --transport http github https://api.githubcopilot.com/mcp

# 添加 Slack（HTTP + OAuth）
claude mcp add --transport http slack https://mcp.slack.com/mcp

# 添加本地 SQLite 数据库
claude mcp add --transport stdio sqlite-db -- npx @modelcontextprotocol/server-sqlite ./data/app.db

# 添加 PostgreSQL
claude mcp add --transport stdio postgres -- npx @modelcontextprotocol/server-postgres postgresql://localhost/myapp
```

**方式二：配置文件（适合团队共享）**

在项目根目录创建 `.mcp.json` 文件：

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp",
      "headers": {
        "Authorization": "Bearer 你的GitHub令牌"
      }
    },
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "./data/app.db"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp", "--headless"]
    }
  }
}
```

**配置文件作用域：**

| 作用域 | 文件位置 | 适用场景 |
|--------|----------|----------|
| 项目级（团队共享） | `.mcp.json`（项目根目录） | 提交到 Git，团队所有人使用 |
| 个人本地 | `.claude/settings.local.json` | 存放含密钥的配置，不提交 |
| 全局 | `~/.claude/settings.local.json` | 所有项目通用的服务 |

**管理命令：**
```bash
claude mcp list              # 列出所有已配置的服务器
claude mcp remove github     # 移除指定服务器
/mcp                         # 在会话中检查服务器状态
```

### 常见 MCP 服务一览

| 服务 | 包名/地址 | 用途 |
|------|----------|------|
| **GitHub** | `https://api.githubcopilot.com/mcp` | PR、Issue、代码搜索、分支管理 |
| **Slack** | `https://mcp.slack.com/mcp` | 消息收发、频道管理 |
| **Notion** | `https://mcp.notion.com/mcp` | 文档访问 |
| **Figma** | `https://mcp.figma.com/mcp` | 设计稿转代码 |
| **Sentry** | `https://mcp.sentry.dev/mcp` | 错误监控和诊断 |
| **Linear** | `https://mcp.linear.app/mcp` | 任务和迭代管理 |
| **Supabase** | `https://mcp.supabase.com/mcp` | 数据库、认证、存储 |
| **PostgreSQL** | `@modelcontextprotocol/server-postgres` | 数据库查询 |
| **SQLite** | `@modelcontextprotocol/server-sqlite` | 轻量数据库 |
| **Playwright** | `@playwright/mcp` | 浏览器自动化测试 |
| **Context7** | `@upstash/context7-mcp` | 获取特定版本的库文档 |
| **Brave Search** | `@brave/brave-search-mcp-server` | 实时网络搜索 |

完整目录可在 github.com/modelcontextprotocol/servers 查看，已有超过 **1000+ 社区构建的 MCP 服务器**。

### 安全注意事项

MCP 功能强大但需谨慎使用。Anthropic 不会审核或验证第三方 MCP 服务器的安全性，使用时需自行承担风险。

- **安装前先审查源码**——优先选择工具厂商的官方 MCP 服务器
- **最小权限原则**——数据库连接使用只读用户，API 令牌只授予必要权限
- **分离配置和密钥**——共享配置放 `.mcp.json`，密钥放 `.claude/settings.local.json`（已被 gitignore）
- **警惕提示注入**——MCP 服务器返回的外部内容可能包含恶意指令
- **权限控制**——可在设置中精确控制每个 MCP 工具的允许/禁止状态：
  ```json
  {
    "permissions": {
      "allow": ["mcp__github__create_pull_request"],
      "deny": ["mcp__database__drop_table"]
    }
  }
  ```

---

## 六、Hooks：自动化触发脚本

### Hooks 是什么

**Hooks（钩子）** 是 Claude Code 的自动化引擎。你可以配置在特定时机自动执行的脚本——例如每次 Claude 修改文件后自动格式化代码、每次会话开始时自动注入项目信息、或者在 Claude 准备执行危险命令前拦截并阻止。

与 Skills（告诉 Claude 怎么做事）和 MCP（连接外部服务）不同，**Hooks 的执行是确定性的**：无论 Claude 是否认为有必要，只要触发条件满足，脚本就一定会运行。这让 Hooks 成为强制执行团队规范、保障代码质量的最可靠手段。

截至 2026 年 3 月，Claude Code 拥有 **21 个生命周期事件**、4 种处理器类型，支持异步执行和 JSON 结构化输出。

### 核心事件类型

| 事件 | 触发时机 | 是否可阻断 | 典型用途 |
|------|----------|-----------|----------|
| **SessionStart** | 会话启动/恢复/清除时 | 否 | 注入环境信息、初始化日志 |
| **PreToolUse** | Claude 调用工具前 | ✅ **是** | 拦截危险命令、审计操作 |
| **PostToolUse** | 工具成功执行后 | 否 | 自动格式化、运行测试 |
| **PostToolUseFailure** | 工具执行失败后 | 否 | 错误追踪、告警通知 |
| **PermissionRequest** | 弹出权限确认对话框前 | ✅ 是 | 自动批准常规操作 |
| **Stop** | Claude 完成一轮回复时 | 否 | 发送完成通知、记录日志 |
| **SubagentStop** | 子代理完成任务时 | 否 | 子代理结果后处理 |
| **SessionEnd** | 会话结束时 | 否 | 清理临时文件、保存日志 |
| **PreCompact** | 上下文压缩前 | 否 | 保存重要上下文 |
| **UserPromptSubmit** | 用户提交消息时 | 否 | 消息预处理、关键词过滤 |

**退出码规则（PreToolUse 专用）：**
- 退出码 `0`：允许操作继续
- 退出码 `2`：**阻断操作**（这是唯一能阻止 Claude 行动的方式）
- 退出码 `1`：仅记录警告，操作仍继续

### 配置文件位置

Hooks 配置在 JSON 文件中，支持两个级别：

| 文件 | 作用范围 | 是否提交 Git |
|------|----------|------------|
| `.claude/settings.json` | 当前项目，团队共享 | **是** |
| `.claude/settings.local.json` | 个人配置，不共享 | 否 |

### 4 种处理器类型

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| `command` | 执行 shell 命令或脚本 | 格式化、测试、通知 |
| `http` | 调用 HTTP 端点 | 与外部服务集成、团队审计 |
| `prompt` | 让 Claude 本身判断是否允许 | 语义级安全检查 |
| `agent` | 启动子代理进行深度分析 | 复杂代码审查、合规检查 |

### 实用 Hook 示例

**示例一：每次修改文件后自动格式化（最常用）**

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null || true"
      }]
    }]
  }
}
```

**示例二：拦截危险命令（安全守卫）**

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "echo \"$CLAUDE_TOOL_INPUT\" | grep -qE 'rm -rf|DROP TABLE|format C' && exit 2 || exit 0"
      }]
    }]
  }
}
```

**示例三：会话开始时注入当前分支信息**

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "echo '{\"additionalContext\": \"当前分支: '$(git branch --show-current)'\nLast commit: '$(git log -1 --oneline)'\"}'",
      }]
    }]
  }
}
```

`SessionStart` 钩子的 stdout 会被**直接注入 Claude 的上下文**，让 Claude 每次启动就知道当前的 Git 状态。

**示例四：任务完成后发桌面通知**

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "osascript -e 'display notification \"Claude 完成了任务\" with title \"Claude Code\"'",
        "async": true
      }]
    }]
  }
}
```

加上 `"async": true` 让通知异步发送，不阻塞 Claude 的工作流。

**示例五：修改 git commit 前自动运行测试**

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "echo \"$CLAUDE_TOOL_INPUT\" | grep -q 'git commit' && npm test || exit 0; [ $? -ne 0 ] && exit 2 || exit 0"
      }]
    }]
  }
}
```

### 快速管理 Hooks

- **`/hooks`** 命令：在会话中交互式管理 hooks，无需手动编辑 JSON
- **`Ctrl+O`**：开启详细模式，显示每个 hook 的执行输出（方便调试）
- **`CLAUDE_SKIP_HOOKS=1`**：临时禁用所有 hooks（紧急情况用）

### 性能注意事项

每个同步 Hook 都会增加对应操作的延迟。建议：
- 单个 Hook 执行时间控制在 **200ms 以内**
- 不阻塞操作的 Hook（通知、日志）加上 `"async": true`
- 先在终端手动测试脚本，再配置为 Hook

---

## 七、Sub-agents：子代理系统

### Sub-agents 是什么

**Sub-agents（子代理）** 是 Claude Code 内部可以生成的专属 AI 助手。当主对话遇到需要大量探索、高度专注或特定工具限制的任务时，Claude 可以将该任务委派给一个子代理——后者在**独立的上下文窗口**中完成工作，最终只把结果摘要返回给主对话。

用一个比喻来理解：主 Claude 是项目经理，子代理是被派去执行特定任务的专家。专家的工作过程（读了几十个文件、执行了哪些命令）不会填满项目经理的"大脑"，只有最终结论会汇报回来。

**子代理的三大价值：**
1. **保护主上下文**：大量文件探索、代码搜索的中间过程留在子代理内，主对话保持简洁
2. **工具权限隔离**：可以限制子代理只能读文件不能写文件，防止意外改动
3. **并行执行**：多个子代理同时运行，大幅缩短复杂任务的完成时间

### Claude Code 内置的子代理

Claude Code 自带几个会自动激活的内置子代理：

| 内置子代理 | 自动触发场景 | 特点 |
|-----------|------------|------|
| **Explore** | 搜索和分析代码库（不做修改） | 只读，快速，专注于代码理解 |
| **Plan** | Plan Mode 下的代码研究阶段 | 只读，为规划收集信息 |
| **General-purpose** | 需要探索+修改的复杂多步任务 | 全能，处理依赖性强的操作 |

### 创建自定义子代理

**方式一：使用 `/agents` 命令（推荐新手）**

在 Claude Code 中输入 `/agents`，选择"创建新代理"，然后用自然语言描述这个子代理的职责，Claude 会自动生成完整配置。

**方式二：手动创建 Markdown 文件**

子代理定义在 Markdown 文件中，存放位置：

| 位置 | 作用范围 |
|------|----------|
| `~/.claude/agents/<名称>.md` | 个人全局，所有项目可用 |
| `.claude/agents/<名称>.md` | 当前项目，团队共享（优先级更高） |

一个完整的子代理文件结构：

```markdown
---
name: code-reviewer
description: 专门的代码审查代理。当需要审查代码质量、安全性或最佳实践时调用。
tools: Read, Grep, Glob
model: sonnet
---

你是一位经验丰富的代码审查专家。

## 审查重点
1. **安全漏洞**：SQL 注入、XSS、权限校验缺失
2. **性能问题**：N+1 查询、无效循环、内存泄漏
3. **可读性**：命名是否清晰、逻辑是否易懂
4. **测试覆盖**：关键路径是否有测试

## 输出格式
以 Markdown 列表汇报发现的问题，每条包含：
- 问题位置（文件名 + 行号）
- 问题描述
- 建议的修改方式
```

**YAML 前置元数据字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 子代理标识符，也可在提示中直接引用（"使用 code-reviewer 分析..."） |
| `description` | ✅ | Claude 据此决定何时自动委派任务 |
| `tools` | 否 | 限制可用工具（`Read, Grep, Glob` = 只读；省略则继承全部权限） |
| `model` | 否 | 指定模型：`haiku`（快速廉价）、`sonnet`（默认）、`opus`（复杂任务） |

### 模型选择策略

不同子代理可以用不同模型，在质量和成本间取得平衡：

```markdown
# 探索类任务 → 用快速廉价的 haiku
model: haiku

# 标准实现任务 → 默认 sonnet
model: sonnet

# 复杂推理任务 → 用最强的 opus
model: opus
```

### 主动调用子代理

子代理既可以自动激活，也可以在提示中明确指名：

```
> 使用 code-reviewer 子代理分析 src/auth/ 下的所有文件
> 让 security-scanner 检查最近提交的变更是否有漏洞
```

### 子代理 vs Agent Teams（实验性功能）

| | 子代理（Sub-agents） | Agent Teams（实验性） |
|-|---------------------|---------------------|
| **协作方式** | 主代理派发任务，子代理独立完成后汇报 | 多个代理在共享任务列表中协同工作 |
| **通信** | 单向（子代理→主代理） | 双向（代理间互相传递信息） |
| **启用方式** | 默认可用 | 需设置 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` |
| **Token 消耗** | 约 4-7 倍单会话 | 约 15 倍单会话 |
| **适用场景** | 独立的探索/研究任务 | 需要多专家协同的复杂项目 |

**Agent Teams 快速启用：**
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```
然后告诉 Claude："创建一个代理团队，分别负责 API 层、数据库迁移和测试覆盖，协同重构支付模块。"

### 成本提醒

子代理不是免费的。每个子代理拥有独立的上下文窗口，token 消耗会成倍增加。**建议把子代理用在最能发挥价值的场景：大范围代码搜索、独立模块研究——而不是把所有任务都拆给子代理。**

---

## 八、IDE 集成：在编辑器中使用 Claude Code

### 为什么需要 IDE 集成

Claude Code 原生在终端中运行，功能完整，但需要在终端和编辑器之间来回切换。IDE 集成把 Claude Code 直接嵌入你的编辑器，让你在写代码的同时就能与 Claude 对话、查看 diff、接受或拒绝修改——**无需离开当前工作窗口**。

### VS Code 扩展（推荐，功能最完整）

**安装步骤：**
1. 打开 VS Code，按 `Cmd+Shift+X`（Mac）或 `Ctrl+Shift+X`（Windows/Linux）打开扩展市场
2. 搜索 **"Claude Code"**，确认发布者是 **Anthropic**（避免安装仿冒扩展）
3. 点击安装，等待完成
4. 点击侧边栏出现的 Claude 图标（⚡ 或星形），首次启动会引导你登录

> 同样适用于 **Cursor**（基于 VS Code 的 AI 编辑器）和 **Trae** 等 VS Code 分支。

**核心功能：**

| 功能 | 说明 |
|------|------|
| **原生聊天面板** | 可拖动到任意位置，支持多标签并行对话 |
| **可视化 Diff 审查** | Claude 提出修改时，左右对比显示原文和新内容，一键接受或拒绝 |
| **@文件引用** | 直接在聊天中 `@` 引用文件甚至具体行范围，如 `@auth.ts#15-30` |
| **检查点（Checkpoints）** | 每次文件修改自动保存状态，可随时"撤销到某条消息之前" |
| **诊断信息共享** | Claude 自动看到你的 lint 错误和警告，无需手动复制粘贴 |
| **浏览器联动** | 配合 Claude in Chrome 扩展，可在聊天中用 `@browser` 控制浏览器 |

**快捷键：**

| 快捷键 | 功能 |
|--------|------|
| `Cmd+Esc` / `Ctrl+Esc` | 快速打开/关闭 Claude 面板 |
| `Option+K` / `Alt+K` | 将当前选中代码插入为 @引用 |
| `Ctrl+\`` | 打开集成终端（可在此运行 CLI） |

**检查点的三种回退方式：**

将鼠标悬停在任意消息上，会显示回退按钮，提供三个选项：
- **从此处分叉对话**：保留所有代码修改，但从该消息重新开始对话
- **回退代码到此处**：恢复文件到该时间点，但保留完整对话历史
- **分叉并回退代码**：同时重置对话和代码（最彻底的撤销）

**配置示例**（VS Code `settings.json`）：
```json
{
  "claude-code.model": "claude-sonnet-4-6",
  "claude-code.autoApprove": false,
  "claude-code.showInlineHints": true,
  "claude-code.diffViewMode": "sideBySide"
}
```

### JetBrains 插件（Beta）

支持 IntelliJ IDEA、PyCharm、WebStorm、GoLand、PhpStorm、Android Studio 等全系列 JetBrains IDE。

**安装步骤：**
1. 确认 Claude Code CLI 已安装（插件依赖 CLI）
2. 在 IDE 中打开 `Settings → Plugins → Marketplace`
3. 搜索 **"Claude Code"**，安装 Anthropic 官方 Beta 插件
4. 重启 IDE
5. 首次使用时，在 IDE 内置终端中运行 `claude` 完成认证

**核心功能：**

| 功能 | 说明 |
|------|------|
| **原生 Diff 查看器** | 使用 JetBrains 内置的 Diff 界面查看和接受修改，体验与手动代码审查一致 |
| **自动选区共享** | 在编辑器中选中代码后，切换到 Claude 面板时自动作为上下文传入 |
| **快速启动** | `Cmd+Esc` / `Ctrl+Esc` 直接启动 Claude Code |
| **工具窗口** | `View → Tool Windows → Claude Code` 打开面板 |

**远程开发注意事项：** 使用 JetBrains Remote Development（SSH 远程连接）时，需要在**远程主机**上安装 Claude Code CLI，而不是本地机器。

### VS Code 扩展 vs JetBrains 插件 对比

| | VS Code 扩展 | JetBrains 插件 |
|-|-------------|---------------|
| **成熟度** | 正式版，功能最完整 | Beta 阶段 |
| **Diff 体验** | 内置 Diff 面板 | 使用 JetBrains 原生 Diff 查看器 |
| **检查点功能** | ✅ 支持 | ❌ 暂不支持 |
| **浏览器联动** | ✅ 支持 | ❌ 不支持 |
| **内联代码提示** | ✅ 支持 | 有限支持 |
| **配置共享** | 共用 `~/.claude/settings.json` | 共用 `~/.claude/settings.json` |

### 在任意编辑器中使用 CLI

如果你使用其他编辑器（Neovim、Emacs、Zed 等），可以在编辑器内置终端中直接运行 `claude`。大部分功能都可以通过 CLI 使用，只是不如原生扩展流畅。

当 Claude Code 检测到在 VS Code 的集成终端中运行时，会**自动集成 IDE 的 Diff 查看和诊断共享**。如果使用外部终端，运行 `/ide` 命令手动连接。

---

## 九、GitHub Actions：让 Claude 加入你的 CI/CD 流水线

### 能做什么

**Claude Code GitHub Actions** 是 Anthropic 官方提供的 GitHub Action（`anthropics/claude-code-action@v1`），让 Claude Code 在 GitHub 的 CI/CD 流水线中自动运行——不只是发 API 请求，而是运行**完整的 Claude Code 运行时**，拥有读取文件、执行 git 命令、修改代码、推送提交的能力。

**实际能实现的自动化：**
- 在任何 PR 或 Issue 中用 `@claude` 提问，Claude 自动回复并实现代码修改
- 每次 PR 开启时自动进行代码审查，以评论形式发布具体反馈
- CI 测试失败时自动分析原因并推送修复提交
- 将 Issue 描述自动转化为代码实现并开 PR
- 代码合并后自动更新相关文档
- 版本发布时自动生成 Release Notes

### 快速上手（3 步配置）

**第一步：在终端中一键安装**

这是最简单的方式——在 Claude Code 终端中运行：
```
/install-github-app
```
这个命令会引导你安装 Claude GitHub App、配置仓库 Secret，并创建默认的 workflow 文件。

**第二步：手动配置（如果一键安装不适用）**

1. 访问 `github.com/apps/claude`，安装 Claude GitHub App 到你的仓库
2. 在仓库 `Settings → Secrets and variables → Actions` 中添加：
   ```
   ANTHROPIC_API_KEY = sk-ant-你的API密钥
   ```
3. 在仓库中创建 `.github/workflows/claude.yml`（见下方示例）

**第三步：提交 workflow 文件**

```yaml
# .github/workflows/claude.yml
name: Claude Code Assistant

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

提交后，在任意 PR 或 Issue 评论中写 `@claude 解释这段代码` 即可触发。

### 常用 workflow 模板

**模板一：每个 PR 自动代码审查**

```yaml
name: 自动代码审查

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            审查这个 PR 的代码变更，重点检查：
            1. 潜在的 bug 和安全漏洞
            2. 性能问题
            3. 是否符合项目的编码规范（参考 CLAUDE.md）
            用中文发表评论，每条评论标注具体文件和行号。
```

**模板二：CI 失败时自动修复**

```yaml
name: 自动修复失败的 CI

on:
  workflow_run:
    workflows: ["CI Tests"]
    types: [completed]

jobs:
  fix:
    if: github.event.workflow_run.conclusion == 'failure'
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            CI 测试失败了。请：
            1. 查看失败的测试日志
            2. 找到根本原因
            3. 修复问题并提交代码
```

**模板三：@claude 交互模式（最灵活）**

```yaml
# 允许团队成员直接在 PR/Issue 中用 @claude 指挥 Claude
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

# 示例用法：
# @claude 为这个 PR 补充单元测试
# @claude 解释 src/payment.ts 的工作原理
# @claude 重构这个函数使其更简洁
```

### 两种触发模式

| 模式 | 触发方式 | 适用场景 |
|------|----------|----------|
| **交互模式** | 在 PR/Issue 评论中 `@claude` | 开发者主动提问、请求实现 |
| **自动化模式** | workflow 中设置 `prompt` 参数 | 每次 PR 自动审查、CI 失败自动修复 |

大多数团队同时使用两种模式：自动化模式做持续质量检查，交互模式处理临时请求。

### 安全注意事项

- **API Key 必须存在 GitHub Secrets 中**，绝不能硬编码在 workflow 文件里
- **限制权限到最小必要范围**：只给 Claude 需要的 `contents`、`pull-requests`、`issues` 权限
- **审查 Claude 的修改**：Claude 会直接推送提交，建议配合 branch protection rules 要求人工审核
- **控制触发范围**：避免在每次 push 到每个分支时都触发全量审查（成本会很高）
- **使用仓库特定配置**：Claude 在 CI 环境中也会读取 `CLAUDE.md`，善用它来约束行为

### 费用参考

对于月均 50 个 PR 的小团队，每月 API 费用通常在 **$5 以内**。如果配置了对每次提交都进行全量分析，费用会显著增加，建议先从"仅审查 PR 中修改的文件"开始，再逐步扩大覆盖范围。

---

## 十、进阶功能详解

### Plan Mode：先想清楚再动手

Plan Mode 是一个**只读规划模式**。在此模式下，Claude 只会分析代码、提出问题、制定方案——**不会修改任何文件或执行任何命令**。

**如何使用：**
1. 按 **`Shift+Tab`** 切换到 Plan Mode（提示符下方显示 `⏸ plan mode on`）
2. 描述你想要完成的任务
3. Claude 会阅读相关文件、提出澄清问题、生成一份结构化的 Markdown 计划
4. 计划文件保存在 `~/.claude/plans/` 目录下，可以用 **`Ctrl+G`** 打开编辑
5. 确认计划后，再次按 **`Shift+Tab`** 退出 Plan Mode，Claude 会询问是否按计划执行

**适用场景：** 涉及多文件的复杂重构、探索不熟悉的代码库、需要团队评审的架构决策。对于简单的单文件修改或已知问题的 bug 修复，直接使用普通模式更高效。

### 三种交互模式一览

通过 `Shift+Tab` 在三种模式间循环切换：

1. **普通模式（默认）**：每次文件修改和命令执行都需你确认
2. **自动接受模式**：自动批准文件编辑，但命令执行仍需确认
3. **Plan 模式**：只分析不执行，生成计划文档

### 多会话并行：git worktree

当你需要同时处理多个独立任务时，可以使用 git worktree 功能让多个 Claude Code 会话并行运行，**每个会话都有自己独立的文件系统和分支**。

```bash
# 在一个终端窗口
claude --worktree feature-auth     # 在隔离的 worktree 中处理认证功能

# 在另一个终端窗口
claude --worktree bugfix-123       # 同时在另一个 worktree 中修复 bug
```

每个 worktree 会自动创建独立的工作目录和分支（命名为 `worktree-<名称>`）。会话结束时，如果没有改动，worktree 自动清理；有改动则会提示你选择保留或删除。

**实际建议：** 同时运行 **3-5 个并行 worktree** 是比较合理的上限。可以创建 `.worktreeinclude` 文件列出需要复制到新 worktree 的文件（如 `.env`）。

### 管理 Context Window（上下文窗口）

上下文窗口是 Claude 在一次对话中能"记住"的所有内容的总量。它包含对话历史、文件内容、命令输出、CLAUDE.md、系统指令等。标准窗口为 **200k tokens**，Opus 4.6 和 Sonnet 4.6 支持 **1M tokens**。

**核心管理策略：**

- **`/compact`**：手动压缩对话——Claude 会将旧消息总结为摘要，释放上下文空间。可以指定保留重点：`/compact 保留错误处理模式的讨论`
- **`/clear`**：完全清除对话历史（比 `/compact` 更彻底）
- **`/context`**：可视化查看上下文窗口的使用情况
- **自动压缩**：当上下文使用率接近 75-95% 时，Claude Code 会自动触发压缩（v2.0.64 起即时完成）
- **持久规则写入 CLAUDE.md**：不要把反复使用的指令放在对话中，写入 CLAUDE.md 可以跨会话保留且不占用对话上下文

### 常见错误与解决方法

| 问题 | 解决方案 |
|------|----------|
| 输入 `claude` 提示"command not found" | 安装目录未加入 PATH。运行安装脚本后重新打开终端 |
| 认证失败（401/403 错误） | 运行 `/logout`，重启 Claude Code，重新登录。用 `/doctor` 诊断 |
| 提示"This organization has been disabled" | 旧的 `ANTHROPIC_API_KEY` 环境变量覆盖了订阅认证。运行 `unset ANTHROPIC_API_KEY` |
| API 连接错误 | 检查网络连接；查看 status.anthropic.com 是否有服务故障 |
| 速率限制（529/503 错误） | 使用 `/status` 查看用量百分比和重置时间；等待几分钟后重试 |
| 上下文用尽、回答质量下降 | 运行 `/compact`；如多次压缩后仍变差，建议 `/exit` 后开启新会话 |
| MCP 服务器不显示 | 检查 JSON 配置语法；完全重启 Claude Code；用 `/mcp` 验证状态 |
| Windows 上 MCP 服务器"Connection closed" | 使用 `cmd /c` 包装器：`claude mcp add ... -- cmd /c npx -y @some/package` |
| Skill 安装后不出现 | 确认文件夹结构正确（需包含 `SKILL.md`）；检查 frontmatter 格式；重启 Claude Code |

**万能诊断命令：** 遇到任何问题，首先运行 `/doctor`，它会自动检查 API 连接、认证状态、Node.js 版本、MCP 配置等。

### 2025-2026 年重要新功能速览

**模型升级：**
- **Claude Opus 4 和 Sonnet 4**（2025 年 6 月）：支持扩展思考的混合推理模型，Claude Code 正式 GA
- **Claude Opus 4.6 和 Sonnet 4.6**（2026 年初）：**1M 上下文窗口**、自适应推理、最大输出 128k tokens

**交互增强：**
- **语音模式**（2026 年 3 月）：`/voice` 命令启用，按住空格说话，支持 20+ 种语言
- **任务列表**（2026 年 1 月）：持久化任务清单，跨会话保留，`Ctrl+T` 切换显示
- **自动记忆**（v2.1.59+）：Claude 自动从你的纠正中学习并保存经验

**开发集成：**
- **VS Code 扩展**（2025 年 9 月）：原生集成，内联 diff 查看，`Cmd+Esc` / `Ctrl+Esc` 快速启动
- **JetBrains 插件**：支持 IntelliJ、PyCharm、WebStorm 等全系列 IDE
- **GitHub Action**：基于 SDK 的 GitHub 自动化，支持 PR 审查、从 Issue 自动实现功能

**架构增强：**
- **Skills 系统**（2025 年秋）：SKILL.md 开放标准，跨 AI 工具通用，配套插件市场
- **Tool Search / 工具懒加载**（2026 年初）：MCP 工具按需加载，上下文消耗减少约 **95%**
- **子代理系统**：在 `.claude/agents/` 目录定义专用子代理，可自动选择最优模型
- **Hooks 系统**：`SessionStart`、`PreToolUse`、`PostToolUse` 等生命周期钩子，可触发自定义脚本
- **Channels（研究预览）**：MCP 服务器可主动推送消息到你的会话（CI 结果、监控告警等）

---

## 结语：从零到精通的学习路径

Claude Code 的功能体系庞大，但**入门只需三步：安装、认证、开始对话**。随着使用深入，逐步掌握 CLAUDE.md 编写、Skills 安装、模式切换、MCP 集成等进阶技能，你会发现它从一个简单的编程助手变成了一个能协调整个开发工作流的智能平台。

**推荐的渐进式学习路径：**

1. **第一周**：安装上手，用自然语言让 Claude 解释代码、修复小 bug、运行测试
2. **第二周**：运行 `/init` 生成项目 CLAUDE.md，开始添加项目规则；学习 `Shift+Tab` 模式切换和 `/compact`
3. **第三周**：安装 2-3 个常用 skills（如 `frontend-design`、`explain-code`）；尝试 Plan Mode 处理复杂任务
4. **第四周及以后**：配置 MCP 服务（从 GitHub 开始）；探索 git worktree 并行会话；编写自己的第一个自定义 Skill

最有效的学习策略是**从真实任务中学**——每次遇到反复输入相同指令的情况，就把它写成 Skill；每次 Claude 犯了某个项目特有的错误，就把规则写进 CLAUDE.md。Claude Code 会随着你的使用越来越懂你的工作方式。