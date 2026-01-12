import { useState, useEffect, useCallback } from 'react'
import './App.css'

const GOALS = [500000, 1000000, 2500000, 5000000, 10000000]
const STORAGE_KEY = 'savings-tracker-amount'
const DEPOSIT_AMOUNT = 400000

function formatNumber(num) {
  return num.toLocaleString('ru-RU')
}

function formatTimeRemaining(months) {
  if (months <= 0) return null
  const years = Math.floor(months / 12)
  const remainingMonths = Math.ceil(months % 12)

  if (years === 0) {
    return `${remainingMonths} мес.`
  } else if (remainingMonths === 0) {
    return `${years} г.`
  } else {
    return `${years} г. ${remainingMonths} мес.`
  }
}

function GoalCard({ goal, current }) {
  const percentage = Math.min((current / goal) * 100, 100)
  const isCompleted = current >= goal
  const remaining = goal - current
  const monthsRemaining = remaining / DEPOSIT_AMOUNT
  const timeText = formatTimeRemaining(monthsRemaining)

  return (
    <div className={`goal-card ${isCompleted ? 'completed' : ''}`}>
      <div className="goal-header">
        <span className="goal-target">{formatNumber(goal)} ₸</span>
        <span className="goal-percentage">{percentage.toFixed(1)}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="goal-footer">
        <span className="goal-current">{formatNumber(current)} ₸</span>
        <span className="goal-remaining">
          {isCompleted ? 'Достигнуто!' : `Осталось: ${formatNumber(remaining)} ₸`}
        </span>
        {!isCompleted && timeText && (
          <span className="goal-time">~ {timeText}</span>
        )}
      </div>
    </div>
  )
}

function createConfetti() {
  const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1']
  const container = document.createElement('div')
  container.className = 'confetti-container'
  document.body.appendChild(container)

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti'
    confetti.style.left = Math.random() * 100 + 'vw'
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.animationDelay = Math.random() * 0.5 + 's'
    confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's'
    container.appendChild(confetti)
  }

  setTimeout(() => container.remove(), 2500)
}

function App() {
  const [amount, setAmount] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? Number(saved) : 0
  })
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, amount.toString())
  }, [amount])

  const handleDeposit = useCallback(() => {
    setAmount(prev => prev + DEPOSIT_AMOUNT)
    createConfetti()
  }, [])

  const handleStartEdit = () => {
    setInputValue(amount.toString())
    setIsEditing(true)
  }

  const handleSave = () => {
    const newAmount = Number(inputValue.replace(/\s/g, '')) || 0
    setAmount(Math.max(0, newAmount))
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="total-amount" onClick={handleStartEdit}>
          {isEditing ? (
            <input
              type="text"
              className="amount-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <span className="amount-display">
              {formatNumber(amount)} ₸
            </span>
          )}
        </div>
        <button className="deposit-btn" onClick={handleDeposit}>
          Внести 400к
        </button>
      </header>

      <main className="goals-container">
        <div className="goals-list">
          {GOALS.map((goal) => (
            <GoalCard key={goal} goal={goal} current={amount} />
          ))}
        </div>
      </main>

      </div>
  )
}

export default App
