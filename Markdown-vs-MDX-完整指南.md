# Markdown (.md) vs MDX (.mdx) 完整指南

## 你的问题的答案

### ❓ Astro 默认使用 MDX 吗？

**答：不是。**

- Astro **原生支持** `.md` (Markdown) 文件
- MDX 是一个**可选集成**，需要安装 `@astrojs/mdx`

### ❓ 为什么这个博客只用 MDX？

**答：是模板作者的设计选择。**

原始配置在 `src/content/config.ts:21`：
```typescript
loader: glob({ pattern: '**/*.mdx', base: POST, generateId })
```

**我已经帮你修改为：**
```typescript
loader: glob({ pattern: '**/*.{md,mdx}', base: POST, generateId })
```

现在**同时支持** `.md` 和 `.mdx` 文件了！

---

## 快速对比：什么时候用哪个？

| 场景 | 推荐格式 | 原因 |
|------|---------|------|
| 简单博客文章 | `.md` | 语法简单，所见即所得 |
| 需要图片优化 | `.mdx` | Astro Image 组件自动优化 |
| 需要交互组件 | `.mdx` | 可以使用 React/Astro 组件 |
| 快速写作 | `.md` | 标准 Markdown，任何编辑器都支持 |
| 复杂布局 | `.mdx` | 可以使用 JSX 语法 |
| 外部平台（dev.to等） | `.md` | 标准格式，兼容性好 |

---

## Markdown (.md) 使用指南

### 图片语法

```markdown
<!-- 方法 1: 标准 Markdown -->
![图片描述](./_images/your-image.png)

<!-- 方法 2: HTML 标签（更多控制） -->
<img src="./_images/your-image.png" alt="描述" width="600" />

<!-- 方法 3: 外部 URL -->
![外部图片](https://example.com/image.png)
```

### 完整示例文件

```markdown
---
type: post
title: 我的文章标题
description: 文章描述
publishDate: 2025-12-08
tags:
  - tag1
category: tutorials
---

## 正文标题

这是一段文字。

![我的图片](./_images/example.png)

继续写文字...
```

### 优点
- ✅ 语法简单，容易学习
- ✅ 所有编辑器都支持
- ✅ 粘贴图片后手动添加 `![](path)` 即可
- ✅ 适合快速写作

### 缺点
- ❌ 图片优化有限
- ❌ 不能使用组件
- ❌ 功能相对基础

---

## MDX (.mdx) 使用指南

### 图片语法

```mdx
---
type: post
title: 我的文章标题
publishDate: 2025-12-08
---

import { Image } from 'astro:assets';
import MyImage from '../../../../content/post/2025/12-08-slug/_images/example.png';

## 正文标题

这是一段文字。

<Image src={MyImage} width={1024} alt="我的图片" />

继续写文字...
```

### 优点
- ✅ 图片自动优化（压缩、响应式）
- ✅ 可以使用 React/Astro 组件
- ✅ 更好的性能
- ✅ 更多的控制和定制

### 缺点
- ❌ 语法复杂，需要学习 JSX
- ❌ 不能直接用 `![](path)`
- ❌ 需要手动 import 图片

---

## 实际使用建议

### 方案 1: 全部用 Markdown (.md) - 最简单

**适合：**
- 博客新手
- 内容为主，不需要花哨效果
- 快速写作

**工作流：**
1. 创建 `index.md` 文件
2. 图片放到 `_images/` 目录
3. 写文章时用 `![描述](./_images/image.png)`

### 方案 2: 全部用 MDX (.mdx) - 最强大

**适合：**
- 需要图片优化
- 想用组件（Alert、Button等）
- 追求性能

**工作流：**
1. 创建 `index.mdx` 文件
2. 图片放到 `_images/` 目录
3. 在顶部 import 图片
4. 用 `<Image>` 组件显示

### 方案 3: 混合使用 - 最灵活（推荐）

**适合：**
- 根据文章需求选择格式
- 兼顾简单性和强大性

**策略：**
- 简单文章 → `.md`
- 图片多、需要优化 → `.mdx`
- 需要组件 → `.mdx`

---

## 解决你原来的问题

### 问题：粘贴图片只显示文件名

**原因：** 编辑器没有自动转换格式

**解决方案：**

#### 如果用 .md 文件：
1. 图片放到 `_images/2025-12-08-18-49-08.png`
2. 手动添加：
   ```markdown
   ![图片描述](./_images/2025-12-08-18-49-08.png)
   ```

#### 如果用 .mdx 文件：
1. 图片放到 `_images/2025-12-08-18-49-08.png`
2. 在顶部添加：
   ```javascript
   import MyImage from '../../../../content/post/2025/12-08-first-mdx/_images/2025-12-08-18-49-08.png';
   ```
3. 在正文中使用：
   ```jsx
   <Image src={MyImage} width={1024} alt="描述" />
   ```

---

## 快速开始

### 测试 Markdown (.md)

```bash
# 1. 我已经创建了示例文件
cd "/Users/wyh/开发/我的博客/blog/src/content/post/2025/12-08-test-markdown"

# 2. 复制一张测试图片
cp your-image.png _images/test.png

# 3. 编辑 index.md，添加
# ![测试图片](./_images/test.png)

# 4. 运行开发服务器
pnpm dev
```

### 测试 MDX (.mdx)

你已经有 `12-08-first-mdx` 示例了，按照文件里的说明操作即可。

---

## 我做的修改

1. ✅ 修改了 `src/content/config.ts`，现在同时支持 `.md` 和 `.mdx`
2. ✅ 更新了 `12-08-first-mdx/index.mdx`，添加使用说明
3. ✅ 创建了 `12-08-test-markdown/index.md` 示例
4. ✅ 创建了这个完整指南

---

## 下一步

选择你喜欢的格式，然后：

1. **如果选 .md：**
   - 把现有的 `.mdx` 改为 `.md`
   - 删除所有 `import` 语句
   - 图片改用 `![](path)` 语法

2. **如果选 .mdx：**
   - 保持现有格式
   - 按照 `MDX图片使用指南.md` 的说明操作

3. **如果混合使用：**
   - 根据文章复杂度选择格式
   - 两种格式可以共存

---

## 总结

- Astro **不强制** 使用 MDX，这是模板作者的选择
- 我已经修改配置，现在可以**同时使用 .md 和 .mdx**
- `.md` 简单直观，适合快速写作
- `.mdx` 功能强大，适合需要优化和组件的场景
- **你可以自由选择！**
