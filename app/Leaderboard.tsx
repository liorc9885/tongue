'use client'

import { useState, useTransition } from 'react'
import { getLeaderboard, ScoreEntry } from './actions'

export default function Leaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function openLeaderboard() {
    startTransition(async () => {
      const data = await getLeaderboard()
      setScores(data)
      setOpen(true)
    })
  }

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .leaderboard-modal {
            min-width: unset !important;
            width: 95vw !important;
            padding: 14px !important;
            font-size: 13px;
          }
          .leaderboard-modal h2 {
            font-size: 18px !important;
          }
          .leaderboard-th, .leaderboard-td {
            padding: 5px 4px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
      {/* Leaderboard trigger button */}
      <button
        onClick={openLeaderboard}
        disabled={isPending}
        style={{
          position: 'fixed',
          top: '110px',
          right: '20px',
          zIndex: 1000,
          background: 'rgba(0,0,0,0.75)',
          color: '#FFD700',
          border: '2px solid #FFD700',
          borderRadius: '20px',
          padding: '8px 20px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: isPending ? 'wait' : 'pointer',
          fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
          direction: 'rtl',
        }}
      >
        {isPending ? '...' : '🏆 טופ'}
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="leaderboard-modal"
            style={{
              background: '#1a1a2e',
              border: '2px solid #FFD700',
              borderRadius: '16px',
              padding: '24px',
              minWidth: '340px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              direction: 'rtl',
              fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
              color: '#fff',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, color: '#FFD700', fontSize: '24px' }}>🏆 לוח התוצאות</h2>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '24px',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Table */}
            {scores.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#aaa' }}>אין תוצאות עדיין</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #444' }}>
                    <th className="leaderboard-th" style={{ padding: '8px', textAlign: 'right', color: '#FFD700' }}>#</th>
                    <th className="leaderboard-th" style={{ padding: '8px', textAlign: 'right', color: '#FFD700' }}>שם</th>
                    <th className="leaderboard-th" style={{ padding: '8px', textAlign: 'center', color: '#FFD700' }}>ניקוד ⭐</th>
                    <th className="leaderboard-th" style={{ padding: '8px', textAlign: 'center', color: '#FFD700' }}>שלב</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((s, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: '1px solid #333',
                        background: i === 0 ? 'rgba(255,215,0,0.1)' : 'transparent',
                      }}
                    >
                      <td className="leaderboard-td" style={{ padding: '8px', color: i === 0 ? '#FFD700' : '#aaa' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </td>
                      <td className="leaderboard-td" style={{ padding: '8px' }}>{s.player_name}</td>
                      <td className="leaderboard-td" style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{s.score}</td>
                      <td className="leaderboard-td" style={{ padding: '8px', textAlign: 'center' }}>{s.max_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  )
}
