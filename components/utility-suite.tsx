"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TOOLS, type ToolId } from "@/lib/tools"
import { JsonToTsConverter } from "@/components/tools/json-to-ts-converter"
import { PatternGenerator } from "@/components/tools/pattern-generator"
import { OgPreviewer } from "@/components/tools/og-previewer"
import { MarkdownEditor } from "@/components/tools/markdown-editor"
import { cn } from "@/lib/utils"

// Each tool stays mounted so switching tabs preserves state and never reloads.
const TOOL_VIEWS: Record<ToolId, React.ReactNode> = {
  "json-to-ts": <JsonToTsConverter />,
  "pattern-generator": <PatternGenerator />,
  "og-previewer": <OgPreviewer />,
  "markdown-editor": <MarkdownEditor />,
}

export function UtilitySuite() {
  const [active, setActive] = useState<ToolId>("json-to-ts")
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeTool = TOOLS.find((t) => t.id === active)!

  function handleSelect(id: ToolId) {
    setActive(id)
    setMobileOpen(false)
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {/* Desktop sidebar */}
      <div className="hidden w-72 shrink-0 md:block">
        <Sidebar active={active} onSelect={handleSelect} />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-80 shadow-2xl duration-200 animate-in slide-in-from-left">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-3.5 right-3 z-10 inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Close tools menu"
            >
              <X className="size-4" />
            </button>
            <Sidebar active={active} onSelect={handleSelect} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted md:hidden"
            aria-label="Open tools menu"
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <activeTool.icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <h1 className="truncate text-base font-semibold">{activeTool.name}</h1>
            </div>
            <p className="truncate text-xs text-muted-foreground">{activeTool.description}</p>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-auto p-4 md:p-6">
          {TOOLS.map((tool) => (
            <div key={tool.id} className={cn("h-full", tool.id === active ? "block" : "hidden")}>
              {TOOL_VIEWS[tool.id]}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
