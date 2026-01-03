const EXPECTED_AVERAGE = 10.5

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
