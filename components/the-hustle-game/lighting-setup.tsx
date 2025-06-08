"use client"

import type React from "react"

export const LightingSetup: React.FC = () => {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />

      {/* Main directional light from optimal angle */}
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
      />

      {/* Fill light from opposite side */}
      <directionalLight position={[-4, 6, -4]} intensity={0.4} color="#a855f7" />

      {/* Top-down light for card details */}
      <directionalLight position={[0, 15, 0]} intensity={0.6} color="#ffffff" />

      {/* Accent lights for atmosphere */}
      <pointLight position={[-8, 5, -8]} intensity={0.3} color="#7c3aed" />
      <pointLight position={[8, 5, 8]} intensity={0.3} color="#a855f7" />

      {/* Golden highlight light for PASS cards */}
      <spotLight position={[0, 10, 0]} intensity={0.8} color="#fbbf24" angle={Math.PI / 3} penumbra={0.5} castShadow />
    </>
  )
}
