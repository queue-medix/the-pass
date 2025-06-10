"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import dynamic from "next/dynamic"

// Dynamically import the GameScene to avoid SSR issues
const GameScene = dynamic(() => import("./game-scene").then(mod => ({ default: mod.GameScene })), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>
})

// Dynamically import GameUI to avoid SSR issues
const GameUI = dynamic(() => import("./game-ui").then(mod => ({ default: mod.GameUI })), {
  ssr: false
})

// Import your game logic hook
// const { useGameLogic } = dynamic(() => import("./use-game-logic"), { ssr: false })

// Error fallback component
function GameErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  console.error("Game Error:", error)
  
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950">
      <div className="text-center p-8 bg-black/50 rounded-lg border border-purple-500 max-w-md mx-4">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Game Error</h2>
        <p className="text-purple-300 mb-4">Something went wrong loading the game.</p>
        <details className="text-left mb-4">
          <summary className="text-sm text-purple-400 cursor-pointer mb-2">Error Details</summary>
          <pre className="text-xs text-red-300 bg-black/30 p-2 rounded overflow-auto max-h-32">
            {error.message}
            {error.stack && <div className="mt-2 text-xs">{error.stack}</div>}
          </pre>
        </details>
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <div className="text-2xl font-bold text-yellow-400">Loading The Hustle...</div>
        <div className="text-purple-300 mt-2">Initializing 3D environment</div>
      </div>
    </div>
  )
}

export default function TheHustleGame() {
  const [mounted, setMounted] = useState(false)
  const [webGLSupported, setWebGLSupported] = useState(true)
  
  // Temporarily mock your game logic until we fix the 3D rendering
  const mockGameState = {
    cards: [],
    gridSize: 4,
    gameState: "playing",
    selectedCard: null,
    isAnimating: false,
    winner: null,
    setGridSize: () => {},
    flipRandomCard: () => {},
    resetGame: () => {}
  }

  // Set initial camera position for optimal viewing angle
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([6, 8, 6])

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      console.warn("WebGL not supported")
      setWebGLSupported(false)
    } else {
      console.log("✅ WebGL is supported")
    }
    
    canvas.remove()
  }, [])

  // Adjust camera position based on grid size
  useEffect(() => {
    const distance = 6 + mockGameState.gridSize * 0.3
    setCameraPosition([distance, distance * 1.2, distance])
  }, [mockGameState.gridSize])

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true)
    
    // Debug logging
    console.log("Environment:", {
      isClient: typeof window !== 'undefined',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      webGLSupported,
    })
  }, [webGLSupported])

  // Don't render until mounted (prevents SSR issues)
  if (!mounted) {
    return <GameLoading />
  }

  // Show error if WebGL is not supported
  if (!webGLSupported) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950">
        <div className="text-center p-8 bg-black/50 rounded-lg border border-red-500 max-w-md mx-4">
          <h2 className="text-2xl font-bold text-red-400 mb-4">WebGL Not Supported</h2>
          <p className="text-purple-300 mb-4">Your browser doesn't support WebGL, which is required for 3D graphics.</p>
          <p className="text-sm text-purple-400">Please try using a modern browser like Chrome, Firefox, or Safari.</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary 
      fallbackRender={({ error, resetErrorBoundary }) => 
        <GameErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      }
      onError={(error, errorInfo) => {
        console.error("React Error Boundary caught an error:", error, errorInfo)
      }}
    >
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950 font-sans overflow-hidden">
        {/* Particle Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.4),transparent_50%)]" />
          {/* Floating coins/particles - Only show when PASS is found */}
          {mockGameState.winner &&
            Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full opacity-60 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
        </div>

        {/* Game Title */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl">
            The Hustle
          </h1>
          <p className="text-xl text-yellow-300 font-semibold tracking-wider mt-2">SALARY FOR LIFE</p>
        </div>

        {/* 3D Game Scene */}
        <Suspense fallback={<GameLoading />}>
          <Canvas
            shadows
            camera={{
              position: cameraPosition,
              fov: 45,
            }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
              failIfMajorPerformanceCaveat: false, // Allow fallback to software rendering
            }}
            dpr={[1, 2]}
            onCreated={({ gl, camera, scene }) => {
              console.log("✅ Canvas created successfully")
              console.log("WebGL Context:", gl.getContext())
              console.log("Renderer info:", gl.info)
              gl.setClearColor("#1a103d", 1)
            }}
            onError={(error) => {
              console.error("❌ Canvas creation error:", error)
            }}
          >
            <Suspense fallback={null}>
              {/* Simple fallback scene for testing */}
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#8B5CF6" />
              </mesh>
              
              {/* Your actual GameScene component - uncomment when ready */}
             <GameScene
                cards={mockGameState.cards}
                gridSize={mockGameState.gridSize}
                selectedCard={mockGameState.selectedCard}
                isAnimating={mockGameState.isAnimating}
                gameState={mockGameState.gameState}
                winner={mockGameState.winner}
              /> 
            </Suspense>
          </Canvas>
        </Suspense>

        {/* Game UI - Uncomment when ready */}
         <GameUI
          gameState={mockGameState.gameState}
          gridSize={mockGameState.gridSize}
          winner={mockGameState.winner}
          isAnimating={mockGameState.isAnimating}
          onFlip={mockGameState.flipRandomCard}
          onReset={mockGameState.resetGame}
          onGridSizeChange={mockGameState.setGridSize}
        /> 
        
        {/* Debug info */}
        <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded text-white text-xs">
          <div>Mounted: ✅</div>
          <div>WebGL: {webGLSupported ? '✅' : '❌'}</div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
