"use client"

import { useEffect } from "react"

interface VictoryModalProps {
  score: number
  onRestart: () => void
}

export default function VictoryModal({ score, onRestart }: VictoryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        onRestart()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onRestart])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-black border-2 border-green-500 p-8 rounded-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-green-500 mb-4">Victory!</h2>
        <p className="text-green-400 mb-6">
          Congratulations! You successfully crossed all {score} tiles and made it to the other side!
        </p>
        <button
          onClick={onRestart}
          className="rounded-md bg-green-500 px-6 py-3 text-black font-bold hover:bg-green-400 transition-colors"
        >
          Play Again
        </button>
        <p className="text-green-400 mt-4 text-sm">Press Enter or Space to restart</p>
      </div>
    </div>
  )
}
