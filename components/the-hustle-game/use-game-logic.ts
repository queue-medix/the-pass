"use client"

import { useState, useCallback, useEffect } from "react"
import { nanoid } from "nanoid"
import { GAME_CONFIG, CARD_TYPES, type GameCard, type CardType } from "@/lib/game-constants"

type GameState = "idle" | "lifting" | "revealing" | "showing" | "returning" | "finished"

export function useGameLogic() {
  const [cards, setCards] = useState<GameCard[]>([])
  const [gridSize, setGridSize] = useState(GAME_CONFIG.DEFAULT_GRID_SIZE)
  const [gameState, setGameState] = useState<GameState>("idle")
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  // Initialize game grid
  
  const initializeGame = useCallback(() => {
    const newCards: GameCard[] = []
    const totalCards = gridSize * gridSize

    // Randomly choose which position gets the PASS card
    const passCardIndex = Math.floor(Math.random() * totalCards)

    let cardIndex = 0
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const cardType: CardType = cardIndex === passCardIndex ? CARD_TYPES.PASS : CARD_TYPES.DUD

        const card: GameCard = {
          id: nanoid(),
          type: cardType,
          position: [
            (x - (gridSize - 1) / 2) * (1 + GAME_CONFIG.CARD_SPACING),
            GAME_CONFIG.PLATFORM_HEIGHT / 2 + GAME_CONFIG.CARD_HEIGHT / 2,
            (z - (gridSize - 1) / 2) * (1 + GAME_CONFIG.CARD_SPACING),
          ],
          gridX: x,
          gridZ: z,
          isFlipped: false,
          isSelected: false,
        }

        newCards.push(card)
        cardIndex++
      }
    }

    setCards(newCards)
    setGameState("idle")
    setSelectedCard(null)
    setWinner(null)
  }, [gridSize])

  // Initialize game when component mounts or grid size changes
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const flipRandomCard = useCallback(() => {
    if (gameState !== "idle" || isAnimating) return

    // Get all unflipped cards (only cards that haven't been revealed yet)
    const unflippedCards = cards.filter((card) => !card.isFlipped)
    if (unflippedCards.length === 0) return

    // Select random card
    const randomIndex = Math.floor(Math.random() * unflippedCards.length)
    const cardToFlip = unflippedCards[randomIndex]

    setGameState("lifting")
    setIsAnimating(true)
    setSelectedCard(cardToFlip)

    // Update the card as selected
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardToFlip.id ? { ...card, isSelected: true } : { ...card, isSelected: false },
      ),
    )

    // Phase 1: Lift card and transform to big size (2 seconds)
    setTimeout(() => {
      setGameState("revealing")

      // Phase 2: Flip the card to show front side (1.5 seconds)
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) => (card.id === cardToFlip.id ? { ...card, isFlipped: true } : card)),
        )

        setGameState("showing")

        // Phase 3: Show the revealed card (2.5 seconds)
        setTimeout(() => {
          if (cardToFlip.type === CARD_TYPES.PASS) {
            // For PASS card, keep it displayed and end the game
            setWinner("PASS CARD FOUND!")
            setGameState("finished")
            setIsAnimating(false)
          } else {
            // For DUD cards, return to grid but keep them flipped
            setGameState("returning")

            setTimeout(() => {
              setCards((prevCards) =>
                prevCards.map((card) => (card.id === cardToFlip.id ? { ...card, isSelected: false } : card)),
              )
              setSelectedCard(null)
              setIsAnimating(false)
              setGameState("idle")
            }, 1500) // Time to return to grid
          }
        }, 2500) // Time to show the revealed card
      }, 1500) // Time for the flip animation
    }, 2000) // Time for lifting and transforming
  }, [cards, gameState, isAnimating])

  const resetGame = useCallback(() => {
    initializeGame()
  }, [initializeGame])

  return {
    cards,
    gridSize,
    gameState,
    selectedCard,
    isAnimating,
    winner,
    setGridSize,
    flipRandomCard,
    resetGame,
  }
}
