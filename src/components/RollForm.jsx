import { useState, useRef } from 'react'

function RollForm({ characters, onRoll }) {
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [rollValue, setRollValue] = useState('')
  const rollInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedCharacter) {
      alert('Please select a character')
      return
    }
    if (onRoll(selectedCharacter, rollValue)) {
      setRollValue('')
      rollInputRef.current?.focus()
    }
  }

  return (
    <section className="roll-section">
      <h2>Record a Roll</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={selectedCharacter}
          onChange={(e) => setSelectedCharacter(e.target.value)}
          required
        >
          <option value="">Select character...</option>
          {characters.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input
          ref={rollInputRef}
          type="number"
          min="1"
          max="20"
          value={rollValue}
          onChange={(e) => setRollValue(e.target.value)}
          placeholder="Roll (1-20)"
          required
        />
        <button type="submit">Record Roll</button>
      </form>
    </section>
  )
}

export default RollForm
