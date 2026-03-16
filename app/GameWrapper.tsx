'use client'

import { useEffect } from 'react'
import { submitScore } from './actions'

interface GameOverMessage {
  type: 'GAME_OVER' | 'EXIT_GAME'
  player_name: string
  score: number
  max_level: number
  time_spent: number
}

export default function GameWrapper() {
  useEffect(() => {
    const handleMessage = async (e: MessageEvent<GameOverMessage>) => {
      if (e.data?.type === 'GAME_OVER' || e.data?.type === 'EXIT_GAME') {
        const { type, player_name, score, max_level, time_spent } = e.data
        console.log(`[GameWrapper] ${type} received:`, { player_name, score, max_level, time_spent })
        if (player_name && score >= 0 && max_level >= 1) {
          console.log('[GameWrapper] Submitting score...')
          try {
            await submitScore({ player_name, score, max_level, time_spent })
            console.log('[GameWrapper] Score submitted successfully')
          } catch (err) {
            console.error('[GameWrapper] Failed to submit score:', err)
          }
        } else {
          console.warn('[GameWrapper] Score not submitted - invalid data:', { player_name, score, max_level, time_spent })
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <iframe
      src="/game/index.html"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        border: 'none',
        display: 'block',
      }}
      title="משחק הלשון"
    />
  )
}
