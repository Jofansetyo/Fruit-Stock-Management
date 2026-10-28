import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import buahImage from '../assets/buah.jpg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(rgba(27,67,50,0.55), rgba(27,67,50,0.55)), url(${buahImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
          padding: '40px 36px',
        }}
      >
        <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9A958A', fontWeight: 600, marginBottom: 6 }}>
          Masuk ke akun
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#2B2A25', marginBottom: 28, marginTop: 0 }}>
          Selamat datang kembali
        </h1>

        {error && (
          <div style={{ background: '#F6DAD8', color: '#C1443C', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2B2A25', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="nama@tokobuah.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: '1px solid #E7E1D3',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2B2A25', marginBottom: 6 }}>
              Kata sandi
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 10,
                border: '1px solid #E7E1D3',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 10,
              background: '#2F6D45',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#9A958A', marginTop: 20, marginBottom: 0 }}>
          Belum punya akun?{' '}
          <Link to="/register" style={{ color: '#2F6D45', fontWeight: 700, textDecoration: 'none' }}>
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}