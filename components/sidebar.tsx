"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { filterTools, type ToolId } from "@/lib/tools"
import { ApexLogo } from "@/components/apex-logo"
import { cn } from "@/lib/utils"

interface SidebarProps {
  active: ToolId
  onSelect: (id: ToolId) => void
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  const [query, setQuery] = useState("")
  const results = useMemo(() => filterTools(query), [query])

  return (
    <aside className="flex h-full w-full flex-col gap-4 border-r border-sidebar-border bg-sidebar p-4">
      <div className="flex items-center gap-2.5 px-1">
        <ApexLogo className="size-9 shrink-0" />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">Apex DevSuite</p>
          <p className="text-xs text-muted-foreground">Developer &amp; Designer tools</p>
        </div>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools…"
          className="h-9 w-full rounded-lg border border-sidebar-border bg-input/30 pr-3 pl-8 text-sm text-sidebar-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          aria-label="Search tools"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-auto" aria-label="Tools">
        {results.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">No tools match &quot;{query}&quot;</p>
        ) : (
          results.map((tool) => {
            const Icon = tool.icon
            const isActive = tool.id === active
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelect(tool.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-start gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-sidebar-border bg-input/20 text-muted-foreground group-hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{tool.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{tool.description}</span>
                </span>
              </button>
            )
          })
        )}
      </nav>

      <p className="px-1 text-xs text-muted-foreground">Runs 100% in your browser.</p>
    </aside>
  )
}
