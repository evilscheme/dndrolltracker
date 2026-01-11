export const EXPECTED_AVERAGE = 10.5

export function calculateStats(rolls) {
  if (rolls.length === 0) {
    return {
      average: 0,
      luckScore: 0,
      totalRolls: 0,
      critSuccesses: 0,
      critFails: 0,
      highest: 0,
      lowest: 0
    }
  }

  const total = rolls.reduce((sum, roll) => sum + roll, 0)
  const average = total / rolls.length
  const luckScore = average - EXPECTED_AVERAGE
  const critSuccesses = rolls.filter(r => r === 20).length
  const critFails = rolls.filter(r => r === 1).length
  const highest = Math.max(...rolls)
  const lowest = Math.min(...rolls)

  return {
    average,
    luckScore,
    totalRolls: rolls.length,
    critSuccesses,
    critFails,
    highest,
    lowest
  }
}

export function generateExportText(characters) {
  const characterList = Object.values(characters)

  if (characterList.length === 0) {
    return 'No characters to export!'
  }

  const totalRolls = characterList.reduce((sum, char) => sum + char.rolls.length, 0)

  if (totalRolls === 0) {
    return 'No rolls recorded yet! Start rolling some dice! 🎲'
  }

  const ranked = characterList
    .map(char => ({
      ...char,
      stats: calculateStats(char.rolls)
    }))
    .filter(char => char.stats.totalRolls > 0)
    .sort((a, b) => b.stats.luckScore - a.stats.luckScore)

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return '  '
  }

  const getLuckEmoji = (luckScore) => {
    if (luckScore >= 3) return '🔥'
    if (luckScore >= 1) return '✨'
    if (luckScore > -1) return '😐'
    if (luckScore > -3) return '😰'
    return '💀'
  }

  const getLuckTitle = (luckScore) => {
    if (luckScore >= 3) return 'ON FIRE'
    if (luckScore >= 1) return 'Lucky'
    if (luckScore > -1) return 'Average'
    if (luckScore > -3) return 'Unlucky'
    return 'CURSED'
  }

  let output = '```\n'
  output += '╔══════════════════════════════════════╗\n'
  output += '║     🎲 D&D LUCK LEADERBOARD 🎲       ║\n'
  output += '╚══════════════════════════════════════╝\n'
  output += '```\n\n'

  ranked.forEach((char, index) => {
    const { stats } = char
    const sign = stats.luckScore >= 0 ? '+' : ''
    const medal = getMedal(index)
    const luckEmoji = getLuckEmoji(stats.luckScore)
    const luckTitle = getLuckTitle(stats.luckScore)

    output += `${medal} **${char.name}** ${luckEmoji}\n`
    output += `┣ Luck: \`${sign}${stats.luckScore.toFixed(2)}\` (${luckTitle})\n`
    output += `┣ Average: \`${stats.average.toFixed(2)}\` over ${stats.totalRolls} rolls\n`

    const extras = []
    if (stats.critSuccesses > 0) extras.push(`🎯 ${stats.critSuccesses} nat 20${stats.critSuccesses > 1 ? 's' : ''}`)
    if (stats.critFails > 0) extras.push(`💥 ${stats.critFails} nat 1${stats.critFails > 1 ? 's' : ''}`)

    if (extras.length > 0) {
      output += `┗ ${extras.join(' • ')}\n`
    } else {
      output += `┗ No crits yet\n`
    }
    output += '\n'
  })

  output += `*Total: ${totalRolls} rolls across ${ranked.length} characters*\n`
  output += `*Expected average: ${EXPECTED_AVERAGE}*`

  return output
}
