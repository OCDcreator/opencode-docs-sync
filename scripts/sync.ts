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
