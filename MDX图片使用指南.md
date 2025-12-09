# MDX 和 MD 文件中使用图片的完整指南

## MDX 文件（推荐用于博客文章）

### 为什么 MDX 中不能直接用 `![](path)` ？

MDX 文件需要使用 Astro 的 `<Image>` 组件来优化图片（自动压缩、响应式处理等）。这需要在构建时处理图片，所以必须用 `import` 语句。

### 完整步骤

#### 1. 准备图片文件结构

```
src/content/post/2025/12-08-first-mdx/
├── index.mdx
└── _images/
    └── your-image.png
```

#### 2. 在 MDX 文件中导入和使用

```mdx
---
type: post
title: 你的文章标题
publishDate: 2025-12-08
---

import { Image } from 'astro:assets';
import MyImage from '../../../../content/post/2025/12-08-first-mdx/_images/your-image.png';

## 正文内容

这是一段文字。

<Image src={MyImage} width={1024} alt="图片描述" />

继续写文字...

<div class="expand-sm">
  <Image src={MyImage} width={1024} alt="带容器的图片" />
</div>
```

### 常见的样式容器

```jsx
<!-- 默认大小 -->
<Image src={MyImage} width={1024} alt="描述" />

<!-- 小屏展开 -->
<div class="expand-sm">
  <Image src={MyImage} width={1024} alt="描述" />
</div>

<!-- 不展开（固定宽度） -->
<div class="no-expand">
  <Image src={MyImage} width={600} alt="描述" />
</div>
```

## MD 文件（用于外部平台如 dev.to, hashnode）

### 标准 Markdown 语法

```markdown
![图片描述](https://your-cdn.com/image.png)

<!-- 或使用相对路径（如果平台支持） -->
![图片描述](./_images/your-image.png)
```

## 常见问题

### 问题 1: 粘贴图片只显示文件名

**原因：** 编辑器没有自动转换为正确格式

**解决：**
- 对于 MDX：手动添加 import 和 <Image> 标签
- 对于 MD：手动添加 ![](path) 语法

### 问题 2: 图片路径错误

**检查清单：**
1. 图片是否在 `_images` 目录中？
2. import 路径的 `../../../../` 层级是否正确？
3. 文件名是否完全匹配（包括大小写和扩展名）？

### 问题 3: 图片无法显示/破损

**MDX 中：**
- 确保有 `import { Image } from 'astro:assets';`
- 确保 import 路径正确
- 使用 `<Image>` 组件而不是 `<img>` 标签

**MD 中：**
- 检查图片 URL 是否可访问
- 相对路径是否正确

## 快速参考

### MDX 模板

```mdx
---
type: post
title: 标题
publishDate: 2025-12-08
---

import { Image } from 'astro:assets';
import Image1 from '../../../../content/post/YYYY/MM-DD-slug/_images/image1.png';
import Image2 from '../../../../content/post/YYYY/MM-DD-slug/_images/image2.png';

## 内容

<Image src={Image1} width={1024} alt="图片1" />

文字...

<Image src={Image2} width={800} alt="图片2" />
```

### 路径规则

- 从 `src/content/post/YYYY/MM-DD-slug/index.mdx` 到图片
- 使用相对路径：`../../../../content/post/YYYY/MM-DD-slug/_images/file.png`
- 注意：路径中是 `content` 不是 `src/content`
