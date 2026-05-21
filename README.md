# OpenCode Docs Sync

自动同步 [OpenCode](https://github.com/anomalyco/opencode) 官方文档（中英双语），从源码 MDX 转换为干净的 Markdown。

## 目录结构

```
opencode-docs-sync/
├── docs/
│   ├── en/                  # 英文文档（自动生成）
│   │   ├── index.md
│   │   ├── config.md
│   │   ├── providers.md
│   │   └── ...
│   └── zh-cn/               # 中文文档（自动生成）
│       ├── index.md
│       ├── config.md
│       ├── providers.md
│       └── ...
├── scripts/
│   └── sync.ts              # 同步 & 转换脚本
├── .github/
│   └── workflows/
│       └── sync-docs.yml    # GitHub Actions 定时同步
└── README.md
```

## 快速开始

### 1. 前置条件

- [Bun](https://bun.sh) 或 Node.js 18+
- Git

### 2. 初始化仓库

```bash
# 创建你自己的 GitHub 仓库后
git clone https://github.com/YOUR_USERNAME/opencode-docs-sync.git
cd opencode-docs-sync

# 首次同步
bun run scripts/sync.ts
```

### 3. 推送到 GitHub

```bash
git add .
git commit -m "docs: initial sync from opencode upstream"
git push
```

之后 GitHub Actions 会自动定时同步。

## 手动同步

```bash
# 同步到最新版本
bun run scripts/sync.ts

# 指定分支/标签
SYNC_REF=v1.14.22 bun run scripts/sync.ts

# 查看变更
git diff --stat docs/
```

## 自动同步

GitHub Actions 工作流已配置：

- **定时触发**：每天 UTC 04:00（北京时间 12:00）自动检查并同步
- **手动触发**：在 GitHub Actions 页面点击 "Run workflow"
- **变更检测**：只有上游有变更时才提交

## 转换规则

| 源码（MDX） | 目标（MD） | 说明 |
|---|---|---|
| Astro 组件 `<Component />` | 移除 | UI 组件在纯 Markdown 中无意义 |
| Frontmatter `---` | 保留 | 标题、描述等元数据 |
| 代码块 ` ``` ` | 保留 | 代码内容不变 |
| 文件引用 `@filepath` | 保留 | OpenCode 特殊语法 |
| 内部链接 `/docs/xxx` | 保留 | 保持原始路径结构 |

## 配置

可通过环境变量自定义：

| 变量 | 默认值 | 说明 |
|---|---|---|
| `SYNC_REF` | `dev` | 上游分支或标签 |
| `UPSTREAM_REPO` | `anomalyco/opencode` | 上游仓库 |
| `DOCS_SOURCE_PATH` | `packages/web/src/content/docs` | 文档源码路径 |

## 许可

同步的文档内容遵循 [OpenCode 原始仓库](https://github.com/anomalyco/opencode) 的许可协议。
