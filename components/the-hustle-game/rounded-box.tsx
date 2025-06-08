"use client"

import type React from "react"
import { useMemo } from "react"
import * as THREE from "three"

interface RoundedBoxProps {
  args: [number, number, number]
  radius?: number
  smoothness?: number
}

export const RoundedBoxGeometry: React.FC<RoundedBoxProps> = ({
  args: [width, height, depth],
  radius = 0.1,
  smoothness = 4,
}) => {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    const eps = 0.00001
    const radius0 = radius - eps

    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true)
    shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true)
    shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true)
    shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true)

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: smoothness,
      steps: 1,
      bevelSize: radius,
      bevelThickness: radius,
      curveSegments: smoothness,
    }

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geometry.center()

    return geometry
  }, [width, height, depth, radius, smoothness])

  return <primitive object={geometry} attach="geometry" />
}
