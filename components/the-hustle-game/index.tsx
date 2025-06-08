"use client"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { GameScene } from "./game-scene"
import { GameUI } from "./game-ui"
import { useGameLogic } from "./use-game-logic"
import { GAME_CONFIG } from "@/lib/game-constants"
import { useEffect, useState } from "react"

export default function TheHustleGame() {
  const { cards, gridSize, gameState, selectedCard, isAnimating, winner, setGridSize, flipRandomCard, resetGame } =
    useGameLogic()

  // Set initial camera position for optimal viewing angle
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([6, 8, 6])

  // Adjust camera position based on grid size
  useEffect(() => {
    const distance = 6 + gridSize * 0.3
    setCameraPosition([distance, distance * 1.2, distance])
  }, [gridSize])

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950 font-sans overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.4),transparent_50%)]" />
        {/* Floating coins/particles - Only show when PASS is found */}
        {winner &&
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
      <Canvas
        shadows
        camera={{
          position: cameraPosition,
          fov: 45,
        }}
      >
        <GameScene
          cards={cards}
          gridSize={gridSize}
          selectedCard={selectedCard}
          isAnimating={isAnimating}
          gameState={gameState}
          winner={winner}
        />
        <OrbitControls
          target={GAME_CONFIG.CAMERA_TARGET}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 3}
          minDistance={8}
          maxDistance={20}
          enablePan={false}
          autoRotate={false}
          autoRotateSpeed={0}
          enableRotate={false} // Lock rotation for consistent view
          enableZoom={true}
        />
      </Canvas>

      {/* Game UI */}
      <GameUI
        gameState={gameState}
        gridSize={gridSize}
        winner={winner}
        isAnimating={isAnimating}
        onFlip={flipRandomCard}
        onReset={resetGame}
        onGridSizeChange={setGridSize}
      />
    </div>
  )
}
