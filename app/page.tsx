"use client"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamically import the game with no SSR
const TheHustleGame = dynamic(() => import("@/components/the-hustle-game"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <div className="text-2xl font-bold text-yellow-400">Loading The Hustle...</div>
        <div className="text-purple-300 mt-2">Preparing your game experience</div>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <div className="text-2xl font-bold text-yellow-400">Loading The Hustle...</div>
            <div className="text-purple-300 mt-2">Preparing your game experience</div>
          </div>
        </div>
      }
    >
      <TheHustleGame />
    </Suspense>
  )
}
