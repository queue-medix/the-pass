"use client"

import type React from "react"
import { Environment, OrbitControls } from "@react-three/drei"
import type { GameCard as GameCardType } from "@/lib/game-constants"

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
  const platformSize = gridSize * 1.5 + 1

  return (
    <>
      {/* Basic lighting */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#8B5CF6" />

      {/* Simple platform */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[platformSize, 0.2, platformSize]} />
        <meshStandardMaterial color="#4c1d95" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Simple cards */}
      {cards.map((card) => {
        const isSelected = card.id === selectedCard?.id
        const cardPosition = isSelected && isAnimating ? ([0, 2, 0] as [number, number, number]) : card.position

        return (
          <group key={card.id} position={cardPosition}>
            {/* Card body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.05, 0.8]} />
              <meshStandardMaterial
                color={card.isFlipped ? (card.type === "PASS" ? "#FFD700" : "#DC2626") : "#8B5CF6"}
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>

            {/* Card number/text - using simple geometry instead of Text component */}
            {!card.isFlipped && (
              <mesh position={[0, 0.03, 0]}>
                <planeGeometry args={[0.3, 0.3]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
              </mesh>
            )}

            {/* Card content when flipped */}
            {card.isFlipped && (
              <mesh position={[0, 0.03, 0]}>
                <planeGeometry args={[0.6, 0.4]} />
                <meshBasicMaterial color={card.type === "PASS" ? "#1F2937" : "#FFFFFF"} transparent opacity={0.9} />
              </mesh>
            )}
          </group>
        )
      })}

      {/* Particle effects for winner */}
      {winner && selectedCard?.type === "PASS" && (
        <group position={[0, 3, 0]}>
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 4, Math.random() * 2, (Math.random() - 0.5) * 4]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="#FFD700" />
            </mesh>
          ))}
        </group>
      )}

      {/* Environment */}
      <Environment preset="night" />

      {/* Camera controls */}
      <OrbitControls
        target={[0, 0, 0]}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
        minDistance={8}
        maxDistance={20}
        enablePan={false}
        enableRotate={false}
        enableZoom={true}
      />
    </>
  )
}
