# 查拉图的数字花园

基于 Hugo 和 PaperMod 的个人网站源码仓库。

## 本地开发

1. 初始化主题子模块：

   ```bash
   git submodule update --init --recursive
   ```

2. 启动本地预览：

   ```bash
   hugo server -D
   ```

3. 生成生产构建：

   ```bash
   hugo --gc --minify
   ```

`public/` 是构建产物，不再提交到仓库。

## 内容结构

- `content/posts/`：通用文章
- `content/posts/research/`：科研与开发栏目
- `content/posts/reading/`：阅读与思考栏目

## Vercel 部署

仓库使用 Vercel 作为唯一生产部署入口：

1. 将仓库连接到 Vercel。
2. 推送到 `main` 后，由 Vercel 自动拉取源码并构建生产版本。
3. 自定义域名、HTTPS 和重定向都在 Vercel 控制台管理。

仓库中的 `vercel.json` 固定了部署配置：

- `framework = hugo`
- `buildCommand = bash scripts/vercel-build.sh`
- `outputDirectory = public`

其中 `scripts/vercel-build.sh` 会在构建时做两件事：

- 显式初始化 `themes/PaperMod` 子模块
- 固定下载并使用 Hugo `0.157.0`，并兼容 Hugo release 包的新旧命名

这样可以同时避免 Vercel 漏拉主题子模块，或默认 Hugo 版本过旧导致主题构建失败。

建议保持 GitHub Pages 关闭状态，避免和 Vercel 的自定义域名、HTTPS 校验以及生产流量接管相互冲突。

## 自定义域名

- `www.chalatu.xyz`：直接绑定到 Vercel 生产环境
- `chalatu.xyz`：在 Vercel 中 307 重定向到 `www.chalatu.xyz`

这套流程比提交 `public/` 或同时保留 GitHub Pages 更稳妥，因为源码、构建入口和域名托管都只保留一套权威配置。
