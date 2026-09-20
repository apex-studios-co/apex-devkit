import { cn } from "@/lib/utils"

interface ApexLogoProps {
  className?: string
  "aria-hidden"?: boolean
}

/**
 * Animated Apex mark: a stacked "peak" chevron that draws itself in,
 * with a slow rotating conic sheen behind it. Motion is disabled for
 * users who prefer reduced motion (handled in globals.css).
 */
export function ApexLogo({ className, ...rest }: ApexLogoProps) {
  return (
    <span
      className={cn(
        "apex-logo relative inline-flex items-center justify-center overflow-hidden rounded-xl",
        className,
      )}
      {...rest}
    >
      <span className="apex-logo-sheen absolute inset-0" aria-hidden="true" />
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className="relative size-[62%]"
        role="img"
        aria-label="Apex DevSuite logo"
      >
        <path
          className="apex-peak apex-peak-back"
          d="M16 5 L27 25 L21 25 L16 15 L11 25 L5 25 Z"
          fill="currentColor"
          opacity="0.35"
        />
        <path
          className="apex-peak apex-peak-front"
          d="M16 12 L23 25 L19 25 L16 19 L13 25 L9 25 Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}
