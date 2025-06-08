"use client"

import type React from "react"

export const LightingSetup: React.FC = () => {
  return (
    <>
      {/* Ambient light - Purple tint like screenshot */}
      <ambientLight intensity={0.3} color="#8B5CF6" />

      {/* Main directional light - Warm white */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light from the side - Purple */}
      <directionalLight position={[-5, 5, 5]} intensity={0.6} color="#A855F7" />

      {/* Rim light - Golden */}
      <directionalLight position={[0, 5, -10]} intensity={0.8} color="#FFD700" />

      {/* Point light for dramatic effect - Purple */}
      <pointLight position={[0, 8, 0]} intensity={1.5} color="#8B5CF6" distance={20} decay={2} />

      {/* Spot light for card highlighting - Golden */}
      <spotLight
        position={[0, 10, 5]}
        intensity={2}
        color="#FFD700"
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={20}
        decay={2}
        castShadow
      />
    </>
  )
}
