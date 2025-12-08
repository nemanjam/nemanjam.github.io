# Netlify Visual Editor 使用指南

## ✅ 已完成的集成步骤

1. ✅ 安装了 Visual Editor 依赖 (`@stackbit/types`, `@stackbit/cms-git`)
2. ✅ 创建了 `stackbit.config.ts` 配置文件
3. ✅ 为所有文章和项目添加了 `type` 字段
4. ✅ 为关键组件添加了内联编辑注解 (`data-sb-*`)

## 🚀 如何启动 Visual Editor

### 方法一：本地测试（推荐）

1. **安装 Visual Editor CLI（全局）**
   ```bash
   npm install -g @stackbit/cli
   ```

2. **启动 Astro 开发服务器**
   在第一个终端窗口运行：
   ```bash
   cd "/Users/wyh/开发/我的博客/blog"
   pnpm dev
   ```
   等待直到看到 "astro  v5.x.x ready in xxx ms"

3. **启动 Visual Editor**
   在第二个终端窗口运行：
   ```bash
   cd "/Users/wyh/开发/我的博客/blog"
   stackbit dev
   ```

4. **打开 Visual Editor**
   - Visual Editor 会自动在浏览器中打开
   - 或访问终端中显示的 URL（通常是 `http://localhost:8090/_stackbit`）
   - 首次使用需要注册/登录 Netlify 账号

### 方法二：Netlify 在线编辑

将代码推送到 GitHub 后，在 Netlify 控制面板中启用 Visual Editor。

## 🎨 可以编辑的内容

### 文章页面 (`/blog/[slug]`)
可以直接点击编辑：
- ✏️ 标题 (title)
- ✏️ 描述 (description)
- ✏️ 主图 (heroImage)
- ✏️ 正文内容 (markdown_content)
- ✏️ 发布日期 (publishDate)

### 首页文章卡片
可以直接点击编辑：
- ✏️ 标题 (title)
- ✏️ 描述 (description)
- ✏️ 主图 (heroImage)

### 侧边栏编辑
所有字段都可以在侧边栏中编辑：
- 标题、描述、日期
- 标签 (tags) - 多选列表
- 分类 (category) - 单选
- 草稿状态 (draft)
- 显示目录 (toc)
- 等等...

## 📝 创建新文章

在 Visual Editor 中：
1. 点击 "Create Content"
2. 选择 "Post" 类型
3. 填写必填字段
4. 保存后会自动创建文件

## ⚠️ 注意事项

1. **文件路径结构**
   - 新文章会保存到：`src/content/post/{year}/{slug}/index.mdx`
   - 需要手动调整年份文件夹（如果需要）

2. **图片上传**
   - 上传的图片会保存到：`src/content/_images/`
   - 可能需要手动移动到文章的 `_images` 文件夹

3. **MDX 支持**
   - Visual Editor 支持基本的 Markdown 编辑
   - 复杂的 MDX 组件导入可能需要在代码编辑器中完成

4. **Git 同步**
   - 在 Visual Editor 中的更改会直接修改本地文件
   - 记得提交和推送到 Git

## 🔧 配置文件说明

### `stackbit.config.ts`
- 配置了 Post 和 Project 两种内容类型
- 定义了所有可编辑字段和它们的类型
- 配置了图片上传路径

### 注解属性
- `data-sb-object-id`: 标识内容对象（文件路径）
- `data-sb-field-path`: 标识可编辑字段

## 🐛 故障排除

### Visual Editor 无法连接
- 确保 Astro 开发服务器在 3000 端口运行
- 检查 `astro.config.ts` 中的端口配置

### 内容无法编辑
- 检查 front matter 中是否有 `type: post` 或 `type: project`
- 确保组件有正确的 `data-sb-*` 注解

### 样式问题
- Visual Editor 使用 iframe 预览，样式可能略有不同
- 实际网站样式以构建后为准

## 📚 更多资源

- [Netlify Visual Editor 文档](https://docs.netlify.com/visual-editor/overview/)
- [Stackbit 参考文档](https://docs.stackbit.com/)
- [Astro 集成指南](https://docs.netlify.com/visual-editor/framework-guides/astro/)

## 🎉 下一步

现在你可以：
1. 启动 Visual Editor 测试编辑功能
2. 邀请团队成员使用可视化编辑器
3. 部署到 Netlify 使用在线编辑功能

祝写作愉快！✨
