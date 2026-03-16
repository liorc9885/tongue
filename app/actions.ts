'use server'

export type ScoreEntry = {
  player_name: string
  score: number
  max_level: number
  time_spent?: number
  created_at?: string
}

export async function submitScore(data: Omit<ScoreEntry, 'created_at'>): Promise<void> {
  console.log('[submitScore] called with:', JSON.stringify(data))

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[submitScore] Missing Supabase environment variables. SUPABASE_URL set:', !!supabaseUrl, 'SUPABASE_KEY set:', !!supabaseKey)
    throw new Error('Missing Supabase environment variables')
  }

  console.log('[submitScore] POSTing to Supabase:', `${supabaseUrl}/rest/v1/scores`)

  const res = await fetch(`${supabaseUrl}/rest/v1/scores`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[submitScore] Failed. Status:', res.status, 'Body:', text)
    throw new Error(`Failed to submit score: ${text}`)
  }

  console.log('[submitScore] Success. Status:', res.status)
}

export async function getLeaderboard(): Promise<ScoreEntry[]> {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return []
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/scores?order=score.desc&limit=20&select=player_name,score,max_level,time_spent,created_at`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) return []
  return res.json()
}

export async function getLeaderboardByLevel(): Promise<ScoreEntry[]> {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return []
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/scores?order=max_level.desc,score.desc&limit=20&select=player_name,score,max_level,time_spent`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) return []
  return res.json()
}
