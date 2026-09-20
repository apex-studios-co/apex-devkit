"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Eye, FileText } from "lucide-react"
import { CopyButton } from "@/components/copy-button"

const SAMPLE = `# Project Title

A short and punchy description of what this project does.

## Features

- Fast, **dark-themed** UI
- Works entirely in the browser
- Copy-ready output for every tool

## Installation

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## Usage

| Tool | Purpose |
| ---- | ------- |
| JSON → TS | Generate interfaces |
| Patterns | Backgrounds |

> Tip: edit the left pane and watch the preview update live.

Made with [v0](https://v0.app).
`

const proseClasses = [
  "max-w-none text-sm leading-relaxed text-foreground",
  "[&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight",
  "[&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:border-b [&_h2]:border-border [&_h2]:pb-1 [&_h2]:text-xl [&_h2]:font-semibold",
  "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_p]:my-3",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
  "[&_pre]:my-3 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-background [&_pre]:p-3",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
  "[&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left",
  "[&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-1.5 [&_th]:font-semibold",
  "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5",
  "[&_hr]:my-5 [&_hr]:border-border",
  "[&_img]:my-3 [&_img]:rounded-lg",
].join(" ")

export function MarkdownEditor() {
  const [value, setValue] = useState(SAMPLE)

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <FileText className="size-4 text-chart-2" />
          <span className="text-sm font-medium">Markdown</span>
          <CopyButton value={value} className="ml-auto" size="xs" label="Copy MD" />
        </div>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          className="min-h-64 flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="# Write your README…"
          aria-label="Markdown input"
        />
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <Eye className="size-4 text-primary" />
          <span className="text-sm font-medium">Preview</span>
        </div>
        <div className="min-h-64 flex-1 overflow-auto p-5">
          <div className={proseClasses}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
