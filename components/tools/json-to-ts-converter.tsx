"use client"

import { useMemo, useState } from "react"
import { AlertCircle, Braces, Wand2 } from "lucide-react"
import { jsonToTypeScript } from "@/lib/json-to-ts"
import { CopyButton } from "@/components/copy-button"
import { Button } from "@/components/ui/button"

const SAMPLE = `{
  "id": 42,
  "name": "Ada Lovelace",
  "active": true,
  "roles": ["admin", "editor"],
  "profile": {
    "avatarUrl": "https://example.com/a.png",
    "bio": null
  },
  "posts": [
    { "slug": "hello-world", "views": 1200, "pinned": true },
    { "slug": "second-post", "views": 340 }
  ]
}`

export function JsonToTsConverter() {
  const [input, setInput] = useState(SAMPLE)
  const [rootName, setRootName] = useState("Root")
  const [useTypeAlias, setUseTypeAlias] = useState(false)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null }
    try {
      const parsed = JSON.parse(input)
      return {
        output: jsonToTypeScript(parsed, { rootName, useTypeAlias }),
        error: null as string | null,
      }
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" }
    }
  }, [input, rootName, useTypeAlias])

  function formatInput() {
    try {
      setInput(JSON.stringify(JSON.parse(input), null, 2))
    } catch {
      // ignore invalid JSON
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Root name
          <input
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="h-8 w-36 rounded-md border border-border bg-input/30 px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            placeholder="Root"
          />
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={useTypeAlias}
            onChange={(e) => setUseTypeAlias(e.target.checked)}
            className="size-4 accent-primary"
          />
          Use <code className="rounded bg-muted px-1 py-0.5 text-xs">type</code> alias
        </label>
        <Button variant="outline" size="sm" onClick={formatInput} className="ml-auto gap-1.5">
          <Wand2 />
          Format JSON
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <Braces className="size-4 text-chart-2" />
            <span className="text-sm font-medium">Input JSON</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-64 flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Paste JSON here…"
            aria-label="JSON input"
          />
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <Braces className="size-4 text-primary" />
            <span className="text-sm font-medium">TypeScript</span>
            <CopyButton value={output} className="ml-auto" size="xs" disabled={!output} />
          </div>
          <div className="min-h-64 flex-1 overflow-auto">
            {error ? (
              <div className="flex items-start gap-2 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span className="font-mono">{error}</span>
              </div>
            ) : (
              <pre className="p-4 font-mono text-[13px] leading-relaxed text-foreground">
                <code>{output}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
