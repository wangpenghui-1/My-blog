# 英雄页设计规格 — 查拉图的数字花园

**日期:** 2026-03-31  
**状态:** 已批准，待实施

---

## 一、目标

将博客首页改造为全屏视频英雄页（Hero Section），用户进入网站后首先看到高冲击力的全屏封面，向下滚动后进入文章列表。风格参考高端商业落地页设计语言，调性定位为「哲学 · 极简 · 高级感」。

---

## 二、实施方案

**方案：覆盖 `layouts/index.html`（Hugo 项目级覆盖）**

- 在项目根目录 `layouts/index.html` 创建新文件，完全接管首页渲染
- Hugo 的 lookup order 优先使用项目级 layouts，主题文件不做任何修改
- 英雄页为全屏独立首屏，文章列表紧随其后（同一页面，向下滚动可达）

---

## 三、视觉设计规格

### 3.1 整体结构

```
┌─────────────────────────────────────┐  ← 100vh
│  透明导航栏                          │
│                                     │
│         [液态玻璃徽章]               │
│                                     │
│         查拉图的          ← Barlow light 72px
│         数字花园          ← Instrument Serif italic 76px
│                                     │
│    探索哲学边界，记录一人公司的真实路径  │ ← 副标题
│                                     │
│    [开始探索 | 进入花园 →]  [关于我]  │ ← 液态玻璃按钮
│                                     │
│              ↓ Scroll               │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  文章列表（PaperMod 原有渲染逻辑）     │
└─────────────────────────────────────┘
```

### 3.2 背景

- **视频:** `<video autoplay loop muted playsinline>`，`object-fit: cover`，覆盖整个视口
- **临时视频 URL:** `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4`（待用户替换为自有视频）
- **无色彩叠加层**，无滤镜，视频原色直出
- **降级方案:** 视频加载失败时显示纯黑背景 `#000`

### 3.3 透明导航栏

- 无背景填充，无边框
- Logo：`查拉图的数字花园`，Barlow 400，`rgba(255,255,255,0.85)`
- 导航链接：`哲学与思考` / `一人公司`，字号 13px，`rgba(255,255,255,0.6)`
- Hover 状态：`rgba(255,255,255,0.07)` 背景，圆角 8px，文字变为 `rgba(255,255,255,0.9)`
- 链接数据来源：`hugo.toml` 的 `[[menu.main]]` 配置，动态渲染

### 3.4 液态玻璃徽章

```
外圈: background rgba(255,255,255,0.07) | backdrop-filter blur(6px)
      border 1px solid rgba(255,255,255,0.12) | border-radius 28px
      padding 5px 6px | inset box-shadow rgba(255,255,255,0.04)

内圈: background rgba(255,255,255,0.9) | backdrop-filter blur(12px)
      border-radius 22px | padding 5px 20px
      font-size 11px | color #0a0a0a | letter-spacing 0.14em
      text: "Philosophy · Ideas · Solo"
```

### 3.5 标题排版

| 行 | 字体 | 字重 | 字号 | 颜色 |
|---|---|---|---|---|
| 第一行：查拉图的 | Barlow | 300 (Light) | 72px | #fff |
| 第二行：数字花园 | Instrument Serif | Italic | 76px | #fff |

- 行高 1.05，居中对齐
- 字间距 -0.01em（微收紧）
- 两行之间无额外间距，视觉上形成一个整体

### 3.6 副标题

- 字体：Barlow 300
- 字号：15px，行高 1.8，letter-spacing 0.04em
- 颜色：`rgba(255,255,255,0.5)`
- 最大宽度：360px，居中

### 3.7 液态玻璃 CTA 按钮

**主按钮（进入花园）：**
```
整体: background rgba(255,255,255,0.08) | backdrop-filter blur(16px)
      border 1px solid rgba(255,255,255,0.18) | border-radius 28px
      padding 5px 6px 5px 20px | box-shadow 0 8px 32px rgba(0,0,0,0.3)

左侧文字: "开始探索" | Barlow 400 | rgba(255,255,255,0.9) | letter-spacing 0.06em
右侧胶囊: "进入花园 →" | background rgba(255,255,255,0.88) | border-radius 20px
           padding 6px 16px | font-size 12px | color #0a0a0a

Hover: background rgba(255,255,255,0.13) | border-color rgba(255,255,255,0.28)
```

**次按钮（关于我）：**
```
整体: background rgba(255,255,255,0.05) | backdrop-filter blur(12px)
      border 1px solid rgba(255,255,255,0.1) | border-radius 28px
      padding 12px 24px

文字: "关于我" | Barlow 300 | rgba(255,255,255,0.65) | letter-spacing 0.06em

Hover: background rgba(255,255,255,0.09) | border-color rgba(255,255,255,0.18)
```

### 3.8 滚动指示器

- 文字 "SCROLL"，9px，letter-spacing 0.28em，`rgba(255,255,255,0.2)`
- 细线：1px 宽，40px 高，从 `rgba(255,255,255,0.3)` 渐变至透明
- 动画：垂直浮动，2.4s 循环，`ease-in-out`

### 3.9 字体加载

通过 Google Fonts 引入，写在 `layouts/index.html` 的 `<head>` 块中：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
```

---

## 四、文章列表区

- 紧接英雄页之下，同一 HTML 页面
- 复用 PaperMod 原有的文章列表渲染逻辑（从主题 `list.html` 移植 `$paginator` 相关代码）
- 背景色 `#080808`（略亮于英雄页的纯黑，形成细微层次）
- 顶部有 "最新文章" 标签行，字号 9px，letter-spacing 0.32em，`rgba(255,255,255,0.2)`
- 每篇文章：标题左对齐 + 日期右对齐，底部 1px 分隔线
- 文章标题 hover：向右位移 8px（`padding-left` transition），颜色变为 `rgba(255,255,255,0.95)`

---

## 五、文件变更清单

| 操作 | 文件路径 | 说明 |
|---|---|---|
| 新建 | `layouts/index.html` | 首页模板，完全覆盖主题的 `list.html` |
| 内联 | `layouts/index.html` 内的 `<style>` 块 | 英雄页专属样式，内联于模板避免额外文件依赖 |
| 不改动 | `themes/PaperModLocal/` 下所有文件 | 主题保持原样 |

---

## 六、技术约束

- Hugo v0.157.0 Extended，无 Node.js 构建步骤
- 样式写在 `assets/css/extended/` 下（PaperMod 会自动合并）或内联在模板中
- 视频文件为临时外链，后续替换时只需修改 `<source src="...">` 属性
- 移动端需要处理视频自动播放限制（iOS Safari 要求 `playsinline` + `muted`，已包含）
- 不引入任何 JavaScript 框架，纯原生实现
