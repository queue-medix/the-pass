"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { GameScene } from "./game-scene"
import { GameUI } from "./game-ui"
import { useGameLogic } from "./use-game-logic"

// Error fallback component
function GameErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="text-center p-8 bg-black/50 rounded-lg border border-purple-500">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Game Error</h2>
        <p className="text-purple-300 mb-4">Something went wrong loading the game.</p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// Loading component
function GameLoading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <div className="text-2xl font-bold text-yellow-400">Loading The Hustle...</div>
        <div className="text-purple-300 mt-2">Initializing 3D environment</div>
      </div>
    </div>
  )
}

export default function TheHustleGame() {
  const { cards, gridSize, gameState, selectedCard, isAnimating, winner, setGridSize, flipRandomCard, resetGame } =
    useGameLogic()

  return (
    <ErrorBoundary fallback={(error, reset) => <GameErrorFallback error={error} resetErrorBoundary={reset} />}>
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <Suspense fallback={<GameLoading />}>
          <Canvas
            shadows
            camera={{
              position: [6, 8, 6],
              fov: 60,
              near: 0.1,
              far: 1000,
            }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
            }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <GameScene
                cards={cards}
                gridSize={gridSize}
                selectedCard={selectedCard}
                isAnimating={isAnimating}
                gameState={gameState}
                winner={winner}
              />
            </Suspense>
          </Canvas>

          <GameUI
            gameState={gameState}
            gridSize={gridSize}
            winner={winner}
            isAnimating={isAnimating}
            onFlip={flipRandomCard}
            onReset={resetGame}
            onGridSizeChange={setGridSize}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
