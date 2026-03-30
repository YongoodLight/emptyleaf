# emptyleaf.studio

一个零依赖的静态个人工作室网站。当前目录里的文件可以直接作为 GitHub Pages 的发布源。

当前默认访问地址：

- `https://yongoodlight.github.io/emptyleaf/`

## 文件说明

- `index.html`: 页面结构
- `styles.css`: 页面样式
- `content.js`: 站点内容配置
- `main.js`: 内容渲染与滚动动效
- `robots.txt` / `sitemap.xml`: 基础 SEO 文件

## 当前先用 GitHub Pages 地址

仓库发布后，可以先直接使用：

- `https://yongoodlight.github.io/emptyleaf/`

## 以后再接 `https://emptyleaf.studio`

最省事的方式是使用 GitHub Pages。

1. 创建一个 GitHub 仓库，并把当前目录全部推上去。
2. 在仓库的 `Settings > Pages` 中，把发布方式设成 `Deploy from a branch`。
3. 选择默认分支，例如 `main`，目录选择 `/(root)`。
4. 在同一个页面的 `Custom domain` 中填写 `emptyleaf.studio`。
5. 到你的域名服务商后台配置 DNS。

建议的 GitHub Pages DNS 记录：

- `A` 记录 `@` 指向 `185.199.108.153`
- `A` 记录 `@` 指向 `185.199.109.153`
- `A` 记录 `@` 指向 `185.199.110.153`
- `A` 记录 `@` 指向 `185.199.111.153`
- `AAAA` 记录 `@` 指向 `2606:50c0:8000::153`
- `AAAA` 记录 `@` 指向 `2606:50c0:8001::153`
- `AAAA` 记录 `@` 指向 `2606:50c0:8002::153`
- `AAAA` 记录 `@` 指向 `2606:50c0:8003::153`
- `CNAME` 记录 `www` 指向 `<你的 GitHub 用户名>.github.io`

补充说明：

- 如果你切回自定义域名，需要重新加入 `CNAME` 文件，内容写成 `emptyleaf.studio`。
- 如果你以后改用 GitHub Actions 发布，仍然需要在 GitHub Pages 设置页里手动填自定义域名。
- DNS 生效和 HTTPS 签发通常需要一点时间，最长可能接近 24 小时。

## 如何继续改内容

你主要只需要编辑 `content.js`：

- 改 `profile` 里的名字、简介、联系方式
- 改 `services` 里的服务内容
- 改 `projects` 里的案例
- 改 `timeline` 里的经历

如果你希望，我可以继续把这份模板改成更像你的真实个人网站版本。
