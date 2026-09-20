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
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%]">
            <Sidebar active={active} onSelect={handleSelect} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold">{activeTool.name}</h1>
            <p className="truncate text-xs text-muted-foreground">{activeTool.description}</p>
          </div>
          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Tool tabs">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActive(tool.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  tool.id === active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tool.name}
              </button>
            ))}
          </nav>
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
