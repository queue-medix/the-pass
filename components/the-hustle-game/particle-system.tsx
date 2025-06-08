"use client"

import type React from "react"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

interface ParticleSystemProps {
  position: [number, number, number]
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ position }) => {
  const pointsRef = useRef<THREE.Points>(null)
  const coinsRef = useRef<THREE.Group>(null)

  const particleCount = 150
  const coinCount = 12

  // Particle positions for sparkles
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = Math.random() * 6 - 1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return positions
  }, [])

  // Coin positions
  const coinPositions = useMemo(() => {
    return Array.from({ length: coinCount }, (_, i) => {
      const angle = (i / coinCount) * Math.PI * 2
      const radius = 3 + Math.random() * 2
      return {
        x: Math.cos(angle) * radius,
        y: Math.random() * 3 + 1,
        z: Math.sin(angle) * radius,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        floatSpeed: Math.random() * 0.5 + 0.5,
      }
    })
  }, [])

  useFrame((state) => {
    if (!pointsRef.current || !coinsRef.current) return

    const time = state.clock.elapsedTime

    // Animate sparkle particles
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      // Move particles outward and upward
      positions[iy] += 0.03 // Move up faster

      // Move outward from center
      const x = positions[ix]
      const z = positions[iz]
      const dist = Math.sqrt(x * x + z * z)

      if (dist < 6) {
        const angle = Math.atan2(z, x)
        positions[ix] += Math.cos(angle) * 0.02
        positions[iz] += Math.sin(angle) * 0.02
      }

      // Reset particles that go too far
      if (positions[iy] > 8) {
        positions[ix] = (Math.random() - 0.5) * 2
        positions[iy] = -1
        positions[iz] = (Math.random() - 0.5) * 2
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Animate coins
    coinsRef.current.children.forEach((coin, i) => {
      const coinData = coinPositions[i]
      coin.rotation.y += coinData.rotationSpeed
      coin.rotation.x = Math.sin(time * coinData.floatSpeed) * 0.1
      coin.position.y = coinData.y + Math.sin(time * coinData.floatSpeed) * 0.3
    })

    coinsRef.current.rotation.y = time * 0.1
  })

  return (
    <group position={position}>
      {/* Sparkle particles */}
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#FFD700" // Bright gold
          size={0.2}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* 3D Coins like in screenshot */}
      <group ref={coinsRef}>
        {coinPositions.map((coinData, i) => (
          <group key={i} position={[coinData.x, coinData.y, coinData.z]}>
            {/* Coin body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
              <meshStandardMaterial
                color="#FFD700" // Bright gold
                roughness={0.1}
                metalness={0.9}
                emissive="#FFA500" // Orange glow
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* "N" symbol on coin */}
            <group position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <mesh>
                <planeGeometry args={[0.4, 0.4]} />
                <meshBasicMaterial color="#B8860B" transparent opacity={0.8} />
              </mesh>
              {/* N letter */}
              <group position={[0, 0, 0.001]}>
                <mesh position={[-0.08, 0, 0]}>
                  <planeGeometry args={[0.04, 0.24]} />
                  <meshBasicMaterial color="#8B4513" />
                </mesh>
                <mesh position={[0.08, 0, 0]}>
                  <planeGeometry args={[0.04, 0.24]} />
                  <meshBasicMaterial color="#8B4513" />
                </mesh>
                <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
                  <planeGeometry args={[0.04, 0.28]} />
                  <meshBasicMaterial color="#8B4513" />
                </mesh>
              </group>
            </group>

            {/* Coin glow */}
            <mesh>
              <cylinderGeometry args={[0.35, 0.35, 0.02, 16]} />
              <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}
