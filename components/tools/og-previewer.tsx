"use client"

import { useState } from "react"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url || "example.com"
  }
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  textarea?: boolean
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-input/30 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-input/30 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      )}
    </label>
  )
}

function PreviewImage({ src, className }: { src: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
        <ImageOff className="size-6" />
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || "/placeholder.svg"}
      alt="Open Graph preview"
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
      crossOrigin="anonymous"
    />
  )
}

export function OgPreviewer() {
  const [title, setTitle] = useState("DevKit — Developer & Designer Utility Suite")
  const [description, setDescription] = useState(
    "A fast, dark-themed suite of everyday developer and designer utilities that run entirely in your browser.",
  )
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("https://devkit.example.com/tools")

  const host = hostFromUrl(url)

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
      <div className="flex flex-col gap-4 overflow-auto rounded-xl border border-border bg-card p-4">
        <Field label="Title" value={title} onChange={setTitle} placeholder="Page title" />
        <Field
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Short description"
          textarea
        />
        <Field label="Image URL" value={image} onChange={setImage} placeholder="https://…/og.png" />
        <Field label="Page URL" value={url} onChange={setUrl} placeholder="https://example.com/page" />
        <p className="text-xs text-muted-foreground">
          Recommended OG image size is 1200×630. Cards update live as you type.
        </p>
      </div>

      <div className="grid min-h-0 grid-cols-1 content-start gap-5 overflow-auto rounded-xl border border-border bg-card p-5 md:grid-cols-2 xl:grid-cols-3">
        {/* Twitter / X */}
        <PreviewCard platform="X / Twitter">
          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            <PreviewImage src={image} className="aspect-[1.91/1] w-full" />
            <div className="border-t border-border px-3 py-2">
              <p className="text-xs text-muted-foreground">{host}</p>
              <p className="line-clamp-1 text-sm font-medium text-foreground">{title || "Untitled"}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </PreviewCard>

        {/* LinkedIn */}
        <PreviewCard platform="LinkedIn">
          <div className="overflow-hidden rounded-md border border-border bg-background shadow-sm">
            <PreviewImage src={image} className="aspect-[1.91/1] w-full" />
            <div className="bg-card px-3 py-2.5">
              <p className="line-clamp-2 text-sm font-semibold text-foreground">{title || "Untitled"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{host}</p>
            </div>
          </div>
        </PreviewCard>

        {/* Discord */}
        <PreviewCard platform="Discord">
          <div className="rounded-md border-l-4 border-primary bg-[#2b2d31] p-3">
            <p className="text-xs font-medium text-[#00a8fc]">{host}</p>
            <p className="mt-1 line-clamp-1 text-sm font-semibold text-white">{title || "Untitled"}</p>
            <p className="mt-1 line-clamp-3 text-xs text-[#dbdee1]">{description}</p>
            <PreviewImage src={image} className="mt-2 aspect-[1.91/1] w-full rounded" />
          </div>
        </PreviewCard>
      </div>
    </div>
  )
}

function PreviewCard({ platform, children }: { platform: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{platform}</span>
      {children}
    </div>
  )
}
