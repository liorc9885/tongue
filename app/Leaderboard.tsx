'use client'

import { useState, useTransition } from 'react'
import { getLeaderboard, getLeaderboardByLevel, ScoreEntry } from './actions'

type Tab = 'score' | 'fastest' | 'level'

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function Leaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('score')
  const [isPending, startTransition] = useTransition()

  function openLeaderboard(tab: Tab = 'score') {
    setActiveTab(tab)
    startTransition(async () => {
      const data = tab === 'level' ? await getLeaderboardByLevel() : await getLeaderboard()
      setScores(data)
      setOpen(true)
    })
  }

  function switchTab(tab: Tab) {
    setActiveTab(tab)
    startTransition(async () => {
      const data = tab === 'level' ? await getLeaderboardByLevel() : await getLeaderboard()
      setScores(data)
    })
  }

  function getDisplayedScores(): ScoreEntry[] {
    if (activeTab === 'fastest') {
      return [...scores].sort((a, b) => {
        const effA = a.time_spent && a.time_spent > 0 ? a.score / a.time_spent : 0
        const effB = b.time_spent && b.time_spent > 0 ? b.score / b.time_spent : 0
        return effB - effA
      })
    }
    return scores
  }

  const displayed = getDisplayedScores()

  const tabStyle = (tab: Tab): React.CSSProperties => ({
    flex: 1,
    padding: '7px 4px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: isPending ? 'wait' : 'pointer',
    border: '1px solid',
    borderColor: activeTab === tab ? '#FFD700' : '#555',
    borderRadius: '8px',
    background: activeTab === tab ? 'rgba(255,215,0,0.15)' : 'transparent',
    color: activeTab === tab ? '#FFD700' : '#aaa',
    fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
    transition: 'all 0.15s',
  })

  return (
    <>
      {/* Leaderboard trigger button */}
      <button
        onClick={() => openLeaderboard('score')}
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
            style={{
              background: '#1a1a2e',
              border: '2px solid #FFD700',
              borderRadius: '16px',
              padding: '24px',
              minWidth: '360px',
              maxWidth: '92vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              direction: 'rtl',
              fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
              color: '#fff',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
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

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              <button style={tabStyle('score')} onClick={() => switchTab('score')}>⭐ הכי הרבה</button>
              <button style={tabStyle('fastest')} onClick={() => switchTab('fastest')}>⚡ הכי מהיר</button>
              <button style={tabStyle('level')} onClick={() => switchTab('level')}>🎯 שלב גבוה</button>
            </div>

            {/* Loading indicator */}
            {isPending && (
              <p style={{ textAlign: 'center', color: '#aaa' }}>טוען...</p>
            )}

            {/* Table */}
            {!isPending && displayed.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#aaa' }}>אין תוצאות עדיין</p>
            ) : !isPending && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #444' }}>
                    <th style={{ padding: '8px', textAlign: 'right', color: '#FFD700' }}>#</th>
                    <th style={{ padding: '8px', textAlign: 'right', color: '#FFD700' }}>שם</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#FFD700' }}>
                      {activeTab === 'level' ? '🎯 שלב' : '⭐ ניקוד'}
                    </th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#FFD700' }}>
                      {activeTab === 'level' ? '⭐ ניקוד' : activeTab === 'fastest' ? '⚡ יעילות' : '🎯 שלב'}
                    </th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#FFD700' }}>⏱ זמן</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((s, i) => {
                    const efficiency = s.time_spent && s.time_spent > 0
                      ? (s.score / s.time_spent * 60).toFixed(1)
                      : '—'
                    return (
                      <tr
                        key={i}
                        style={{
                          borderBottom: '1px solid #333',
                          background: i === 0 ? 'rgba(255,215,0,0.1)' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '8px', color: i === 0 ? '#FFD700' : '#aaa' }}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                        </td>
                        <td style={{ padding: '8px' }}>{s.player_name}</td>
                        <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                          {activeTab === 'level' ? s.max_level : s.score}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          {activeTab === 'level' ? s.score : activeTab === 'fastest' ? `${efficiency}/דק` : s.max_level}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center', color: '#aaa' }}>
                          {s.time_spent ? formatTime(s.time_spent) : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  )
}
