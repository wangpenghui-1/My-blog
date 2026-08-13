+++
title = "Content Studio 0.2 验收测试：本地发布闭环"
date = "2026-08-13T19:50:14+08:00"
draft = false
publishDate = "2026-08-13T19:50:14+08:00"
summary = "用于验证 Content Studio 0.2 的 Hugo 构建、精确 Git 提交、Vercel 部署与图片可访问性。"
tags = ["Content Studio", "验收测试"]
+++

**数据时效：2026-08**
这是一篇明确标记的技术验收文章，不是正式内容发布。它用于确认 Content Studio 能把本地 Markdown 安全转换为 Hugo 文章，并只提交与本篇测试直接相关的文件。

![ai-agent-guide-workflow](/images/posts/content-studio-0-2-acceptance-test-20260813/ai-agent-guide-workflow.png)

验收范围包括：Hugo 构建通过、Git 精确暂存、远端提交可追踪、Vercel 部署 commit 一致、正式页面与图片均可访问。

本次测试不会创建微信公众号草稿，不会触发群发，也不会移动公众号源稿。
