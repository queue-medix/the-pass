import TheHustleGame from "@/components/the-hustle-game"
import { Suspense } from "react"

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-2xl">Loading...</div>}>
      <TheHustleGame />
    </Suspense>
  )
}
