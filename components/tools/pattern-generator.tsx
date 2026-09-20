"use client"

import { useMemo, useState } from "react"
import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

type PatternType = "dots" | "grid" | "diagonal" | "cross" | "triangles" | "waves"

const PATTERNS: { id: PatternType; label: string }[] = [
  { id: "dots", label: "Dots" },
  { id: "grid", label: "Grid" },
  { id: "diagonal", label: "Diagonal" },
  { id: "cross", label: "Cross" },
  { id: "triangles", label: "Triangles" },
  { id: "waves", label: "Waves" },
]

function patternBody(type: PatternType, fg: string, stroke: number): string {
  switch (type) {
    case "dots":
      return `<circle cx="10" cy="10" r="${1.5 + stroke}" fill="${fg}"/>`
    case "grid":
      return `<path d="M0 0H20V20" fill="none" stroke="${fg}" stroke-width="${stroke}"/>`
    case "diagonal":
      return `<path d="M-2 2L2 -2M0 20L20 0M18 22L22 18" stroke="${fg}" stroke-width="${stroke}"/>`
    case "cross":
      return `<path d="M10 6V14M6 10H14" stroke="${fg}" stroke-width="${stroke}" stroke-linecap="round"/>`
    case "triangles":
      return `<path d="M10 3L17 16H3Z" fill="none" stroke="${fg}" stroke-width="${stroke}"/>`
    case "waves":
      return `<path d="M0 10C5 4 15 16 20 10" fill="none" stroke="${fg}" stroke-width="${stroke}"/>`
  }
}

function buildSvg(type: PatternType, fg: string, scale: number, rotation: number, stroke: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${scale}" height="${scale}" viewBox="0 0 20 20"><g transform="rotate(${rotation} 10 10)">${patternBody(type, fg, stroke)}</g></svg>`
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-xs text-foreground">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
    </label>
  )
}

export function PatternGenerator() {
  const [type, setType] = useState<PatternType>("dots")
  const [scale, setScale] = useState(48)
  const [rotation, setRotation] = useState(0)
  const [stroke, setStroke] = useState(1)
  const [fg, setFg] = useState("#a78bfa")
  const [bg, setBg] = useState("#16161a")
  const [opacity, setOpacity] = useState(100)

  const { css, tailwind, dataUri } = useMemo(() => {
    const svg = buildSvg(type, fg, scale, rotation, stroke)
    const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22")
    const uri = `url("data:image/svg+xml,${encoded}")`
    const cssText = `background-color: ${bg};\nbackground-image: ${uri};\nbackground-size: ${scale}px ${scale}px;`
    const twText = `className="bg-[${bg}] bg-[image:url('data:image/svg+xml,${encoded}')] bg-[length:${scale}px_${scale}px]"`
    return { css: cssText, tailwind: twText, dataUri: uri }
  }, [type, fg, bg, scale, rotation, stroke])

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-4 overflow-auto rounded-xl border border-border bg-card p-4">
        <div>
          <span className="mb-2 block text-sm font-medium">Pattern</span>
          <div className="grid grid-cols-3 gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setType(p.id)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                  type === p.id
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-border bg-input/30 text-muted-foreground hover:bg-muted",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <Slider label="Scale" value={scale} min={16} max={140} suffix="px" onChange={setScale} />
        <Slider label="Rotation" value={rotation} min={0} max={360} suffix="°" onChange={setRotation} />
        <Slider label="Stroke / size" value={stroke} min={0.5} max={4} step={0.5} onChange={setStroke} />
        <Slider label="Pattern opacity" value={opacity} min={5} max={100} suffix="%" onChange={setOpacity} />

        <div className="grid grid-cols-2 gap-3">
          <ColorField label="Foreground" value={fg} onChange={setFg} />
          <ColorField label="Background" value={bg} onChange={setBg} />
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-4">
        <div className="relative min-h-56 flex-1 overflow-hidden rounded-xl border border-border">
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: bg,
              backgroundImage: dataUri,
              backgroundSize: `${scale}px ${scale}px`,
              opacity: opacity / 100,
            }}
            aria-hidden="true"
          />
          <span className="absolute bottom-3 left-3 rounded-md bg-background/70 px-2 py-1 text-xs text-muted-foreground backdrop-blur">
            Live preview
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CodeCard title="CSS" code={css} />
          <CodeCard title="Tailwind" code={tailwind} />
        </div>
      </div>
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="space-y-1.5">
      <span className="block text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-input/30 p-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-7 cursor-pointer rounded border-0 bg-transparent p-0"
          aria-label={`${label} color`}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent font-mono text-xs text-foreground outline-none"
          aria-label={`${label} hex value`}
        />
      </div>
    </label>
  )
}

function CodeCard({ title, code }: { title: string; code: string }) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="text-sm font-medium">{title}</span>
        <CopyButton value={code} className="ml-auto" size="xs" label={`Copy ${title}`} />
      </div>
      <pre className="max-h-40 overflow-auto p-3 font-mono text-[12px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}
