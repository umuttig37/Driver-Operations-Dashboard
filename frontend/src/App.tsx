import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

type LoginData = {
  token: string
  user: {
    name: string
    email: string
  }
}

function LoginPage({ onLogin }: { onLogin: (value: LoginData) => void }) {
  const [email, setEmail] = useState('umut@test.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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

      onLogin(data as LoginData)
      navigate('/app/dashboard')
    } catch (err) {
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
      </section>
    </main>
  )
}

function AppLayout({ auth, onLogout }: { auth: LoginData; onLogout: () => void }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Driver Operations Dashboard</p>
          <h1 className="topbar-title">Workspace</h1>
        </div>
        <div className="topbar-user">
          <span>{auth.user.name}</span>
          <button onClick={onLogout}>logout</button>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <NavLink to="/app/dashboard">dashboard</NavLink>
          <NavLink to="/app/drivers">drivers</NavLink>
          <NavLink to="/app/jobs">jobs</NavLink>
        </aside>

        <section className="content">
          <Routes>
            <Route path="dashboard" element={<PageCard title="Dashboard" text="dashboard shell valmis" />} />
            <Route path="drivers" element={<PageCard title="Drivers" text="kuskit tulee seuraavaksi" />} />
            <Route path="jobs" element={<PageCard title="Jobs" text="jobit tulee seuraavaksi" />} />
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </section>
      </div>
    </div>
  )
}

function PageCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="content-card">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

function App() {
  const [auth, setAuth] = useState<LoginData | null>(null)

  return (
    <Routes>
      <Route
        path="/login"
        element={auth ? <Navigate to="/app/dashboard" replace /> : <LoginPage onLogin={setAuth} />}
      />
      <Route
        path="/app/*"
        element={auth ? <AppLayout auth={auth} onLogout={() => setAuth(null)} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={auth ? '/app/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default App
