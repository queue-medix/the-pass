"use client"

import type React from "react"
import { useMemo } from "react"
import * as THREE from "three"
import { GAME_CONFIG } from "@/lib/game-constants"

interface GamePlatformProps {
  gridSize: number
}

export const GamePlatform: React.FC<GamePlatformProps> = ({ gridSize }) => {
  const platformSize = useMemo(() => {
    return gridSize * (1 + GAME_CONFIG.CARD_SPACING) + 1
  }, [gridSize])

  return (
    <group>
      {/* Main Platform with simple material */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[platformSize, GAME_CONFIG.PLATFORM_HEIGHT, platformSize]} />
        <meshStandardMaterial
          color="#4c1d95"
          roughness={0.2}
          metalness={0.8}
          emissive="#7c3aed"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Platform Glow Effect */}
      <mesh position={[0, -GAME_CONFIG.PLATFORM_HEIGHT / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[platformSize + 0.5, platformSize + 0.5]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Subtle Grid Lines - embedded in platform */}
      {Array.from({ length: gridSize + 1 }).map((_, i) => {
        const pos = (i - gridSize / 2) * (1 + GAME_CONFIG.CARD_SPACING)
        return (
          <group key={`grid-${i}`}>
            {/* Horizontal lines */}
            <mesh position={[0, GAME_CONFIG.PLATFORM_HEIGHT / 2 + 0.002, pos]}>
              <boxGeometry args={[platformSize * 0.9, 0.005, 0.02]} />
              <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
            </mesh>
            {/* Vertical lines */}
            <mesh position={[pos, GAME_CONFIG.PLATFORM_HEIGHT / 2 + 0.002, 0]}>
              <boxGeometry args={[0.02, 0.005, platformSize * 0.9]} />
              <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
