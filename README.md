# 查拉图的数字花园

基于 Hugo 和 PaperMod 的个人网站源码仓库。

## 本地开发

1. 启动本地预览：

   ```bash
   hugo server -D --disableFastRender --renderToMemory --navigateToChanged
   ```

2. 生成生产构建：

   ```bash
   hugo --gc --minify --destination .codex-review-public
   ```

`public/` 是构建产物，不再提交到仓库。

## Cursor 任务

仓库内已经提供可点击的 Cursor / VS Code 任务，打开命令面板后运行 `Tasks: Run Task` 即可：

- `Preview: Hugo Dev Server`：启动本地开发服务器
- `Preview: Open Local Site`：在系统浏览器打开 `http://localhost:1313/`
- `Preview: Start + Open Browser`：先启动预览，再自动打开本地站点
- `Review: Production Build`：执行接近 Vercel 的生产构建，输出到 `.codex-review-public/`
- `Clean: Review Output`：清理本地审查产物
- `Content: New Post Draft`：输入文章路径后创建草稿

如果需要在 Cursor 内嵌预览，可以安装工作区推荐扩展 `Browse Lite`，再打开 `http://localhost:1313/`。

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

- `buildCommand = bash scripts/vercel-build.sh`
- `outputDirectory = public`

仓库内已经直接包含 `themes/PaperModLocal/`，部署不再依赖 Git submodule。

`scripts/vercel-build.sh` 会在 Vercel 构建时固定使用 Hugo `0.157.0`。这里故意不再声明 `framework = hugo`，避免 Vercel 自动注入较旧的 Hugo 版本。

建议保持 GitHub Pages 关闭状态，避免和 Vercel 的自定义域名、HTTPS 校验以及生产流量接管相互冲突。

## 自定义域名

- `www.chalatu.xyz`：直接绑定到 Vercel 生产环境
- `chalatu.xyz`：在 Vercel 中 307 重定向到 `www.chalatu.xyz`

这套流程比提交 `public/` 或同时保留 GitHub Pages 更稳妥，因为源码、构建入口和域名托管都只保留一套权威配置。
