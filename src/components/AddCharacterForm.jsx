import { useState } from 'react'

function AddCharacterForm({ onAdd }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onAdd(name)) {
      setName('')
    }
  }

  return (
    <section className="add-character">
      <h2>Add Character</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Character name"
          required
        />
        <button type="submit">Add Character</button>
      </form>
    </section>
  )
}

export default AddCharacterForm
