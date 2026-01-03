import { useState, useEffect } from 'react'
import AddCharacterForm from './components/AddCharacterForm'
import RollForm from './components/RollForm'
import Leaderboard from './components/Leaderboard'
import CharacterDetails from './components/CharacterDetails'

const STORAGE_KEY = 'dndRollTracker'

function App() {
  const [characters, setCharacters] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
  }, [characters])

  const addCharacter = (name) => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      alert('Please enter a character name')
      return false
    }
    if (characters[trimmedName]) {
      alert('A character with this name already exists')
      return false
    }

    setCharacters(prev => ({
      ...prev,
      [trimmedName]: {
        name: trimmedName,
        rolls: [],
        createdAt: Date.now()
      }
    }))
    return true
  }

  const recordRoll = (characterName, rollValue) => {
    if (!characters[characterName]) {
      alert('Character not found')
      return false
    }

    const roll = parseInt(rollValue, 10)
    if (isNaN(roll) || roll < 1 || roll > 20) {
      alert('Please enter a valid roll between 1 and 20')
      return false
    }

    setCharacters(prev => ({
      ...prev,
      [characterName]: {
        ...prev[characterName],
        rolls: [...prev[characterName].rolls, roll]
      }
    }))
    return true
  }

  const deleteCharacter = (name) => {
    if (confirm(`Are you sure you want to delete ${name} and all their rolls?`)) {
      setCharacters(prev => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const characterList = Object.keys(characters).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  )

  return (
    <div className="container">
      <header>
        <h1>D&D Roll Tracker</h1>
        <p className="subtitle">Track your party's luck with D20 rolls</p>
      </header>

      <AddCharacterForm onAdd={addCharacter} />

      <RollForm
        characters={characterList}
        onRoll={recordRoll}
      />

      <Leaderboard characters={characters} />

      <CharacterDetails
        characters={characters}
        onDelete={deleteCharacter}
      />
    </div>
  )
}

export default App
