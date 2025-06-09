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
  shouldReturnToGrid?: boolean // New prop to control return behavior
}

export const GameCard: React.FC<GameCardProps> = ({
  card,
  isSelected,
  isAnimating,
  gameState,
  gridSize,
  centerPosition,
  shouldReturnToGrid = true, // Default to true for existing behavior
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
      cardBackTexture.colorSpace = THREE.SRGBColorSpace
    }
  }, [cardBackTexture])

  // Calculate card number (1 to n, left to right, top to bottom)
  const cardNumber = useMemo(() => {
    return card.gridZ * gridSize + card.gridX + 1
  }, [card.gridX, card.gridZ, gridSize])

  // Calculate target position, rotation, and scale for the card
  const { targetPosition, targetRotation, targetScale } = useMemo(() => {
    // Default values when in grid
    let pos = [...card.position] as [number, number, number]
    let rot = [0, 0, 0] as [number, number, number] // Default: back side up (Z rotation = 0)
    let scale = [1, 1, 1] as [number, number, number]

    // If card is flipped but not selected, show it face-up in the grid
    if (card.isFlipped && !isSelected) {
      rot = [0, 0, Math.PI] // Z rotation = 180° shows front side
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
        // Card lifts up, still showing back, tilts toward user
        rot = [Math.PI * 0.47, 0, 0] // Tilt toward user, back side visible (Z = 0)
      } else if (gameState === "revealing" || gameState === "showing" || gameState === "returning") {
        // Card flips to show front side, still tilted toward user
        rot = [Math.PI * 0.47, 0, Math.PI] // Tilt toward user, front side visible (Z = 180°)
      }

      // Scale up when lifted
      if (gameState !== "returning" || !shouldReturnToGrid) {
        scale = [
          GAME_CONFIG.REVEALED_SCALE, // Width
          GAME_CONFIG.REVEALED_SCALE / GAME_CONFIG.REVEALED_ASPECT_RATIO, // Height (taller for 4:5)
          GAME_CONFIG.REVEALED_SCALE, // Depth
        ]
      } else {
        // Scale back down when returning (only if shouldReturnToGrid is true)
        scale = [1, 1, 1]
      }
    }

    // Special handling for PASS cards - keep them in center position if they shouldn't return
    if (card.type === "PASS" && !shouldReturnToGrid && card.isFlipped) {
      pos = [
        centerPosition[0], // Center X
        GAME_CONFIG.FLIP_HEIGHT, // Height
        centerPosition[2] - 1, // Slightly forward from center Z
      ]
      rot = [Math.PI * 0.47, 0, Math.PI] // Tilt toward user, front side visible
      scale = [
        GAME_CONFIG.REVEALED_SCALE, // Width
        GAME_CONFIG.REVEALED_SCALE / GAME_CONFIG.REVEALED_ASPECT_RATIO, // Height
        GAME_CONFIG.REVEALED_SCALE, // Depth
      ]
    }

    return { targetPosition: pos, targetRotation: rot, targetScale: scale }
  }, [card.position, card.isFlipped, card.type, isSelected, isAnimating, gameState, centerPosition, shouldReturnToGrid])

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
    } else if (gameState === "returning" && shouldReturnToGrid) {
      positionSpeed = delta * 2.5 // Faster return
      scaleSpeed = delta * 2.5
    }

    // Don't animate position/scale for PASS cards that shouldn't return
    if (card.type === "PASS" && !shouldReturnToGrid && card.isFlipped) {
      positionSpeed = delta * 0.5 // Very slow, minimal adjustment
      scaleSpeed = delta * 0.5
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

    // Add subtle floating animation when selected and showing, or for PASS cards that stay revealed
    if ((isSelected && gameState === "showing") || (card.type === "PASS" && !shouldReturnToGrid && card.isFlipped)) {
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.02
    }
  })

  // Determine which side is currently visible based on Z rotation
  // Z rotation of 0 = back side visible, Z rotation of π = front side visible
  const currentZRotation = groupRef.current?.rotation.z || targetRotation[2]
  const showingFront = Math.abs(currentZRotation) > Math.PI / 2 // Front visible when Z rotation is close to π

  // Create materials for card sides
  const materials = useMemo(() => {
    // BACK SIDE material: Game logo/image with numbers
    const backMaterial = new THREE.MeshStandardMaterial({
      color: "#8B5CF6", // Purple base color
      roughness: 0.4,
      metalness: 0.2,
      map: cardBackTexture,
      emissive: isSelected ? "#7C3AED" : "#4C1D95",
      emissiveIntensity: isSelected ? 0.4 : 0.2,
    })

    // FRONT SIDE material: Plain solid color
    const frontMaterial = new THREE.MeshStandardMaterial({
      color: card.type === "PASS" ? "#FFD700" : "#DC2626", // Gold for PASS, red for DUD
      roughness: card.type === "PASS" ? 0.1 : 0.3,
      metalness: card.type === "PASS" ? 0.8 : 0.1,
      emissive: card.type === "PASS" ? "#FFA500" : "#B91C1C",
      emissiveIntensity: card.type === "PASS" ? 0.4 : 0.2,
    })

    // Box geometry face order: [+X, -X, +Y, -Y, +Z, -Z]
    // For a card lying flat: +Y = top face (what we see), -Y = bottom face
    return [
      backMaterial, // right edge (+X)
      backMaterial, // left edge (-X)
      backMaterial, // top face (+Y) - this is what we see normally (back with texture)
      frontMaterial, // bottom face (-Y) - this becomes visible when flipped (front with color)
      backMaterial, // front edge (+Z)
      backMaterial, // back edge (-Z)
    ]
  }, [card.type, cardBackTexture, isSelected])

  return (
    <group ref={groupRef} position={card.position}>
      {/* Card Body */}
      <mesh ref={cardRef} castShadow receiveShadow>
        <boxGeometry args={[GAME_CONFIG.CARD_WIDTH, GAME_CONFIG.CARD_HEIGHT, GAME_CONFIG.CARD_DEPTH]} />
        {materials.map((material, index) => (
          <primitive key={index} object={material} attach={`material-${index}`} />
        ))}
      </mesh>

      {/* FRONT SIDE TEXT: DUD/PASS (visible when Z rotation ≈ π) */}
      {showingFront && (
        <group position={[0, -GAME_CONFIG.CARD_HEIGHT / 2 - 0.002, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
          <Text
            fontSize={0.3}
            font="/fonts/Geist-Bold.ttf"
            color={card.type === "PASS" ? "#1F2937" : "#FFFFFF"} // Dark text on gold, white on red
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.03}
            outlineColor={card.type === "PASS" ? "#92400E" : "#000000"}
            fontWeight="bold"
          >
            {card.type}
          </Text>
        </group>
      )}

      {/* BACK SIDE TEXT: Numbers (visible when Z rotation ≈ 0) */}
      {!showingFront && (
        <group position={[0, GAME_CONFIG.CARD_HEIGHT / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Text
            fontSize={isSelected ? 0.25 : 0.18}
            color="#FFFFFF" // White text
            anchorX="center"
            anchorY="middle"
            font="/fonts/Geist-Bold.ttf"
            outlineWidth={0.02}
            outlineColor="#000000" // Black outline for visibility
            fontWeight="bold"
          >
            {cardNumber}
          </Text>
        </group>
      )}

      {/* Card Border Highlight */}
      {(isSelected || (card.type === "PASS" && !shouldReturnToGrid && card.isFlipped)) && (
        <mesh position={[0, GAME_CONFIG.CARD_HEIGHT / 2 + 0.003, 0]}>
          <planeGeometry args={[GAME_CONFIG.CARD_WIDTH * 1.1, GAME_CONFIG.CARD_DEPTH * 1.1]} />
          <meshBasicMaterial color="#A855F7" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Fallback pattern ONLY on back side when no texture */}
      {!showingFront && !cardBackTexture && (
        <group position={[0, GAME_CONFIG.CARD_HEIGHT / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Create a decorative pattern */}
          <mesh>
            <planeGeometry args={[0.8, 0.8]} />
            <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
          </mesh>
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={`line-${i}`} position={[(i - 1) * 0.2, 0, 0.001]}>
              <planeGeometry args={[0.03, 0.6]} />
              <meshBasicMaterial color="#A855F7" transparent opacity={0.8} />
            </mesh>
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={`line-h-${i}`} position={[0, (i - 1) * 0.2, 0.001]}>
              <planeGeometry args={[0.6, 0.03]} />
              <meshBasicMaterial color="#A855F7" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}
