'use client'

import { useEffect, useState } from 'react'
import { submitScore } from './actions'

interface GameOverMessage {
  type: 'GAME_OVER'
  player_name: string
  score: number
  max_level: number
}

export default function GameWrapper() {
  const [locked, setLocked] = useState(false)

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
    <>
      <iframe
        src="/game/index.html"
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
          display: 'block',
        }}
        title="משחק הלשון"
      />

      {/* כפתור עצירה - תמיד נראה */}
      <button
        onClick={() => setLocked(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 3000,
          padding: '12px 20px',
          background: '#c0392b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        ⏹ עצור
      </button>

      {/* שכבת עצירה שחורה */}
      {locked && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'black',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => setLocked(false)}
            style={{
              padding: '16px 32px',
              background: '#2c3e50',
              color: 'white',
              border: '2px solid #7f8c8d',
              borderRadius: '10px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            ▶ חזרה למשחק
          </button>
        </div>
      )}
    </>
  )
}
