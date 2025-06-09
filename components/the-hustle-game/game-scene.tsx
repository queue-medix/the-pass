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
      {/* Simplified lighting for better compatibility */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#8B5CF6" />

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
