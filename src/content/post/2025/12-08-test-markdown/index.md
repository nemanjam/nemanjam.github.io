---
type: post
title: 测试纯 Markdown 文章
description: 演示如何在 .md 文件中使用图片
publishDate: 2025-12-08
heroImage: '../../../../content/post/2025/12-08-test-markdown/_images/image_hero.png'
heroAlt: 测试文章
noHero: false
tags:
  - astro
  - javascript
category: Shopify
toc: true
draft: false
---

## 在 Markdown 中使用图片

### 方法 1: 使用相对路径（本地图片）

首先将图片放到 `_images` 目录，然后使用标准 Markdown 语法：

```markdown
![图片描述](./_images/your-image.png)
```

> **注意**：要看到实际效果，需要先将图片放到 `_images` 目录中

### 方法 2: 使用 HTML img 标签

如果需要更多控制（如指定宽度），可以用 HTML：

```html
<img src="./_images/your-image.png" alt="描述" width="600" />
```

> **注意**：替换 `your-image.png` 为你实际的图片文件名

### 方法 3: 使用外部 URL

```markdown
![外部图片](https://example.com/image.png)
```

## Markdown vs MDX 对比

| 特性 | Markdown (.md) | MDX (.mdx) |
|------|----------------|------------|
| 语法 | 标准 Markdown | Markdown + JSX |
| 图片语法 | `![](path)` 或 `<img>` | 必须用 `import` + `<Image>` 组件 |
| 图片优化 | 有限 | 完全优化（Astro Image） |
| 组件支持 | 不支持 | 支持 React/Astro 组件 |
| 学习曲线 | 简单 | 需要了解 JSX |
| 性能 | 一般 | 更好（图片优化） |

## 建议

- **简单文章**：使用 `.md` 即可，语法简单直观
- **复杂文章**：使用 `.mdx`，可以：
  - 使用优化的图片组件
  - 嵌入交互式组件
  - 更好的性能

## 测试你的设置

1. 创建 `_images` 目录
2. 放入一张测试图片（如 `test.png`）
3. 在 Markdown 中使用：`![测试](./_images/test.png)`
4. 运行 `pnpm dev` 查看效果
