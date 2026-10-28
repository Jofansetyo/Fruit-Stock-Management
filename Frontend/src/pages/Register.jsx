import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import buahImage from '../assets/buah.jpg'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(name, email, password, passwordConfirmation, role)
      navigate('/')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        setError(Object.values(errors)[0][0])
      } else {
        setError(err.response?.data?.message || 'Registrasi gagal')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #E7E1D3',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#2B2A25',
    marginBottom: 6,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(rgba(27,67,50,0.55), rgba(27,67,50,0.55)), url(${buahImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 20px',
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#fff',
          border: '1px solid #E7E1D3',
          borderRadius: 10,
          padding: '9px 14px',
          fontSize: 13,
          fontWeight: 600,
          color: '#2B2A25',
          cursor: 'pointer',
        }}
      >
        <i className="bi bi-arrow-left"></i> Kembali
      </button>

      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
          padding: '32px 32px',
        }}
      >
        <p style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9A958A', fontWeight: 600, marginBottom: 6 }}>
          Buat akun
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2B2A25', marginBottom: 20, marginTop: 0 }}>
          Gabung kelola gudang
        </h1>

        {error && (
          <div style={{ background: '#F6DAD8', color: '#C1443C', fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Nama lengkap</label>
            <input type="text" placeholder="Jofan Setyo" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="nama@tokobuah.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Kata sandi</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Konfirmasi</label>
              <input type="password" placeholder="••••••••" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ ...labelStyle, marginBottom: 8 }}>Daftar sebagai</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div
                onClick={() => setRole('admin')}
                style={{
                  border: `2px solid ${role === 'admin' ? '#2F6D45' : '#E7E1D3'}`,
                  background: role === 'admin' ? '#DCE8DE' : '#fff',
                  borderRadius: 12,
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 2 }}>👑</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2B2A25' }}>Admin</div>
                <div style={{ fontSize: 10, color: '#9A958A' }}>Pemilik toko</div>
              </div>
              <div
                onClick={() => setRole('staff')}
                style={{
                  border: `2px solid ${role === 'staff' ? '#2F6D45' : '#E7E1D3'}`,
                  background: role === 'staff' ? '#DCE8DE' : '#fff',
                  borderRadius: 12,
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 2 }}>📦</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2B2A25' }}>Staff Gudang</div>
                <div style={{ fontSize: 10, color: '#9A958A' }}>Input stok</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              background: '#2F6D45',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Memproses...' : 'Buat Akun'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#9A958A', marginTop: 16, marginBottom: 0 }}>
          Sudah punya akun?{' '}
          <Link to="/login" style={{ color: '#2F6D45', fontWeight: 700, textDecoration: 'none' }}>
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}