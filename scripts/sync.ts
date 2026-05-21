import { $ } from "bun"
import { readdirSync, existsSync, mkdirSync, writeFileSync, readFileSync } from "fs"
import { join, relative, dirname, sep } from "path"

// ─── Config ──────────────────────────────────────────────────────
const UPSTREAM_REPO = process.env.UPSTREAM_REPO ?? "anomalyco/opencode"
const SYNC_REF = process.env.SYNC_REF ?? "dev"
const DOCS_SOURCE_PATH =
  process.env.DOCS_SOURCE_PATH ?? "packages/web/src/content/docs"
const TEMP_DIR = ".sync-temp"
const OUTPUT_DIR = "docs"

// Files to exclude (promotional / non-technical pages)
const EXCLUDE_FILES = new Set([
  "index",       // 安装引导 / 推销 Zen
  "zen",         // OpenCode Zen 订阅推广
  "go",          // Go 语言集成宣传
  "enterprise",  // 企业版营销
  "ecosystem",   // 生态合作推广
  "share",       // 对话分享功能推广
])

// Languages to sync (directory name → output folder name)
const LANGUAGES = [
  { source: "", output: "en" }, // root = English
  { source: "zh-cn", output: "zh-cn" },
]

// ─── Helpers ─────────────────────────────────────────────────────

function log(msg: string) {
  console.log(`[sync] ${msg}`)
}

/** Strip Astro/MDX-specific syntax, converting to plain Markdown */
function mdxToMd(content: string): string {
  let result = content

  // Remove Astro component imports (import X from "...")
  result = result.replace(/^import\s+.*?\s+from\s+["'].*?["'];?\s*$/gm, "")

  // Remove self-closing Astro/JSX components: <Component ... />
  // But keep HTML-like tags that are valid in Markdown (img, br, hr)
  result = result.replace(
    /<((?!img|br|hr|blockquote|code|pre|a|strong|em|ul|ol|li|h[1-6]|table|tr|td|th|p|div|span|details|summary|sup|sub)\w+)[^>]*?\/>/gis,
    "",
  )

  // Remove Astro component opening/closing tags with content between
  result = result.replace(
    /<((?!img|br|hr|blockquote|code|pre|a|strong|em|ul|ol|li|h[1-6]|table|tr|td|th|p|div|span|details|summary|sup|sub)\w+)[^>]*>[\s\S]*?<\/\1>/gi,
    "",
  )

  // Remove JSX expressions {/* comment *}
  result = result.replace(/\{\/\*[\s\S]*?\*\/}/g, "")

  // Remove standalone JSX expressions {variable}
  result = result.replace(
    /^\s*\{[a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*\}\s*$/gm,
    "",
  )

  // Convert Astro admonitions :::tip / :::note / :::caution / :::warning → blockquote
  result = result.replace(
    /^:::(tip|note|caution|warning|danger|info)\s*$\n([\s\S]*?)^:::\s*$/gm,
    (_, type, content) => {
      const label = type.charAt(0).toUpperCase() + type.slice(1)
      const lines = content.trim().split("\n")
      return `> **${label}**\n>\n${lines.map((l: string) => `> ${l}`).join("\n")}\n`
    },
  )

  // Clean up multiple blank lines
  result = result.replace(/\n{3,}/g, "\n\n")

  return result.trim() + "\n"
}

/** Recursively find all .mdx/.md files in a directory, returning relative paths */
function findDocFiles(dir: string): string[] {
  const files: string[] = []
  if (!existsSync(dir)) return files

  function walk(current: string) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
        // Skip excluded files (by stem name, e.g. "zen" matches "zen.mdx")
        const stem = entry.name.replace(/\.mdx?$/, "")
        if (EXCLUDE_FILES.has(stem)) continue
        files.push(relative(dir, full))
      }
    }
  }
  walk(dir)
  return files
}

/** Copy and convert MDX files from source to output directory */
async function syncLanguage(
  cloneDir: string,
  langSource: string,
  langOutput: string,
) {
  const sourceDir =
    langSource === ""
      ? join(cloneDir, DOCS_SOURCE_PATH)
      : join(cloneDir, DOCS_SOURCE_PATH, langSource)

  const targetDir = join(OUTPUT_DIR, langOutput)

  // Ensure output directory exists
  mkdirSync(targetDir, { recursive: true })

  const mdxFiles = findDocFiles(sourceDir)
  if (mdxFiles.length === 0) {
    log(`  ⚠ No doc files found in ${langSource || "root"}`)
    return
  }

  let converted = 0
  for (const filePath of mdxFiles) {
    const fullPath = join(sourceDir, filePath)
    const relativePath = filePath.replace(/\.mdx?$/, ".md")
    const outputPath = join(targetDir, relativePath)

    // Read source file
    const content = await Bun.file(fullPath).text()

    // Convert MDX to MD
    const mdContent = mdxToMd(content)

    // Ensure output subdirectory exists
    mkdirSync(dirname(outputPath), { recursive: true })

    // Write converted file
    await Bun.write(outputPath, mdContent)
    converted++
  }

  log(`  ✓ ${langSource || "(root)"} → ${langOutput}/: ${converted} files`)
}

