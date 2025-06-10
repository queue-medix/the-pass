"use client"
import { Suspense, useEffect, useState } from "react"

// Simple loading component
function GameLoading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <div className="text-2xl font-bold text-yellow-400">Loading The Hustle...</div>
        <div className="text-purple-300 mt-2">Preparing your game experience</div>
      </div>
    </div>
  )
}

// Error fallback component
function GameError() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700">
      <div className="text-center">
        <div className="text-6xl mb-4">🎮</div>
        <div className="text-2xl font-bold text-white mb-2">Game Loading Error</div>
        <div className="text-red-200">Please refresh the page to try again</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-white text-red-800 rounded-lg font-semibold hover:bg-gray-100"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [GameComponent, setGameComponent] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Try to load the game component
    const loadGame = async () => {
      try {
        const { default: TheHustleGame } = await import("@/components/the-hustle-game")
        setGameComponent(() => TheHustleGame)
      } catch (err) {
        console.error("Failed to load game:", err)
        setError(true)
      }
    }

    loadGame()
  }, [])

  if (error) {
    return <GameError />
  }

  if (!GameComponent) {
    return <GameLoading />
  }

  return (
    <Suspense fallback={<GameLoading />}>
      <GameComponent />
    </Suspense>
  )
}
