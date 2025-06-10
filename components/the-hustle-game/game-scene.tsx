"use client"

import type React from "react"
import { Environment, SoftShadows, OrbitControls } from "@react-three/drei"
import { GamePlatform } from "./game-platform"
import { GameCard } from "./game-card"
import { LightingSetup } from "./lighting-setup"
import { ParticleSystem } from "./particle-system"
import type { GameCard as GameCardType } from "@/lib/game-constants"
import { GAME_CONFIG } from "@/lib/game-constants"
import { useEffect } from "react"

interface GameSceneProps {
  cards: GameCardType[]
  gridSize: number
  selectedCard: GameCardType | null
  isAnimating: boolean
  gameState: string
  winner: string | null
}

export const GameScene: React.FC<GameSceneProps> = ({
  cards,
  gridSize,
  selectedCard,
  isAnimating,
  gameState,
  winner,
}) => {
  // Center position for the revealed card
  const centerPosition: [number, number, number] = [0, 0, 0]

  useEffect(() => {
    console.log("GameScene rendered with:", {
      cardsLength: cards.length,
      gridSize,
      gameState,
      selectedCard: selectedCard?.id,
    })
  }, [cards.length, gridSize, gameState, selectedCard])

  return (
    <>
      {/* Ambient light - Purple tint like screenshot */}
      <ambientLight intensity={0.3} color="#8B5CF6" />

      {/* Main directional light - Warm white */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light from the side - Purple */}
      <directionalLight position={[-5, 5, 5]} intensity={0.6} color="#A855F7" />

      {/* Rim light - Golden */}
      <directionalLight position={[0, 5, -10]} intensity={0.8} color="#FFD700" />

      {/* Point light for dramatic effect - Purple */}
      <pointLight position={[0, 8, 0]} intensity={1.5} color="#8B5CF6" distance={20} decay={2} />

      {/* Spot light for card highlighting - Golden */}
      <spotLight
        position={[0, 10, 5]}
        intensity={2}
        color="#FFD700"
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={20}
        decay={2}
        castShadow
      />

      {/* Soft shadows */}
      <SoftShadows size={25} samples={16} focus={0.5} />

      {/* Game Platform */}
      <GamePlatform gridSize={gridSize} />

      {/* Game Cards */}
      {cards.map((card) => (
        <GameCard
          key={card.id}
          card={card}
          isSelected={card.id === selectedCard?.id}
          isAnimating={isAnimating}
          gameState={gameState}
          gridSize={gridSize}
          centerPosition={centerPosition}
          shouldReturnToGrid={card.type !== "PASS"}
        />
      ))}

      {/* Particle Effects - Only show when PASS is found */}
      {winner && selectedCard?.type === "PASS" && selectedCard.isFlipped && (
        <ParticleSystem position={[centerPosition[0], GAME_CONFIG.FLIP_HEIGHT, centerPosition[2]]} />
      )}

      {/* Additional lighting setup */}
      <LightingSetup />

      {/* Environment with fallback */}
      <Environment preset="night" />

      {/* Camera controls for debugging */}
      <OrbitControls
        target={GAME_CONFIG.CAMERA_TARGET}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
        minDistance={8}
        maxDistance={20}
        enablePan={false}
        autoRotate={false}
        autoRotateSpeed={0}
        enableRotate={false}
        enableZoom={true}
      />
    </>
  )
}
