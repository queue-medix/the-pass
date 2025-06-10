"use client"

import { useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Box, Text } from "@react-three/drei"

// Simple debug scene to test if Three.js is working at all
export function DebugScene() {
  const meshRef = useRef<any>()
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    console.log("Debug Scene mounted")
    console.log("WebGL Renderer:", gl)
    console.log("Scene:", scene)
    console.log("Camera:", camera)
    console.log("Canvas element:", gl.domElement)
  }, [gl, scene, camera])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Simple test geometry */}
      <Box ref={meshRef} position={[0, 0, 0]} args={[2, 2, 2]}>
        <meshStandardMaterial color="orange" />
      </Box>

      {/* Test text */}
      <Text position={[0, 3, 0]} fontSize={1} color="white" anchorX="center" anchorY="middle">
        THREE.JS WORKING
      </Text>

      {/* Test platform */}
      <Box position={[0, -2, 0]} args={[8, 0.2, 8]}>
        <meshStandardMaterial color="purple" />
      </Box>
    </>
  )
}
