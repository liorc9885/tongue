'use client'

import { useEffect } from 'react'
import { submitScore } from './actions'

interface GameOverMessage {
  type: 'GAME_OVER'
  player_name: string
  score: number
  max_level: number
}

export default function GameWrapper() {
  useEffect(() => {
    const handleMessage = async (e: MessageEvent<GameOverMessage>) => {
      if (e.data?.type === 'GAME_OVER') {
        const { player_name, score, max_level } = e.data
        if (player_name && score >= 0 && max_level >= 1) {
          try {
            await submitScore({ player_name, score, max_level })
          } catch (err) {
            console.error('Failed to submit score:', err)
          }
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
