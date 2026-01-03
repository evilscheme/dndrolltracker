import { calculateStats } from '../utils/stats'

function Leaderboard({ characters }) {
  const characterList = Object.values(characters)

  if (characterList.length === 0) {
    return (
      <section className="leaderboard">
        <h2>Luck Leaderboard</h2>
        <p className="expected-info">Expected D20 average: <strong>10.5</strong></p>
        <p className="empty-state">No characters added yet. Add a character to start tracking!</p>
      </section>
    )
  }

  const ranked = characterList
    .map(char => ({
      ...char,
      stats: calculateStats(char.rolls)
    }))
    .sort((a, b) => b.stats.luckScore - a.stats.luckScore)

  return (
    <section className="leaderboard">
      <h2>Luck Leaderboard</h2>
      <p className="expected-info">Expected D20 average: <strong>10.5</strong></p>
      {ranked.map((char, index) => {
        const rank = index + 1
        const { stats } = char
        const luckClass = stats.luckScore > 0.5 ? 'luck-positive' :
                         stats.luckScore < -0.5 ? 'luck-negative' : 'luck-neutral'
        const luckSign = stats.luckScore > 0 ? '+' : ''

        return (
          <div key={char.name} className="leaderboard-item">
            <div className={`rank rank-${rank}`}>#{rank}</div>
            <div className="character-info">
              <div className="character-name">{char.name}</div>
              <div className="roll-count">
                {stats.totalRolls} roll{stats.totalRolls !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="luck-score">
              <div className={`luck-value ${luckClass}`}>
                {stats.totalRolls > 0 ? luckSign + stats.luckScore.toFixed(2) : '—'}
              </div>
              <div className="luck-label">luck score</div>
              <div className="average-display">
                {stats.totalRolls > 0 ? `avg: ${stats.average.toFixed(2)}` : 'No rolls yet'}
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default Leaderboard
