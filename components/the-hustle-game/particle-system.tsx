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

  const particleCount = 200
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6
      positions[i * 3 + 1] = Math.random() * 4 - 1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return positions
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.elapsedTime
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      // Make particles move outward and upward
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      // Get current position
      const x = positions[ix]
      const y = positions[iy]
      const z = positions[iz]

      // Calculate distance from center
      const dist = Math.sqrt(x * x + z * z)

      // Move particles outward and upward
      positions[iy] += 0.02 // Move up

      // Move outward from center
      if (dist < 5) {
        const angle = Math.atan2(z, x)
        positions[ix] += Math.cos(angle) * 0.01
        positions[iz] += Math.sin(angle) * 0.01
      }

      // Reset particles that go too far
      if (positions[iy] > 5) {
        positions[ix] = (Math.random() - 0.5) * 2
        positions[iy] = -1
        positions[iz] = (Math.random() - 0.5) * 2
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y = time * 0.1
  })

  return (
    <group position={position}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fbbf24"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}
