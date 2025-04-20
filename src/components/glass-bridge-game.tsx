"use client"

import React from "react"

import { useEffect, useState } from "react"
import GameOverModal from "./game-over-modal"

import VictoryModal from "./victory-modal"
import GlassTile from "./glass-tile"

type TileStatus = "unselected" | "correct" | "wrong" | "current"

interface Tile {
  id: number
  position: "left" | "right"
  isTempered: boolean
  status: TileStatus
  ref: React.RefObject<HTMLDivElement | null>
}

interface ShardProps {
  width: number
  height: number
  rotation: number
  left: number
  top: number
  delay: number
}

export default function GlassBridgeGame() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [victory, setVictory] = useState(false)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [breakingTileId, setBreakingTileId] = useState<number | null>(null)
  const [showShards, setShowShards] = useState(false)
  const [shards, setShards] = useState<ShardProps[]>([])
  const [breakPosition, setBreakPosition] = useState({ left: 0, top: 0 })

  const TOTAL_PAIRS = 8

  // Initialize the game
  const initializeGame = () => {
    const newTiles: Tile[] = []

    for (let i = 0; i < TOTAL_PAIRS; i++) {
      // Randomly decide which tile is tempered (safe)
      const isLeftTempered = Math.random() > 0.5

      newTiles.push({
        id: i * 2,
        position: "left",
        isTempered: isLeftTempered,
        status: i === 0 ? "current" : "unselected",
        ref: React.createRef<HTMLDivElement>(),
      })

      newTiles.push({
        id: i * 2 + 1,
        position: "right",
        isTempered: !isLeftTempered,
        status: i === 0 ? "current" : "unselected",
        ref: React.createRef<HTMLDivElement>(),
      })
    }

    setTiles(newTiles)
    setCurrentPairIndex(0)
    setGameOver(false)
    setVictory(false)
    setScore(0)
    setGameStarted(true)
    setBreakingTileId(null)
    setShowShards(false)
    setShards([])
  }

  // Generate glass shards exactly like in the reference image
  const generateShards = (tileElement: HTMLDivElement) => {
    // Get the position of the breaking tile
    const rect = tileElement.getBoundingClientRect()
    const containerRect = tileElement.parentElement?.parentElement?.getBoundingClientRect() || { left: 0, top: 0 }

    // Calculate position relative to the bridge container
    const left = rect.left - containerRect.left + rect.width / 2
    const top = rect.top - containerRect.top + rect.height / 2 + 50 // Offset to position below the tile

    setBreakPosition({ left, top })

    // Create shards that match the reference image exactly
    const newShards: ShardProps[] = [
      // Large triangles
      { width: 30, height: 40, rotation: 0, left: -20, top: 20, delay: 0 },
      { width: 35, height: 45, rotation: 30, left: 20, top: 10, delay: 0.05 },
      { width: 25, height: 35, rotation: -15, left: -40, top: 30, delay: 0.1 },

      // Medium triangles
      { width: 20, height: 30, rotation: 60, left: 40, top: 30, delay: 0.15 },
      { width: 22, height: 32, rotation: 120, left: 10, top: 50, delay: 0.2 },
      { width: 18, height: 28, rotation: 210, left: -30, top: 40, delay: 0.25 },

      // Small triangles
      { width: 15, height: 20, rotation: 45, left: 30, top: 60, delay: 0.3 },
      { width: 12, height: 18, rotation: 90, left: -10, top: 70, delay: 0.35 },
      { width: 10, height: 15, rotation: 150, left: -50, top: 50, delay: 0.4 },
      { width: 8, height: 12, rotation: 180, left: 50, top: 40, delay: 0.45 },

      // Tiny triangles
      { width: 6, height: 10, rotation: 240, left: 0, top: 80, delay: 0.5 },
      { width: 5, height: 8, rotation: 270, left: -20, top: 60, delay: 0.55 },
      { width: 7, height: 11, rotation: 300, left: 20, top: 70, delay: 0.6 },
      { width: 9, height: 14, rotation: 330, left: -40, top: 80, delay: 0.65 },
      { width: 11, height: 16, rotation: 15, left: 40, top: 50, delay: 0.7 },
      { width: 13, height: 19, rotation: 75, left: -15, top: 90, delay: 0.75 },
    ]

    setShards(newShards)
  }

  // Handle tile selection
  const handleTileClick = (tileId: number) => {
    if (gameOver || victory || breakingTileId !== null) return

    const clickedTile = tiles.find((tile) => tile.id === tileId)
    if (!clickedTile || clickedTile.status !== "current") return

    const updatedTiles = [...tiles]
    const clickedTileIndex = updatedTiles.findIndex((tile) => tile.id === tileId)

    if (clickedTile.isTempered) {
      // Correct tile selected
      updatedTiles[clickedTileIndex].status = "correct"

      // Update the next pair to be current if not the last pair
      if (currentPairIndex < TOTAL_PAIRS - 1) {
        updatedTiles[2 * (currentPairIndex + 1)].status = "current"
        updatedTiles[2 * (currentPairIndex + 1) + 1].status = "current"
        setCurrentPairIndex(currentPairIndex + 1)
      } else {
        // Player has completed all pairs
        setVictory(true)
      }

      setScore(score + 1)
      if (score + 1 > maxScore) {
        setMaxScore(score + 1)
      }
    } else {
      // Wrong tile selected
      updatedTiles[clickedTileIndex].status = "wrong"
      setBreakingTileId(tileId)

      // Generate and show shards
      if (clickedTile.ref.current) {
        generateShards(clickedTile.ref.current)
      }

      // Show breaking animation
      setTimeout(() => {
        setShowShards(true)

        // After animation, set game over
        setTimeout(() => {
          setGameOver(true)
        }, 2000)
      }, 300)

      // Also reveal the correct tile in the pair
      const otherTileInPair = updatedTiles.find(
        (tile) => tile.id !== tileId && Math.floor(tile.id / 2) === Math.floor(tileId / 2),
      )
      if (otherTileInPair) {
        const otherTileIndex = updatedTiles.findIndex((tile) => tile.id === otherTileInPair.id)
        updatedTiles[otherTileIndex].status = "correct"
      }
    }

    setTiles(updatedTiles)
  }

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver || victory || breakingTileId !== null) return

      if (e.key === "ArrowLeft") {
        const leftTile = tiles.find((tile) => tile.position === "left" && Math.floor(tile.id / 2) === currentPairIndex)
        if (leftTile) handleTileClick(leftTile.id)
      } else if (e.key === "ArrowRight") {
        const rightTile = tiles.find(
          (tile) => tile.position === "right" && Math.floor(tile.id / 2) === currentPairIndex,
        )
        if (rightTile) handleTileClick(rightTile.id)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [tiles, currentPairIndex, gameStarted, gameOver, victory, breakingTileId])

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"   
     style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",  // Ensures the image covers the area without stretching
        backgroundPosition: "center",  // Keeps the image centered
        height: "50vh"  // Sets the height of the background image to 50% of the viewport height
      }}>
      {/* Background image */}
      <div className="game-background"></div>

      {/* Pixelated overlay effect */}
      <div className="pixelated-overlay"></div>

      {!gameStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/70">
          <h1 className="text-5xl font-bold text-green-500 mb-8">Glass Bridge Challenge</h1>
          <p className="mb-8 text-center text-green-400 max-w-md px-4">
            Choose the correct glass tile to cross the bridge. One tile is tempered and will hold your weight, the other
            will break. Use arrow keys or click to select.
          </p>
          <button
            onClick={initializeGame}
            className="rounded-md bg-green-500 px-8 py-4 text-xl text-black font-bold hover:bg-green-400 transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="text-green-500 text-xl">
              <span className="font-bold">Score: </span>
              <span>{score}</span>
            </div>
            <div className="text-green-500 text-xl">
              <span className="font-bold">Best: </span>
              <span>{maxScore}</span>
            </div>
          </div>

          <div className="absolute bottom-[17%] w-full max-w-xl px-4" style={{ transform: 'rotateX(30deg)' }}>
            <div className="relative">
              {/* Bridge tiles */}
              <div className="bridge-container">
                <div className="bridge-row">
                  {Array.from({ length: TOTAL_PAIRS }).map((_, pairIndex) => {
                    const leftTile = tiles.find(
                      (tile) => tile.position === "left" && Math.floor(tile.id / 2) === pairIndex,
                    )
                    return leftTile ? (
                      <GlassTile
                        key={`left-${pairIndex}`}
                        // onClick={() => handleTileClick(leftTile.id)}
                        status={leftTile.status}
                        isBreaking={breakingTileId === leftTile.id}
                        ref={leftTile.ref}
                      />
                    ) : null
                  })}
                </div>
                <div className="bridge-row">
                  {Array.from({ length: TOTAL_PAIRS }).map((_, pairIndex) => {
                    const rightTile = tiles.find(
                      (tile) => tile.position === "right" && Math.floor(tile.id / 2) === pairIndex,
                    )
                    return rightTile ? (
                      <GlassTile
                        key={`right-${pairIndex}`}
                        // onClick={() => handleTileClick(rightTile.id)}
                        status={rightTile.status}
                        isBreaking={breakingTileId === rightTile.id}
                        ref={rightTile.ref}
                      />
                    ) : null
                  })}
                </div>

                {/* Glass shards animation */}
                {showShards && breakingTileId !== null && (
                  <div
                    className="glass-shards-container"
                    style={{
                      left: breakPosition.left,
                      top: breakPosition.top,
                    }}
                  >
                    {shards.map((shard, i) => (
                      <div
                        key={i}
                        className="glass-shard"
                        style={{
                          width: `${shard.width}px`,
                          height: `${shard.height}px`,
                          transform: `rotate(${shard.rotation}deg)`,
                          left: `${shard.left}px`,
                          top: `${shard.top}px`,
                          opacity: 1,
                          transition: `transform 1s ease-out ${shard.delay}s, opacity 1.5s ease-out ${shard.delay + 0.5}s, top 1s ease-out ${shard.delay}s, left 1s ease-out ${shard.delay}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {gameOver && <GameOverModal score={score} onRestart={initializeGame} />}
          {victory && <VictoryModal score={score} onRestart={initializeGame} />}
        </>
      )}
    </div>
  )
}