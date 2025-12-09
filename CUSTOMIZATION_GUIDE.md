# 博客自定义指南

## 📝 网站基本信息

### 1️⃣ 网站标题、描述、作者信息
**文件：** `src/config/client.ts`

```typescript
const configClientData: ConfigClientType = {
  // 网站标题
  SITE_TITLE: 'Nemanja Mitic',  // ← 改成你的名字

  // 网站描述（用于 SEO）
  SITE_DESCRIPTION: 'I am Nemanja, a full stack developer',  // ← 改成你的简介

  // 规范 URL（生产环境的域名）
  SITE_URL_CANONICAL: 'https://nemanjamitic.com',  // ← 改成你的域名

  // 作者信息
  AUTHOR_NAME: 'Nemanja Mitic',  // ← 你的名字
  AUTHOR_EMAIL: 'nemanja.mitic.elfak@hotmail.com',  // ← 你的邮箱
  AUTHOR_GITHUB: 'https://github.com/nemanjam',  // ← 你的 GitHub
  AUTHOR_LINKEDIN: 'https://www.linkedin.com/in/nemanja-mitic',  // ← 你的 LinkedIn
  AUTHOR_TWITTER: 'https://x.com/nemanja_codes',  // ← 你的 Twitter
  AUTHOR_YOUTUBE: 'https://www.youtube.com/@nemanja_codes',  // ← 你的 YouTube

  // 仓库地址
  REPO_URL: 'https://github.com/nemanjam/nemanjam.github.io',  // ← 你的仓库地址
};
```

## 🖼️ Logo / 头像

### 2️⃣ 更换头像图片
**位置：** `src/assets/images/avatar.jpg`

**步骤：**
1. 准备一张正方形图片（推荐 200x200px 或更大）
2. 替换 `src/assets/images/avatar.jpg` 文件
3. 保持文件名为 `avatar.jpg`，或者修改 `src/components/Header.astro` 中的引用

**Header.astro 中的引用：**
```typescript
// 第 15 行
import Avatar from '@/assets/images/avatar.jpg';
```

## 🧭 导航菜单

### 3️⃣ 修改导航链接
**文件：** `src/constants/navigation.ts`

```typescript
export const NAVIGATION_ITEMS = [
  {
    title: 'Blog',      // ← 导航项名称
    path: ROUTES.BLOG,  // ← 路径
  },
  {
    title: 'Explore',
    path: ROUTES.EXPLORE,
  },
  {
    title: 'Projects',
    path: ROUTES.PROJECTS,
  },
  {
    title: 'About',
    path: ROUTES.ABOUT,
  },
  {
    title: 'Gallery',
    path: ROUTES.GALLERY,
  },
  {
    title: 'Links',
    path: ROUTES.LINKS,
  },
  // 取消注释可以添加更多导航项
  // {
  //   title: 'Resume',
  //   path: ROUTES.RESUME,
  // },
] as const;
```

**可以做的修改：**
- ✏️ 修改 `title` 改变导航项的显示文字
- 🗑️ 删除整个对象来移除导航项
- ➕ 添加新的导航项（注释掉的可以取消注释）
- 🔀 调整顺序（拖动对象位置）

## 👣 页脚

### 4️⃣ 页脚社交链接
**文件：** `src/components/Footer.astro`

页脚会自动从 `src/config/client.ts` 读取以下信息：
- Email (`AUTHOR_EMAIL`)
- GitHub (`AUTHOR_GITHUB`)
- LinkedIn (`AUTHOR_LINKEDIN`)
- RSS Feed（自动生成）

**如果要修改页脚布局或添加新的社交链接：**
编辑 `src/components/Footer.astro` 的第 46-100 行。

例如添加 Twitter：
```astro
<li>
  <Link
    href={AUTHOR_TWITTER}
    target="_blank"
    rel="me noreferrer noopener"
    title={`${firstName} on Twitter`}
    class="flex items-center gap-2 text-base xs:text-lg"
    variant="nav"
  >
    <Icon name="mdi:twitter" class="h-6 w-6 fill-current" />
    <span>Twitter</span>
  </Link>
</li>
```

## 🔍 SEO 优化

### 5️⃣ 默认 SEO 元数据
**文件：** `src/constants/metadata.ts`

查看和修改默认的 SEO 信息（标题、描述、OG 图片）。

### 6️⃣ Open Graph 图片
**默认图片：** `public/images/default/default-open-graph-image.jpg`

这是社交媒体分享时显示的默认图片。替换这个文件可以自定义分享卡片的外观。

**推荐尺寸：** 1200x630px

## 🎨 网站图标 (Favicon)

**位置：** `public/` 目录

需要替换的文件：
- `favicon.ico` - 浏览器标签图标
- `images/favicons/favicon-16x16.png`
- `images/favicons/favicon-32x32.png`
- `images/favicons/apple-touch-icon.png` - iOS 主屏幕图标

**生成工具推荐：** https://realfavicongenerator.net/

## 📄 关于页面

### 7️⃣ 修改关于页面内容
**文件：** `src/pages/about.mdx`

直接编辑这个 MDX 文件来更新你的个人介绍。

## 🎯 快速自定义清单

完成以下步骤即可完成基本自定义：

- [ ] 修改 `src/config/client.ts` 中的所有个人信息
- [ ] 替换 `src/assets/images/avatar.jpg` 头像
- [ ] 修改 `src/constants/navigation.ts` 导航菜单
- [ ] 更新 `src/pages/about.mdx` 关于页面
- [ ] 替换 `public/favicon.ico` 和相关图标
- [ ] 替换 `public/images/default/default-open-graph-image.jpg` OG 图片
- [ ] 更新 `.env.production` 中的 `SITE_URL`（如果有自定义域名）
- [ ] 更新 `netlify.toml` 中的 `SITE_URL`（如果有自定义域名）

## 🚀 提交更改

修改完成后：

```bash
# 查看更改
git status

# 添加所有更改
git add .

# 提交
git commit -m "Customize blog with my information"

# 推送到 GitHub
git push
```

Netlify 会自动重新部署你的网站！

## 💡 其他自定义

### 主题颜色
**文件：** `src/styles/theme/`

### 字体
**文件：** `tailwind.config.ts`

### 其他配置
浏览 `src/config/` 和 `src/constants/` 目录查看更多可配置项。

---

有问题随时查看这个文档！🎉
