import { calculateStats } from '../utils/stats'

function CharacterDetails({ characters, onDelete }) {
  const characterList = Object.values(characters)

  if (characterList.length === 0) {
    return (
      <section className="character-details">
        <h2>Character Details</h2>
        <p className="empty-state">Character stats will appear here after recording rolls.</p>
      </section>
    )
  }

  const sorted = characterList
    .map(char => ({
      ...char,
      stats: calculateStats(char.rolls)
    }))
    .sort((a, b) => b.createdAt - a.createdAt)

  return (
    <section className="character-details">
      <h2>Character Details</h2>
      {sorted.map(char => {
        const { stats } = char
        const luckClass = stats.luckScore > 0.5 ? 'luck-positive' :
                         stats.luckScore < -0.5 ? 'luck-negative' : 'luck-neutral'
        const recentRolls = [...char.rolls].reverse().slice(0, 20)

        return (
          <div key={char.name} className="character-card">
            <div className="character-card-header">
              <div className="character-card-name">{char.name}</div>
              <button
                className="delete-btn"
                onClick={() => onDelete(char.name)}
              >
                Delete
              </button>
            </div>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-value">{stats.totalRolls}</div>
                <div className="stat-label">Total Rolls</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">
                  {stats.totalRolls > 0 ? stats.average.toFixed(2) : '—'}
                </div>
                <div className="stat-label">Average</div>
              </div>
              <div className="stat-box">
                <div className={`stat-value ${luckClass}`}>
                  {stats.totalRolls > 0
                    ? (stats.luckScore > 0 ? '+' : '') + stats.luckScore.toFixed(2)
                    : '—'}
                </div>
                <div className="stat-label">Luck Score</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{ color: '#4ade80' }}>
                  {stats.critSuccesses}
                </div>
                <div className="stat-label">Nat 20s</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{ color: '#f87171' }}>
                  {stats.critFails}
                </div>
                <div className="stat-label">Nat 1s</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">
                  {stats.totalRolls > 0 ? `${stats.highest} / ${stats.lowest}` : '—'}
                </div>
                <div className="stat-label">High / Low</div>
              </div>
            </div>
            {recentRolls.length > 0 && (
              <div className="roll-history">
                <div className="roll-history-title">Recent rolls (newest first):</div>
                <div className="roll-list">
                  {recentRolls.map((roll, idx) => {
                    let chipClass = 'roll-chip'
                    if (roll === 20) chipClass += ' crit-success'
                    else if (roll === 1) chipClass += ' crit-fail'
                    return (
                      <span key={idx} className={chipClass}>{roll}</span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

export default CharacterDetails
