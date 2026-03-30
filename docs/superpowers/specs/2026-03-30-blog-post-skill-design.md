# Blog Post Skill Design

**Date:** 2026-03-30
**Project:** 查拉图的数字花园 (Hugo blog)
**Status:** Approved

---

## Overview

A Claude Code skill (`blog-post`) that acts as an AI blog manager: accepts a topic and parameters, generates a full Chinese-language blog post in the existing style, writes the file to the correct content directory, and pushes directly to GitHub.

---

## Trigger Modes

### Command Mode (`/blog-post`)
Structured interactive flow. Claude asks sequentially:
1. Article topic / core idea
2. Target section: 哲学与思考 or 一人公司
3. Tags (e.g. `["AI", "哲学"]`)
4. Cover image path (optional — omit field if skipped)

### Natural Language Mode
User describes what they want in plain text. Claude infers section and topic from context. Missing info is collected in a single follow-up question.

---

## Article Generation Spec

### Frontmatter (TOML)
```toml
+++
title = "文章标题"
date = "YYYY-MM-DDTHH:MM:SS+08:00"
draft = false
summary = "一句话摘要，概括核心观点"
tags = ["标签1", "标签2"]
cover = "posts/philosophy/image/xxx.jpg"  # omit if no cover
+++
```

### Writing Style
Based on analysis of existing posts:
- Open with a block-quote (`>`) as an epigraph
- Use `##` sections, each 300–600 characters
- Opinionated and contemplative — takes a stance, avoids encyclopedic listing
- Written entirely in Chinese; technical terms may include English in parentheses
- Typical length: 1500–3000 characters

### File Naming
Pattern: `YYYY-MM-DD-<slug>.md`
Slug: English keywords or pinyin abbreviation of the topic.

### File Paths
| Section | Path |
|---|---|
| 哲学与思考 | `content/posts/philosophy/` |
| 一人公司 | `content/posts/solo-company/` |

---

## Auto-Publish Flow

After writing the file:
```bash
git add content/posts/<section>/<filename>.md
git commit -m "feat: 发布《文章标题》"
git push origin main
```

### Error Handling
- **Push fails:** Report error with the exact command for the user to run manually. Do not retry.
- **File already exists:** Append a short suffix (e.g. `-2`) to the filename to avoid overwriting.

---

## Out of Scope
- Image generation or upload
- Scheduled posting
- Draft/preview mode (fully automatic by design)
- Multi-language support
