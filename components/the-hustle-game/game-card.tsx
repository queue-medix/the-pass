"use client"

import type React from "react"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { GAME_CONFIG, type GameCard as GameCardType } from "@/lib/game-constants"

interface GameCardProps {
  card: GameCardType
  isSelected: boolean
  isAnimating: boolean
  gameState: string
  gridSize: number
  centerPosition: [number, number, number]
}

export const GameCard: React.FC<GameCardProps> = ({
  card,
  isSelected,
  isAnimating,
  gameState,
  gridSize,
  centerPosition,
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const cardRef = useRef<THREE.Mesh>(null)
  const cardBackTexture = useTexture(
    "https://static.vecteezy.com/system/resources/thumbnails/009/743/071/small_2x/crest-ship-classic-logo-template-free-vector.jpg",
  )

  // Ensure texture is properly set up
  useMemo(() => {
    if (cardBackTexture) {
      cardBackTexture.wrapS = cardBackTexture.wrapT = THREE.RepeatWrapping
      cardBackTexture.repeat.set(1, 1)
      cardBackTexture.encoding = THREE.sRGBEncoding
    }
  }, [cardBackTexture])

  // Calculate target position, rotation, and scale for the card
  const { targetPosition, targetRotation, targetScale } = useMemo(() => {
    // Default values when in grid
    let pos = [...card.position] as [number, number, number]
    let rot = [0, 0, 0] as [number, number, number]
    let scale = [1, 1, 1] as [number, number, number]

    // If card is flipped but not selected, show it face-up in the grid
    if (card.isFlipped && !isSelected) {
      rot = [0, 0, Math.PI] // Face-up in grid
    }

    // When selected and animating
    if (isSelected && isAnimating) {
      // Position the card in the center of the screen
      pos = [
        centerPosition[0], // Center X
        GAME_CONFIG.FLIP_HEIGHT, // Height
        centerPosition[2] - 1, // Slightly forward from center Z
      ]

      // Different rotations based on game state
      if (gameState === "lifting") {
        // Card lifts up, still showing back, faces user directly
        rot = [Math.PI * 0.47, 0, 0] // Face user, back side visible
      } else if (gameState === "revealing" || gameState === "showing" || gameState === "returning") {
        // Card flips to show front side, still facing user
        rot = [Math.PI * 0.47, 0, Math.PI] // Face user, front side visible
      }

      // Scale up when lifted
      if (gameState !== "returning") {
        scale = [
          GAME_CONFIG.REVEALED_SCALE, // Width
          GAME_CONFIG.REVEALED_SCALE / GAME_CONFIG.REVEALED_ASPECT_RATIO, // Height (taller for 4:5)
          GAME_CONFIG.REVEALED_SCALE, // Depth
        ]
      } else {
        // Scale back down when returning
        scale = [1, 1, 1]
      }
    }

    return { targetPosition: pos, targetRotation: rot, targetScale: scale }
  }, [card.position, card.isFlipped, isSelected, isAnimating, gameState, centerPosition])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Different animation speeds for different phases
    let positionSpeed = delta * 2
    let rotationSpeed = delta * 2
    let scaleSpeed = delta * 2

    if (gameState === "lifting") {
      positionSpeed = delta * 1.2 // Slower lifting
      scaleSpeed = delta * 1.2
    } else if (gameState === "revealing") {
      rotationSpeed = delta * 1.5 // Slower flip
    } else if (gameState === "returning") {
      positionSpeed = delta * 2.5 // Faster return
      scaleSpeed = delta * 2.5
    }

    // Animate position
    groupRef.current.position.lerp(new THREE.Vector3(...targetPosition), positionSpeed)

    // Animate rotation
    const targetRot = new THREE.Euler(...targetRotation)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.x, rotationSpeed)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot.y, rotationSpeed)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.z, rotationSpeed)

    // Animate scale
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale[0], scaleSpeed)
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale[1], scaleSpeed)
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale[2], scaleSpeed)

    // Add subtle floating animation when selected and showing
    if (isSelected && gameState === "showing") {
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.02
    }
  })

  // Create materials for different sides of the card
  const materials = useMemo(() => {
    // Front material (PASS = bright gold, DUD = red) - Match screenshot colors
    const frontMaterial = new THREE.MeshStandardMaterial({
      color: card.type === "PASS" ? "#FFD700" : "#dc2626", // Bright gold for PASS
      roughness: card.type === "PASS" ? 0.1 : 0.3,
      metalness: card.type === "PASS" ? 0.8 : 0.1,
      emissive: card.type === "PASS" ? "#FFA500" : "#991b1b", // Orange glow for PASS
      emissiveIntensity: card.type === "PASS" ? 0.3 : 0.1,
    })

    // Back material with pattern/image - Purple tint to match screenshot
    const backMaterial = new THREE.MeshStandardMaterial({
      color: cardBackTexture ? "#E6E6FA" : "#4C1D95", // Light purple tint
      roughness: 0.4,
      metalness: 0.2,
      map: cardBackTexture,
      emissive: isSelected ? "#8B5CF6" : "#4C1D95", // Purple glow
      emissiveIntensity: isSelected ? 0.4 : 0.2,
    })

    // If no texture, create a purple pattern
    if (!cardBackTexture) {
      backMaterial.emissive = new THREE.Color("#8B5CF6")
      backMaterial.emissiveIntensity = isSelected ? 0.6 : 0.3
    }

    // Return array of materials for each face of the box
    return [
      backMaterial, // right
      backMaterial, // left
      backMaterial, // top
      backMaterial, // bottom
      frontMaterial, // front (DUD/PASS side - plain color)
      backMaterial, // back (image/pattern side)
    ]
  }, [card.type, cardBackTexture, isSelected])

  // Determine which side is currently visible
  const showingFront = card.isFlipped

  return (
    <group ref={groupRef} position={card.position}>
      {/* Card Body */}
      <mesh ref={cardRef} castShadow receiveShadow>
        <boxGeometry args={[GAME_CONFIG.CARD_WIDTH, GAME_CONFIG.CARD_HEIGHT, GAME_CONFIG.CARD_DEPTH]} />
        {materials.map((material, index) => (
          <primitive key={index} object={material} attach={`material-${index}`} />
        ))}
      </mesh>

      {/* Card Text - Front Side (DUD/PASS) - Written on the card surface */}
      {showingFront && (
        <group position={[0, GAME_CONFIG.CARD_HEIGHT / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            fontSize={isSelected ? 0.4 : 0.25}
            font="/fonts/Geist-Bold.ttf"
            color={card.type === "PASS" ? "#006400" : "#ffffff"} // Dark green for PASS (like screenshot)
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor={card.type === "PASS" ? "#004000" : "#000000"}
            fontWeight="bold"
          >
            {card.type}
          </Text>
        </group>
      )}

      {/* Card Number - Back Side (with image/pattern) - Written on the card surface */}
      {!showingFront && (
        <group position={[0, GAME_CONFIG.CARD_HEIGHT / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            fontSize={isSelected ? 0.2 : 0.15}
            color="#ffffff" // White fill
            anchorX="center"
            anchorY="middle"
            font="/fonts/Geist-Regular.ttf"
            outlineWidth={0.01} // Black stroke
            outlineColor="#000000"
          >
            {card.gridX * gridSize + card.gridZ + 1}
          </Text>
        </group>
      )}

      {/* Card Border Highlight - Purple glow like screenshot */}
      {isSelected && (
        <mesh position={[0, GAME_CONFIG.CARD_HEIGHT / 2 + 0.002, 0]}>
          <planeGeometry args={[GAME_CONFIG.CARD_WIDTH * 1.05, GAME_CONFIG.CARD_DEPTH * 1.05]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Decorative pattern on card back when no texture - Purple pattern */}
      {!showingFront && !cardBackTexture && (
        <group position={[0, GAME_CONFIG.CARD_HEIGHT / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`line-${i}`} position={[(i - 2) * 0.15, 0, 0]}>
              <planeGeometry args={[0.02, 0.8]} />
              <meshBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
            </mesh>
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`line-h-${i}`} position={[0, 0, (i - 2) * 0.15]}>
              <planeGeometry args={[0.8, 0.02]} />
              <meshBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}
