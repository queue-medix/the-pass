"use client"

import type React from "react"
import { Environment, SoftShadows } from "@react-three/drei"
import { GamePlatform } from "./game-platform"
import { GameCard } from "./game-card"
import { LightingSetup } from "./lighting-setup"
import { ParticleSystem } from "./particle-system"
import type { GameCard as GameCardType } from "@/lib/game-constants"
import { GAME_CONFIG } from "@/lib/game-constants"

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

  return (
    <>
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
        />
      ))}

      {/* Particle Effects - Only show when PASS is found */}
      {winner && selectedCard?.type === "PASS" && selectedCard.isFlipped && (
        <ParticleSystem position={[centerPosition[0], GAME_CONFIG.FLIP_HEIGHT, centerPosition[2]]} />
      )}

      <LightingSetup />
      <Environment preset="night" />
    </>
  )
}
