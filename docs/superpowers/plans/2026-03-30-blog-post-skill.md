# Blog Post Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Claude Code skill (`blog-post`) that generates a Chinese Hugo blog post and auto-pushes it to GitHub in a single command.

**Architecture:** A single `SKILL.md` file installed at `~/.claude/skills/blog-post/SKILL.md`. The skill defines two trigger modes (command `/blog-post` and natural language), full article generation instructions, and the git publish flow. No helper scripts needed — Claude executes all steps via its built-in tools (Write, Bash).

**Tech Stack:** Claude Code skills (Markdown), Hugo (static site), Git, GitHub

---

### Task 1: Create the skill file

**Files:**
- Create: `C:/Users/20376/.claude/skills/blog-post/SKILL.md`

- [ ] **Step 1: Write the SKILL.md file**

Write the following content to `C:/Users/20376/.claude/skills/blog-post/SKILL.md`:

```markdown
---
name: blog-post
description: Use when the user asks to write or publish a blog post to 查拉图的数字花园. Supports /blog-post command and natural language requests like "帮我写一篇关于XXX的文章".
---

# Blog Post — AI 博客管理助手

## 概述

你是查拉图数字花园的博客管理助手。你的任务是：接收用户输入 → 生成高质量中文博客文章 → 写入 Hugo 内容目录 → 推送到 GitHub。

**全自动流程，无需用户二次确认。**

---

## 触发方式

### 命令模式（`/blog-post`）

触发后，**按顺序**逐一询问以下信息（一次只问一个）：

1. **主题**：这篇文章的核心观点或论题是什么？
2. **板块**：发布到哪个板块？
   - `1` — 哲学与思考（`content/posts/philosophy/`）
   - `2` — 一人公司（`content/posts/solo-company/`）
3. **Tags**：请提供 1-3 个标签（如：`AI, 哲学, 尼采`）
4. **封面图**（可选）：请提供封面图相对路径，或直接回车跳过

收集完毕后，直接进入文章生成，不再询问。

### 自然语言模式

用户直接描述需求时（如"帮我写一篇关于孤独的哲学文章"），从描述中推断：
- **主题**：从描述中提取
- **板块**：根据关键词判断（哲学/思考/存在/意义 → 哲学与思考；创业/独立/产品/工具/AI助手 → 一人公司）
- **Tags**：根据主题自动生成 2-3 个

缺失 tags 时自动补全，**不再额外询问**。只有在板块完全无法判断时，才询问一次。

---

## 文章生成规范

### Frontmatter 格式（TOML）

```toml
+++
title = "文章标题"
date = "YYYY-MM-DDTHH:MM:SS+08:00"
draft = false
summary = "一句话摘要，直接点出核心观点，30字以内"
tags = ["标签1", "标签2"]
cover = "posts/philosophy/image/xxx.jpg"
+++
```

- `date` 使用当前日期和时间（北京时间 UTC+8）
- `cover` 字段：用户提供了路径才加，否则**省略此字段**
- `tags` 用方括号数组格式

### 写作风格（严格遵守）

基于博客现有文章风格：

1. **开篇**：必须以一个 `>` 块引用作为题词/引言，1-2 句，点明全文气质
2. **分节**：用 `##` 分节，3-5 节，每节 400-700 字
3. **立场鲜明**：敢于提出主张，不做百科式罗列；用"我认为"、"这意味着"、"但问题在于"等
4. **叙事感**：结合个人体验或具体案例，避免纯抽象论述
5. **语言**：全程简体中文；专业术语可附英文，如"存在主义（Existentialism）"
6. **长度**：1800-3000 字

### 文件命名

格式：`YYYY-MM-DD-<slug>.md`

slug 规则：用主题的英文关键词（2-4个单词，小写，连字符分隔）。
例：主题"孤独与自我" → `2026-03-30-solitude-and-self.md`

### 存放路径

| 板块 | 路径 |
|------|------|
| 哲学与思考 | `content/posts/philosophy/` |
| 一人公司 | `content/posts/solo-company/` |

---

## 发布流程

文章文件写入后，执行以下命令：

```bash
git add content/posts/<section>/<filename>.md
git commit -m "feat: 发布《文章标题》"
git push origin main
```

### 错误处理

- **文件已存在**：在文件名末尾加 `-2`（如 `2026-03-30-solitude-and-self-2.md`），重新写入
- **git push 失败**：报告错误信息，告知用户手动运行以下命令：
  ```bash
  git push origin main
  ```
  不重试，不强推。

---

## 完成后输出

Push 成功后，输出：

```
✅ 文章已发布
标题：《文章标题》
板块：哲学与思考 / 一人公司
文件：content/posts/<section>/<filename>.md
```
```

- [ ] **Step 2: Verify the file was written**

Run:
```bash
cat "C:/Users/20376/.claude/skills/blog-post/SKILL.md" | head -10
```
Expected: Shows the YAML frontmatter with `name: blog-post`

- [ ] **Step 3: Commit the plan and design doc**

```bash
cd D:/myweb/my-blog && git add docs/superpowers/ && git commit -m "docs: add blog-post skill design spec and implementation plan"
```

---

### Task 2: Verify skill is discoverable

**Files:**
- Read: `C:/Users/20376/.claude/settings.json`

- [ ] **Step 1: Check if user-level skills directory is picked up automatically**

Run:
```bash
ls "C:/Users/20376/.claude/skills/"
```
Expected: `blog-post` directory listed

- [ ] **Step 2: Test skill in a new conversation**

Start a new Claude Code session and type `/blog-post`. Verify Claude responds with the first question (主题).

If the skill does not load, check that the `SKILL.md` frontmatter matches the format used by other skills in `C:/Users/20376/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.6/skills/`.

---

### Task 3: Smoke test — write and publish a test post

- [ ] **Step 1: Trigger the skill in command mode**

In a Claude Code session, run `/blog-post` and provide:
- 主题: 测试文章，请立即删除
- 板块: 1（哲学与思考）
- Tags: 测试
- 封面图: （跳过）

- [ ] **Step 2: Verify file was created**

```bash
ls D:/myweb/my-blog/content/posts/philosophy/ | grep $(date +%Y-%m-%d)
```
Expected: New `.md` file with today's date

- [ ] **Step 3: Verify frontmatter**

```bash
head -10 D:/myweb/my-blog/content/posts/philosophy/$(ls D:/myweb/my-blog/content/posts/philosophy/ | grep $(date +%Y-%m-%d) | tail -1)
```
Expected: Valid TOML frontmatter with title, date, draft=false, summary, tags

- [ ] **Step 4: Verify git push succeeded**

```bash
cd D:/myweb/my-blog && git log --oneline -3
```
Expected: Latest commit starts with `feat: 发布《`

- [ ] **Step 5: Delete the test post**

```bash
cd D:/myweb/my-blog && git rm content/posts/philosophy/*test* 2>/dev/null || true && git commit -m "chore: remove test post" && git push origin main
```
