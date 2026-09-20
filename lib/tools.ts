import { Braces, FileText, Palette, Share2, type LucideIcon } from "lucide-react"

export type ToolId = "json-to-ts" | "pattern-generator" | "og-previewer" | "markdown-editor"

export interface ToolMeta {
  id: ToolId
  name: string
  description: string
  keywords: string[]
  icon: LucideIcon
}

export const TOOLS: ToolMeta[] = [
  {
    id: "json-to-ts",
    name: "JSON to TypeScript",
    description: "Convert JSON into TypeScript interfaces",
    keywords: ["json", "typescript", "ts", "interface", "type", "convert", "schema"],
    icon: Braces,
  },
  {
    id: "pattern-generator",
    name: "Pattern Generator",
    description: "Build SVG & CSS background patterns",
    keywords: ["svg", "css", "pattern", "background", "tailwind", "gradient", "design"],
    icon: Palette,
  },
  {
    id: "og-previewer",
    name: "Open Graph Previewer",
    description: "Preview link cards for social platforms",
    keywords: ["open graph", "og", "meta", "twitter", "x", "linkedin", "discord", "social", "seo", "preview"],
    icon: Share2,
  },
  {
    id: "markdown-editor",
    name: "Markdown README Editor",
    description: "Write Markdown with a live preview",
    keywords: ["markdown", "md", "readme", "editor", "preview", "docs", "documentation"],
    icon: FileText,
  },
]

export function filterTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase()
  if (!q) return TOOLS
  return TOOLS.filter((tool) => {
    const haystack = [tool.name, tool.description, ...tool.keywords].join(" ").toLowerCase()
    return haystack.includes(q)
  })
}
