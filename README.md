# 查拉图的数字花园

基于 Hugo 和 PaperMod 的个人网站源码仓库。

## 本地开发

1. 启动本地预览：

   ```bash
   hugo server -D
   ```

2. 生成生产构建：

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
- `buildCommand = hugo --gc --minify`
- `outputDirectory = public`

仓库内已经直接包含 `themes/PaperModLocal/`，部署不再依赖 Git submodule。

建议保持 GitHub Pages 关闭状态，避免和 Vercel 的自定义域名、HTTPS 校验以及生产流量接管相互冲突。

## 自定义域名

- `www.chalatu.xyz`：直接绑定到 Vercel 生产环境
- `chalatu.xyz`：在 Vercel 中 307 重定向到 `www.chalatu.xyz`

这套流程比提交 `public/` 或同时保留 GitHub Pages 更稳妥，因为源码、构建入口和域名托管都只保留一套权威配置。
