"use client"

import type React from "react"
import { Shuffle, RotateCcw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GAME_CONFIG } from "@/lib/game-constants"

interface GameUIProps {
  gameState: string
  gridSize: number
  winner: string | null
  isAnimating: boolean
  onFlip: () => void
  onReset: () => void
  onGridSizeChange: (size: number) => void
}

export const GameUI: React.FC<GameUIProps> = ({
  gameState,
  gridSize,
  winner,
  isAnimating,
  onFlip,
  onReset,
  onGridSizeChange,
}) => {
  const canFlip = gameState === "idle" && !isAnimating

  return (
    <>
      {/* Winner Announcement */}
      {winner && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-2xl text-4xl font-bold shadow-2xl animate-pulse">
            🎉 {winner} 🎉
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4">
          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="bg-purple-800/80 border-purple-600 text-white hover:bg-purple-700/80 rounded-full px-6"
              >
                <Settings className="w-5 h-5 mr-2" />
                {gridSize}x{gridSize}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="center">
              {Array.from({ length: GAME_CONFIG.MAX_GRID_SIZE - GAME_CONFIG.MIN_GRID_SIZE + 1 }, (_, i) => {
                const size = GAME_CONFIG.MIN_GRID_SIZE + i
                return (
                  <DropdownMenuItem
                    key={size}
                    onSelect={() => onGridSizeChange(size)}
                    className={size === gridSize ? "bg-purple-100" : ""}
                  >
                    {size}x{size} Grid
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Flip Button */}
          <Button
            onClick={onFlip}
            disabled={!canFlip}
            size="lg"
            className={`
              px-12 py-6 text-2xl font-bold rounded-full transition-all duration-300 transform
              ${
                canFlip
                  ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black hover:scale-105 shadow-2xl hover:shadow-yellow-500/50"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <Shuffle className="w-6 h-6 mr-3" />
            FLIP
          </Button>

          {/* Reset Button */}
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="bg-purple-800/80 border-purple-600 text-white hover:bg-purple-700/80 rounded-full px-6"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Game Status */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20 text-center">
        <div className="bg-black/50 backdrop-blur-sm rounded-xl px-6 py-3">
          <p className="text-white text-lg font-semibold">
            {gameState === "idle" && "Click FLIP to reveal a card!"}
            {gameState === "flipping" && "Flipping card..."}
            {gameState === "revealed" && "Card revealed!"}
            {gameState === "finished" && "Game Over!"}
          </p>
        </div>
      </div>

      {/* Prize Display */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-bold text-xl">
          ₦96,000
        </div>
      </div>
    </>
  )
}
