import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [corrections, setCorrections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fontSize, setFontSize] = useState('16')

  async function checkSpelling() {
    if (!text.trim()) {
      setError('Please enter some text first.')
      setCorrections([])
      return
    }

    setLoading(true)
    setError('')
    setCorrections([])

    try {
      const response = await fetch(
        '/correct',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        }
      )

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()
      setCorrections(data.corrections)
    } catch {
      setError('Could not connect to SpellCraft API.')
    } finally {
      setLoading(false)
    }
  }

  function handleTextChange(e) {
    const textarea = e.target

    setText(textarea.value)
    setError('')

    // Automatically adjust editor height
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  function applyCorrection(word, suggestion) {
    if (!suggestion) return

    const words = text.split(/(\s+)/)
    let corrected = false

    const updatedWords = words.map((part) => {
      if (!corrected && part === word) {
        corrected = true
        return suggestion
      }

      return part
    })

    setText(updatedWords.join(''))

    setCorrections((prev) =>
      prev.filter((item) => item.word !== word)
    )
  }

  function autoCorrect() {
    if (corrections.length === 0) return

    let updatedText = text

    corrections.forEach(({ word, suggestion }) => {
      if (!suggestion) return

      const escapedWord = word.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      )

      const regex = new RegExp(
        `\\b${escapedWord}\\b`,
        'g'
      )

      updatedText = updatedText.replace(
        regex,
        suggestion
      )
    })

    setText(updatedText)
    setCorrections([])
    setError('')

    // Resize the editor after automatic correction
    requestAnimationFrame(() => {
      const editor = document.querySelector('.editor')

      if (editor) {
        editor.style.height = 'auto'
        editor.style.height = `${editor.scrollHeight}px`
      }
    })
  }

  function changeFontSize(value) {
    setFontSize(value)

    requestAnimationFrame(() => {
      const editor = document.querySelector('.editor')

      if (editor) {
        editor.style.height = 'auto'
        editor.style.height = `${editor.scrollHeight}px`
      }
    })
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">S</div>

          <div>
            <h1>SpellCraft</h1>
            <p>Smart Writing Editor</p>
          </div>
        </div>

        <div className="document-title">
          <span>Untitled document</span>
          <span className="saved">● Saved locally</span>
        </div>

        <div className="header-actions">
          <button
            className="auto-btn"
            onClick={autoCorrect}
            disabled={loading || corrections.length === 0}
          >
            Auto Correct
          </button>

          <button
            className="check-btn"
            onClick={checkSpelling}
            disabled={loading}
          >
            {loading ? 'Checking...' : '✓ Check spelling'}
          </button>
        </div>
      </header>

      <nav className="toolbar">
        <button
          className="tool-btn"
          onClick={() =>
            changeFontSize(
              String(Math.max(14, Number(fontSize) - 2))
            )
          }
          aria-label="Decrease font size"
        >
          −
        </button>

        <select
          aria-label="Font size"
          value={fontSize}
          onChange={(e) => changeFontSize(e.target.value)}
        >
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="20">20</option>
          <option value="24">24</option>
        </select>

        <button
          className="tool-btn"
          onClick={() =>
            changeFontSize(
              String(Math.min(24, Number(fontSize) + 2))
            )
          }
          aria-label="Increase font size"
        >
          +
        </button>

        <span className="toolbar-divider" />

        <span className="toolbar-label">Document</span>
        <span className="toolbar-hint">
          Your writing space
        </span>
      </nav>

      <main className="workspace">
        <section className="document-area">
          <div className="paper">
            <div className="paper-heading">
              <span>Untitled document</span>
              <span className="paper-status">Editing</span>
            </div>

            <textarea
              className="editor"
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here to check spelling..."
              style={{ fontSize: `${fontSize}px` }}
              spellCheck={false}
            />

            <div className="paper-footer">
              <span>
                {text.trim()
                  ? text.trim().split(/\s+/).length
                  : 0}{' '}
                words
              </span>

              <span>{text.length} characters</span>
            </div>
          </div>
        </section>

        <aside className="suggestions-panel">
          <div className="panel-heading">
            <div>
              <h2>Writing assistant</h2>
              <p>Spelling suggestions</p>
            </div>

            <span className="sparkle">✦</span>
          </div>

          {error && <p className="error">{error}</p>}

          {!error && corrections.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✓</div>

              <h3>Ready to review</h3>

              <p>
                Write your text and click Check spelling
                to find mistakes in your document.
              </p>
            </div>
          )}

          {corrections.length > 0 && (
            <>
              <p className="issue-count">
                {corrections.length} suggestion
                {corrections.length > 1 ? 's' : ''} found
              </p>

              {corrections.map((item, index) => (
                <div
                  className="suggestion-card"
                  key={`${item.word}-${index}`}
                >
                  <p className="issue-label">Spelling</p>

                  <p className="wrong-word">
                    {item.word}
                  </p>

                  {item.suggestion ? (
                    <button
                      className="suggestion-btn"
                      onClick={() =>
                        applyCorrection(
                          item.word,
                          item.suggestion
                        )
                      }
                    >
                      {item.suggestion}
                      <span>Apply</span>
                    </button>
                  ) : (
                    <p className="no-suggestion">
                      No suggestion available
                    </p>
                  )}
                </div>
              ))}
            </>
          )}
        </aside>
      </main>

      <footer className="statusbar">
        <span>SpellCraft Editor</span>
        <span>English · Spelling assistant</span>
      </footer>
    </div>
  )
}

export default App