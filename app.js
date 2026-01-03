// D&D Roll Tracker Application

const EXPECTED_AVERAGE = 10.5; // Expected average for a D20

// Data storage
let characters = {};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('dndRollTracker');
    if (saved) {
        characters = JSON.parse(saved);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('dndRollTracker', JSON.stringify(characters));
}

// Calculate statistics for a character
function calculateStats(rolls) {
    if (rolls.length === 0) {
        return {
            average: 0,
            luckScore: 0,
            totalRolls: 0,
            critSuccesses: 0,
            critFails: 0,
            highest: 0,
            lowest: 0
        };
    }

    const total = rolls.reduce((sum, roll) => sum + roll, 0);
    const average = total / rolls.length;
    const luckScore = average - EXPECTED_AVERAGE;
    const critSuccesses = rolls.filter(r => r === 20).length;
    const critFails = rolls.filter(r => r === 1).length;
    const highest = Math.max(...rolls);
    const lowest = Math.min(...rolls);

    return {
        average: average,
        luckScore: luckScore,
        totalRolls: rolls.length,
        critSuccesses: critSuccesses,
        critFails: critFails,
        highest: highest,
        lowest: lowest
    };
}

// Add a new character
function addCharacter(name) {
    const trimmedName = name.trim();
    if (!trimmedName) {
        alert('Please enter a character name');
        return false;
    }
    if (characters[trimmedName]) {
        alert('A character with this name already exists');
        return false;
    }

    characters[trimmedName] = {
        name: trimmedName,
        rolls: [],
        createdAt: Date.now()
    };

    saveData();
    updateUI();
    return true;
}

// Record a roll for a character
function recordRoll(characterName, rollValue) {
    if (!characters[characterName]) {
        alert('Character not found');
        return false;
    }

    const roll = parseInt(rollValue, 10);
    if (isNaN(roll) || roll < 1 || roll > 20) {
        alert('Please enter a valid roll between 1 and 20');
        return false;
    }

    characters[characterName].rolls.push(roll);
    saveData();
    updateUI();
    return true;
}

// Delete a character
function deleteCharacter(name) {
    if (confirm(`Are you sure you want to delete ${name} and all their rolls?`)) {
        delete characters[name];
        saveData();
        updateUI();
    }
}

// Update the character select dropdown
function updateCharacterSelect() {
    const select = document.getElementById('character-select');
    const currentValue = select.value;

    // Clear existing options except the first
    select.innerHTML = '<option value="">Select character...</option>';

    // Add character options sorted alphabetically
    Object.keys(characters)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });

    // Restore selection if still valid
    if (characters[currentValue]) {
        select.value = currentValue;
    }
}

// Update the leaderboard
function updateLeaderboard() {
    const container = document.getElementById('leaderboard-container');

    const characterList = Object.values(characters);

    if (characterList.length === 0) {
        container.innerHTML = '<p class="empty-state">No characters added yet. Add a character to start tracking!</p>';
        return;
    }

    // Calculate stats and sort by luck score (highest first)
    const ranked = characterList
        .map(char => ({
            ...char,
            stats: calculateStats(char.rolls)
        }))
        .sort((a, b) => b.stats.luckScore - a.stats.luckScore);

    container.innerHTML = ranked.map((char, index) => {
        const rank = index + 1;
        const stats = char.stats;
        const luckClass = stats.luckScore > 0.5 ? 'luck-positive' :
                         stats.luckScore < -0.5 ? 'luck-negative' : 'luck-neutral';
        const luckSign = stats.luckScore > 0 ? '+' : '';

        return `
            <div class="leaderboard-item">
                <div class="rank rank-${rank}">#${rank}</div>
                <div class="character-info">
                    <div class="character-name">${escapeHtml(char.name)}</div>
                    <div class="roll-count">${stats.totalRolls} roll${stats.totalRolls !== 1 ? 's' : ''}</div>
                </div>
                <div class="luck-score">
                    <div class="luck-value ${luckClass}">
                        ${stats.totalRolls > 0 ? luckSign + stats.luckScore.toFixed(2) : '—'}
                    </div>
                    <div class="luck-label">luck score</div>
                    <div class="average-display">
                        ${stats.totalRolls > 0 ? 'avg: ' + stats.average.toFixed(2) : 'No rolls yet'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update character details section
function updateCharacterDetails() {
    const container = document.getElementById('character-details-container');

    const characterList = Object.values(characters);

    if (characterList.length === 0) {
        container.innerHTML = '<p class="empty-state">Character stats will appear here after recording rolls.</p>';
        return;
    }

    // Sort by most recent roll activity
    const sorted = characterList
        .map(char => ({
            ...char,
            stats: calculateStats(char.rolls)
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

    container.innerHTML = sorted.map(char => {
        const stats = char.stats;
        const luckClass = stats.luckScore > 0.5 ? 'luck-positive' :
                         stats.luckScore < -0.5 ? 'luck-negative' : 'luck-neutral';

        // Get last 20 rolls for display (most recent first)
        const recentRolls = [...char.rolls].reverse().slice(0, 20);

        return `
            <div class="character-card">
                <div class="character-card-header">
                    <div class="character-card-name">${escapeHtml(char.name)}</div>
                    <button class="delete-btn" onclick="deleteCharacter('${escapeHtml(char.name)}')">Delete</button>
                </div>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-value">${stats.totalRolls}</div>
                        <div class="stat-label">Total Rolls</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${stats.totalRolls > 0 ? stats.average.toFixed(2) : '—'}</div>
                        <div class="stat-label">Average</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value ${luckClass}">${stats.totalRolls > 0 ? (stats.luckScore > 0 ? '+' : '') + stats.luckScore.toFixed(2) : '—'}</div>
                        <div class="stat-label">Luck Score</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value" style="color: #4ade80;">${stats.critSuccesses}</div>
                        <div class="stat-label">Nat 20s</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value" style="color: #f87171;">${stats.critFails}</div>
                        <div class="stat-label">Nat 1s</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value">${stats.totalRolls > 0 ? stats.highest : '—'} / ${stats.totalRolls > 0 ? stats.lowest : '—'}</div>
                        <div class="stat-label">High / Low</div>
                    </div>
                </div>
                ${recentRolls.length > 0 ? `
                    <div class="roll-history">
                        <div class="roll-history-title">Recent rolls (newest first):</div>
                        <div class="roll-list">
                            ${recentRolls.map(roll => {
                                let chipClass = 'roll-chip';
                                if (roll === 20) chipClass += ' crit-success';
                                else if (roll === 1) chipClass += ' crit-fail';
                                return `<span class="${chipClass}">${roll}</span>`;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update all UI elements
function updateUI() {
    updateCharacterSelect();
    updateLeaderboard();
    updateCharacterDetails();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateUI();

    // Add character form
    document.getElementById('add-character-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('character-name');
        if (addCharacter(nameInput.value)) {
            nameInput.value = '';
        }
    });

    // Roll form
    document.getElementById('roll-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const characterSelect = document.getElementById('character-select');
        const rollInput = document.getElementById('roll-value');

        if (!characterSelect.value) {
            alert('Please select a character');
            return;
        }

        if (recordRoll(characterSelect.value, rollInput.value)) {
            rollInput.value = '';
            rollInput.focus();
        }
    });
});
