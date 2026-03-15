'use server'

export type ScoreEntry = {
  player_name: string
  score: number
  max_level: number
  created_at?: string
}

export async function submitScore(data: Omit<ScoreEntry, 'created_at'>): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

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
    throw new Error(`Failed to submit score: ${text}`)
  }
}

export async function getLeaderboard(): Promise<ScoreEntry[]> {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return []
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/scores?order=score.desc&limit=20&select=player_name,score,max_level,created_at`,
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
