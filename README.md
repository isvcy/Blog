# 陈义 | 技术博客

> 🚀 一个现代化的个人技术博客网站，展示我的技术能力和项目经验

> 📝 **版权声明**: 本项目源码由陈义原创开发，版权归作者所有。欢迎学习交流，转载请注明出处。

🔗 **在线预览**: [https://isvcy.github.io/Blog/](https://isvcy.github.io/Blog/)

---

## 📸 项目截图

*网站采用深色/浅色双主题设计，支持响应式布局*

---

## ✨ 功能特性

### 🎨 界面设计
- **双主题切换**：支持深色/浅色主题，自动保存用户偏好
- **动态粒子背景**：Canvas 实现的粒子动画效果，根据设备性能自动调整
- **光标发光效果**：跟随鼠标的发光特效，增强视觉体验
- **响应式布局**：完美适配手机、平板、桌面端

### 📱 页面模块
| 页面 | 功能描述 |
|------|----------|
| **欢迎页** | 浪漫打字机效果，循环播放技术故事 |
| **首页** | 模块化导航，快速进入各功能页面 |
| **简历** | 个人信息、技能展示、工作经历 |
| **博客** | 技术文章列表，支持分类筛选 |
| **项目** | 项目经验展示，成果汇总 |
| **联系** | 联系方式，支持邮箱复制、微信二维码 |

### ⚡ 性能优化
- 图片压缩优化（压缩率 87%-89%）
- 主题切换无闪烁（预加载脚本）
- 移动端粒子数量自适应
- 平滑的过渡动画效果

---

## 🛠️ 技术栈

- **HTML5** - 语义化页面结构
- **CSS3** - 现代样式与动画
- **Tailwind CSS** - 实用优先的 CSS 框架（CDN）
- **原生 JavaScript** - 模块化架构，无依赖
- **Canvas API** - 粒子动画系统

---

## 📁 项目结构

```
Blog/
├── 📄 welcome.html            # 欢迎页面
├── 📄 index.html              # 主页
├── 📄 resume.html             # 简历页面
├── 📄 blog.html               # 博客页面
├── 📄 projects.html           # 项目页面
├── 📄 contact.html            # 联系页面
├── 📁 css/
│   ├── style.css              # 主要样式
│   └── tailwind.css           # Tailwind 样式
├── 📁 js/
│   ├── main.js                # 主要逻辑（粒子、主题、动画）
│   └── tailwind-config.js     # Tailwind 配置
├── 📁 img/
│   ├── me.jpg                 # 个人头像
│   └── wx.jpg                 # 微信二维码
└── 📄 README.md               # 项目文档
``` 

---

## 🚀 快速开始

### 本地预览

```bash
# 进入项目目录
cd Blog

# 启动本地服务器（Python 3）
python -m http.server 8080

# 或者使用 Node.js 的 http-server
npx http-server -p 8080

# 浏览器访问
open http://localhost:8080
```

### 部署到 GitHub Pages

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交更改
git commit -m "Initial commit"

# 4. 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/isvcy/isvcy.github.io.git

# 5. 推送到 GitHub
git push -u origin main

# 6. 在 GitHub 仓库设置中启用 GitHub Pages
#    Settings -> Pages -> Source -> Deploy from a branch -> main
```

---

## 📝 开发日志

| 日期 | 更新内容 |
|------|----------|
| 2026-03-08 | 🎉 项目初始化 |
| 2026-03-08 | ✨ 添加简历、博客、项目、联系页面 |
| 2026-03-08 | 🎨 实现深色/浅色主题切换 |
| 2026-03-08 | 🌟 添加动态粒子背景效果 |
| 2026-03-08 | 📱 优化响应式设计 |
| 2026-03-08 | ⚡ 修复主题切换闪烁问题 |
| 2026-03-08 | 🗜️ 图片压缩优化（减少 87%+ 体积） |
| 2026-03-08 | 🎭 添加欢迎页面，浪漫打字机效果 |
| 2026-03-08 | 📋 实现邮箱、微信号一键复制功能 |
| 2026-03-08 | 📱 优化移动端间距和布局 |

---

## 📮 联系我

| 方式 | 信息 |
|------|------|
| 📧 邮箱 | [695714679@qq.com](mailto:695714679@qq.com) |
| 💬 微信 | `_o_Orange_` |
| 🐙 GitHub | [@isvcy](https://github.com/isvcy) |

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/isvcy">陈义</a>
</p>
