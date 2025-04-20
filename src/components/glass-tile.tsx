"use client"

import { forwardRef } from "react"
import { cn } from "../lib/utils"

interface GlassTileProps {
  status: "unselected" | "correct" | "wrong" | "current"
  isBreaking: boolean
  onClick: () => void
}

const GlassTile = forwardRef<HTMLDivElement, GlassTileProps>(({ status, isBreaking, onClick }, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "glass-tile",
        status === "unselected" && "glass-tile-unselected",
        status === "current" && "glass-tile-current",
        status === "correct" && "glass-tile-correct",
        status === "wrong" && "glass-tile-wrong",
        isBreaking && "glass-tile-breaking",
      )}
    >
      <div className="glass-tile-inner">
        <div className="glass-tile-reflection"></div>
      </div>
    </div>
  )
})

GlassTile.displayName = "GlassTile"

export default GlassTile
