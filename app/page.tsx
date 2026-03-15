import GameWrapper from './GameWrapper'
import Leaderboard from './Leaderboard'

export default function Home() {
  return (
    <main style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      <GameWrapper />
      <Leaderboard />
    </main>
  )
}
