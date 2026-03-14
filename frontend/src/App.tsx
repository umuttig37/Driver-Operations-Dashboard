import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

type LoginData = {
  token: string
  user: {
    name: string
    email: string
  }
}

function App() {
  const [email, setEmail] = useState('umut@test.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState<LoginData | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = (await response.json()) as LoginData | { message?: string }

      if (!response.ok) {
        throw new Error('message' in data ? data.message : 'login failed')
      }

      setLoginData(data as LoginData)
    } catch (err) {
      setLoginData(null)
      setError(err instanceof Error ? err.message : 'login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <div className="copy">
          <p className="eyebrow">Driver Operations Dashboard</p>
          <h1>Login</h1>
          <p className="subtle">eka auth-versio</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'loading...' : 'login'}
          </button>
        </form>

        <div className="hint">
          <span>umut@test.com</span>
          <span>123456</span>
        </div>

        {loginData && (
          <div className="ok">
            <strong>{loginData.user.name}</strong>
            <span>{loginData.user.email}</span>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
