export const GAME_CONFIG = {
  DEFAULT_GRID_SIZE: 6,
  MIN_GRID_SIZE: 4,
  MAX_GRID_SIZE: 8,
  CARD_HEIGHT: 0.01, // Very thin like a real card
  CARD_WIDTH: 0.9,
  CARD_DEPTH: 0.9,
  PLATFORM_HEIGHT: 0.4,
  CARD_SPACING: 0.05,
  ANIMATION_DURATION: 2500, // Slower animation
  FLIP_DURATION: 1500, // Specific flip duration
  FLIP_HEIGHT: 3,
  CAMERA_POSITION: [6, 8, 6] as [number, number, number],
  CAMERA_TARGET: [0, 0, 0] as [number, number, number],
  BORDER_RADIUS: 0.02,
  PLATFORM_BORDER_RADIUS: 0.2,
  REVEALED_SCALE: 3,
  REVEALED_ASPECT_RATIO: 4 / 5, // 4:5 aspect ratio when revealed
}

export const CARD_TYPES = {
  DUD: "DUD",
  PASS: "PASS",
} as const

export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES]

export interface GameCard {
  id: string
  type: CardType
  position: [number, number, number]
  gridX: number
  gridZ: number
  isFlipped: boolean
  isSelected: boolean
}
