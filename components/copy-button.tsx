"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  value: string
  label?: string
  size?: "xs" | "sm" | "default"
  variant?: "outline" | "secondary" | "ghost" | "default"
  className?: string
  disabled?: boolean
}

export function CopyButton({
  value,
  label = "Copy",
  size = "sm",
  variant = "outline",
  className,
  disabled,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard may be unavailable; fail silently.
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleCopy}
      disabled={disabled || !value}
      className={cn("gap-1.5", className)}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="text-emerald-400" /> : <Copy />}
      {copied ? "Copied" : label}
    </Button>
  )
}
