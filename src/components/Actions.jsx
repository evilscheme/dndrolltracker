import { useState } from 'react'
import { generateExportText } from '../utils/stats'

function Actions({ characters, onReset }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const hasCharacters = Object.keys(characters).length > 0
  const hasRolls = Object.values(characters).some(char => char.rolls.length > 0)

  const handleResetClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmReset = () => {
    onReset()
    setShowConfirm(false)
  }

  const handleCancelReset = () => {
    setShowConfirm(false)
  }

  const handleExport = async () => {
    const text = generateExportText(characters)
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard. Please try again.')
    }
  }

  if (!hasCharacters) {
    return null
  }

  return (
    <section className="actions">
      <h2>Actions</h2>
      <div className="action-buttons">
        <button
          className="export-btn"
          onClick={handleExport}
          disabled={!hasRolls}
          title={hasRolls ? 'Copy leaderboard to clipboard' : 'No rolls to export'}
        >
          {copySuccess ? '✓ Copied!' : '📋 Export to Clipboard'}
        </button>
        <button
          className="reset-btn"
          onClick={handleResetClick}
          disabled={!hasRolls}
          title={hasRolls ? 'Reset all roll data' : 'No rolls to reset'}
        >
          🔄 Reset All Rolls
        </button>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3>⚠️ Reset All Rolls?</h3>
            <p>This will clear all roll data for every character.</p>
            <p>Characters will be kept, but their stats will be reset to zero.</p>
            <p><strong>This cannot be undone!</strong></p>
            <div className="confirm-buttons">
              <button className="cancel-btn" onClick={handleCancelReset}>
                Cancel
              </button>
              <button className="danger-btn" onClick={handleConfirmReset}>
                Yes, Reset All Rolls
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Actions
