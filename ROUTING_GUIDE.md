# 路由和内容管理完整指南

## 📚 目录
1. [路由系统工作原理](#路由系统工作原理)
2. [页面位置和修改方法](#页面位置和修改方法)
3. [分类 (Categories) 管理](#分类-categories-管理)
4. [标签 (Tags) 管理](#标签-tags-管理)
5. [动态路由](#动态路由)
6. [创建新页面](#创建新页面)

---

## 🛣️ 路由系统工作原理

### 路由定义位置
**文件：** `src/constants/routes.ts`

```typescript
export const ROUTES = {
  HOME: '/',              // 首页
  BLOG: '/blog/',         // 博客列表
  PROJECTS: '/projects/', // 项目列表
  ABOUT: '/about/',       // 关于页面
  TAGS: '/blog/tags/',    // 标签索引
  CATEGORIES: '/blog/categories/', // 分类索引
  EXPLORE: '/blog/explore/',       // 探索页面
  GALLERY: '/gallery/',   // 图片画廊
  LINKS: '/links/',       // 链接页面
  // ... 更多路由
}
```

### Astro 路由规则

Astro 使用**基于文件的路由**：

| 文件路径 | 生成的 URL | 说明 |
|---------|-----------|------|
| `src/pages/index.mdx` | `/` | 首页 |
| `src/pages/about.mdx` | `/about/` | 关于页面 |
| `src/pages/blog/[slug].astro` | `/blog/文章slug/` | 动态文章页面 |
| `src/pages/blog/[...page].astro` | `/blog/`, `/blog/2/` 等 | 分页列表 |

---

## 📄 页面位置和修改方法

### 静态页面（直接编辑内容）

| 页面 | 文件位置 | 格式 | 说明 |
|------|---------|------|------|
| **首页** | `src/pages/index.mdx` | MDX | 首页内容 |
| **关于** | `src/pages/about.mdx` | MDX | 个人简介 |
| **简历** | `src/pages/resume.mdx` | MDX | 个人简历 |
| **图片画廊** | `src/pages/gallery.mdx` | MDX | 图片展示 |
| **404 页面** | `src/pages/404.mdx` | MDX | 错误页面 |

**修改方法：** 直接编辑对应的 `.mdx` 文件

**示例 - 修改关于页面：**
```bash
# 编辑文件
code src/pages/about.mdx

# 使用 Markdown 语法编写内容
---
title: 关于我
---

# 关于我

这里写你的个人简介...
```

### 动态页面（由代码生成）

| 页面 | 文件位置 | 说明 |
|------|---------|------|
| **博客文章** | `src/pages/blog/[slug].astro` | 从 `src/content/post/` 读取内容 |
| **项目详情** | `src/projects/[slug].astro` | 从 `src/content/project/` 读取内容 |
| **博客列表** | `src/pages/blog/[...page].astro` | 自动分页 |
| **项目列表** | `src/pages/projects/[...page].astro` | 自动分页 |

**修改方法：** 修改对应的内容文件

---

## 🏷️ 分类 (Categories) 管理

### 分类定义位置
**文件：** `src/constants/collections.ts` (第 34-69 行)

```typescript
export const CATEGORIES = [
  {
    name: 'tutorials',              // 分类名称（URL 中使用）
    icon: 'mdi:teach',              // 图标
  },
  {
    name: 'homelab',
    icon: 'mdi:flask-empty-outline',
  },
  // ... 更多分类
] as const;
```

### 如何添加新分类

**步骤 1: 在 `src/constants/collections.ts` 中添加**
```typescript
export const CATEGORIES = [
  // ... 现有分类
  {
    name: 'my-new-category',        // ← 新分类名称
    icon: 'mdi:star',               // ← 选择图标
  },
] as const;
```

**步骤 2: 在文章中使用**
```yaml
---
title: 我的文章
category: my-new-category  # ← 使用新分类
tags: [react, javascript]
---
```

### 分类页面是自动生成的！

**关键文件：** `src/pages/blog/categories/[category]/[...page].astro`

**工作原理：**
1. Astro 扫描所有文章的 `category` 字段
2. 自动为每个分类创建页面：
   - `/blog/categories/tutorials/`
   - `/blog/categories/homelab/`
   - `/blog/categories/my-new-category/` ← 自动创建！
3. 包含该分类的所有文章会显示在对应页面

**你不需要手动创建分类页面！** ✨

### 分类索引页面
**文件：** `src/pages/blog/categories/index.astro`

显示所有分类的列表页面，**自动统计**每个分类的文章数量。

---

## 🔖 标签 (Tags) 管理

### 标签定义位置
**文件：** `src/constants/collections.ts` (第 17-30 行)

```typescript
export const TAGS = [
  'next.js',
  'react',
  'astro',
  'node.js',
  'javascript',
  'css',
  'python',
  'devops',
  'docker',
  'self-hosting',
  'algorithms',
  'computer-science',
] as const;
```

### 如何添加新标签

**步骤 1: 在 `src/constants/collections.ts` 中添加**
```typescript
export const TAGS = [
  // ... 现有标签
  'typescript',    // ← 添加新标签
  'vue',
  'svelte',
] as const;
```

**步骤 2: 在文章中使用（可以使用多个标签）**
```yaml
---
title: 我的文章
category: tutorials
tags: [react, typescript, javascript]  # ← 使用多个标签
---
```

### 标签页面也是自动生成的！

**关键文件：** `src/pages/blog/tags/[tag]/[...page].astro`

**工作原理：**
1. Astro 扫描所有文章的 `tags` 字段
2. 自动为每个标签创建页面：
   - `/blog/tags/react/`
   - `/blog/tags/typescript/` ← 自动创建！
3. 包含该标签的所有文章会显示在对应页面

### 标签索引页面
**文件：** `src/pages/blog/tags/index.astro`

显示所有标签的列表页面，**自动统计**每个标签的文章数量。

---

## 🔄 动态路由详解

### 1. 文章详情页 (`/blog/[slug]`)

**文件：** `src/pages/blog/[slug].astro`

**URL 示例：** `/blog/2025-04-02-astro-react-gallery/`

**工作流程：**
```
1. 读取 src/content/post/**/*.mdx
2. 提取文章 slug (如: 2025-04-02-astro-react-gallery)
3. 自动生成路由 /blog/{slug}/
4. 渲染文章内容
```

### 2. 分页列表 (`/blog/[...page]`)

**文件：** `src/pages/blog/[...page].astro`

**URL 示例：**
- `/blog/` - 第 1 页
- `/blog/2/` - 第 2 页
- `/blog/3/` - 第 3 页

**分页配置：** `src/config/client.ts`
```typescript
PAGE_SIZE_POST_CARD: 3,  // 每页显示 3 篇文章
```

### 3. 探索页面 (`/blog/explore/[...filter]/[...page]`)

**文件：** `src/pages/blog/explore/[...filter]/[...page].astro`

**URL 示例：**
- `/blog/explore/tags/react/` - 按标签筛选
- `/blog/explore/categories/tutorials/` - 按分类筛选
- `/blog/explore/tags/react/2/` - 带分页

**功能：** 组合标签和分类的高级筛选页面

---

## ➕ 创建新页面

### 方法 1: 创建简单的静态页面

**步骤：**

1. **在 `src/pages/` 创建文件**
```bash
# 创建新页面
touch src/pages/contact.mdx
```

2. **编写内容**
```markdown
---
title: 联系我
description: 联系方式
---

# 联系我

邮箱: your@email.com
```

3. **添加到导航** (可选)

编辑 `src/constants/routes.ts`:
```typescript
export const ROUTES = {
  // ... 现有路由
  CONTACT: '/contact/',  // ← 添加新路由
}
```

编辑 `src/constants/navigation.ts`:
```typescript
export const NAVIGATION_ITEMS = [
  // ... 现有导航
  {
    title: 'Contact',
    path: ROUTES.CONTACT,
  },
]
```

4. **访问页面：** `http://localhost:3000/contact/`

### 方法 2: 创建带布局的页面

```astro
---
// src/pages/services.astro
import BaseLayout from '@/layouts/Base.astro';
---

<BaseLayout metadata={{ title: '服务', description: '我的服务' }}>
  <h1>我的服务</h1>
  <p>这里是服务内容...</p>
</BaseLayout>
```

---

## 📝 内容管理工作流

### 写文章的完整流程

1. **在 `src/content/post/` 创建文件夹**
```bash
mkdir -p src/content/post/2025/12-08-my-new-post
```

2. **创建 `index.mdx`**
```bash
touch src/content/post/2025/12-08-my-new-post/index.mdx
```

3. **编写文章**
```yaml
---
type: post
title: 我的新文章
description: 文章描述
publishDate: 2025-12-08
category: tutorials
tags: [react, javascript]
draft: false
---

# 我的新文章

这里写文章内容...
```

4. **自动生成路由**
- 文章页面：`/blog/2025-12-08-my-new-post/`
- 自动加入博客列表：`/blog/`
- 自动加入分类页面：`/blog/categories/tutorials/`
- 自动加入标签页面：`/blog/tags/react/`

**完全自动化，无需手动配置！** 🎉

---

## 🎯 快速参考

### 修改网站内容速查表

| 要修改的内容 | 文件位置 |
|------------|---------|
| **导航菜单** | `src/constants/navigation.ts` |
| **路由定义** | `src/constants/routes.ts` |
| **分类列表** | `src/constants/collections.ts` (CATEGORIES) |
| **标签列表** | `src/constants/collections.ts` (TAGS) |
| **关于页面** | `src/pages/about.mdx` |
| **首页** | `src/pages/index.mdx` |
| **写新文章** | `src/content/post/{year}/{slug}/index.mdx` |
| **添加项目** | `src/content/project/{year}/{slug}/index.mdx` |

### 页面是否自动生成？

| 页面类型 | 是否自动生成 | 说明 |
|---------|------------|------|
| 文章详情页 | ✅ 是 | 基于 `src/content/post/` 的文件 |
| 分类页面 | ✅ 是 | 基于文章的 `category` 字段 |
| 标签页面 | ✅ 是 | 基于文章的 `tags` 字段 |
| 博客列表 | ✅ 是 | 自动分页 |
| 静态页面 (About 等) | ❌ 否 | 需要手动创建 `.mdx` 文件 |

---

## 💡 常见问题

### Q: 我修改了 CATEGORIES，为什么看不到新分类页面？
**A:** 需要有文章使用这个分类，页面才会生成。写一篇文章并设置 `category: my-new-category`。

### Q: 如何删除导航项？
**A:** 编辑 `src/constants/navigation.ts`，删除或注释对应的对象。

### Q: 如何修改每页显示的文章数量？
**A:** 编辑 `src/config/client.ts` 中的 `PAGE_SIZE_POST_CARD`。

### Q: 分类和标签有什么区别？
**A:**
- **分类 (Category)**：一篇文章只能有一个分类，表示文章的主要类型
- **标签 (Tags)**：一篇文章可以有多个标签，表示文章涉及的技术栈

---

希望这个指南帮助你更好地理解和管理你的博客！🚀