// ─── Architecture Index Generator ────────────────────────────────

/** Architecture tree: category → subcategory → doc files */
const ARCH = {
  "配置系统": {
    "核心配置": ["config", "permissions", "rules"],
    "模型 & 提供商": ["models", "providers", "network"],
    "代理 & 技能": ["agents", "skills"],
    "工具生态": ["tools", "custom-tools", "mcp-servers", "lsp", "plugins"],
    "代码质量": ["formatters"],
    "UI & 交互": ["themes", "keybinds", "commands", "tui"],
  },
  "使用方式": {
    "界面": ["cli", "web", "ide"],
    "平台": ["windows-wsl"],
  },
  "集成 & 扩展": {
    "版本控制": ["github", "gitlab"],
    "协议": ["acp"],
    "开发": ["sdk", "server"],
  },
  "参考": {
    "": ["troubleshooting"],
  },
}

// Display titles for doc stems
const TITLES: Record<string, string> = {
  config: "JSON 配置详解",
  permissions: "权限系统",
  rules: "规则 & 指令 (AGENTS.md)",
  models: "模型配置 & 变体",
  providers: "75+ 提供商目录",
  network: "网络配置",
  agents: "代理系统 (Build/Plan/子代理)",
  skills: "代理技能 (SKILL.md)",
  tools: "14 种内置工具",
  "custom-tools": "自定义工具 (.ts)",
  "mcp-servers": "MCP 服务器",
  lsp: "LSP 服务器 (33 种语言)",
  plugins: "插件系统",
  formatters: "25 种格式化工具",
  themes: "主题系统 (11 内置 + 自定义)",
  keybinds: "70+ 快捷键",
  commands: "自定义命令",
  tui: "TUI 终端界面",
  cli: "CLI 命令行",
  web: "Web 界面",
  ide: "IDE 扩展",
  "windows-wsl": "Windows & WSL",
  github: "GitHub 集成",
  gitlab: "GitLab 集成",
  acp: "ACP 协议 (Zed/JetBrains)",
  sdk: "SDK 开发",
  server: "Server 模式",
  troubleshooting: "故障排除",
}

function generateIndex(langDir: string) {
  const lines: string[] = [
    `# OpenCode 文档架构导航`,
    ``,
    `> 所有配置能力的层级索引，每个链接直接跳转到对应文档。`,
    ``,
  ]

  for (const [category, subs] of Object.entries(ARCH)) {
    lines.push(`## ${category}`)
    lines.push("")
    for (const [sub, stems] of Object.entries(subs)) {
      if (sub) {
        lines.push(`### ${sub}`)
        lines.push("")
      }
      for (const stem of stems) {
        const title = TITLES[stem] ?? stem
        lines.push(`- [${title}](${stem}.md)`)
      }
      lines.push("")
    }
  }

  const content = lines.join("\n").trim() + "\n"
  const outPath = join(OUTPUT_DIR, langDir, "INDEX.md")
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, content, "utf-8")
  log(`  INDEX → ${langDir}/INDEX.md`)
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  log(`Upstream: ${UPSTREAM_REPO} @ ${SYNC_REF}`)
  log(`Source:   ${DOCS_SOURCE_PATH}`)

  // Clean up previous temp
  await $`rm -rf ${TEMP_DIR}`.quiet()

  // Clone upstream (shallow, single branch)
  log("Fetching upstream...")
  await $`git clone --depth 1 --branch ${SYNC_REF} https://github.com/${UPSTREAM_REPO}.git ${TEMP_DIR}`

  // Get the commit we cloned
  const upstreamSha = (
    await $`git -C ${TEMP_DIR} rev-parse HEAD`.text()
  ).trim()
  const upstreamMsg = (
    await $`git -C ${TEMP_DIR} log -1 --format=%s`.text()
  ).trim()
  log(`Upstream: ${upstreamSha.slice(0, 7)} "${upstreamMsg}"`)

  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true })

  // Sync each language
  log("Converting files...")
  for (const lang of LANGUAGES) {
    await syncLanguage(TEMP_DIR, lang.source, lang.output)
  }

  // Write sync metadata
  const metadata = {
    lastSync: new Date().toISOString(),
    upstreamRepo: UPSTREAM_REPO,
    upstreamRef: SYNC_REF,
    upstreamSha,
    upstreamMsg,
  }
  await Bun.write(
    join(OUTPUT_DIR, ".sync-meta.json"),
    JSON.stringify(metadata, null, 2) + "\n",
  )
  log(`Metadata written to docs/.sync-meta.json`)

  // Generate architecture index for each language
  log("Generating architecture index...")
  for (const lang of LANGUAGES) {
    generateIndex(lang.output)
  }

  // Clean up
  await $`rm -rf ${TEMP_DIR}`.quiet()

  // Check if there are changes to commit
  log("Checking for changes...")
  try {
    await $`git diff --exit-code -- ${OUTPUT_DIR}/`.quiet()
    log("No changes detected. Already up to date.")
  } catch {
    log("Changes detected!")
    log("Run the following to commit:")
    log('  git add docs/ && git commit -m "docs: sync from upstream"')
  }
}

main().catch((err) => {
  console.error("[sync] Error:", err)
  process.exit(1)
})
