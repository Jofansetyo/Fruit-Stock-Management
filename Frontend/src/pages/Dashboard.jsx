import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [fruits, setFruits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, fruitsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/fruits'),
        ])
        setSummary(summaryRes.data)
        setFruits(fruitsRes.data.data.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    )
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#F4F6F5' }}>
      <Sidebar active="dashboard" />

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-muted small mb-0">Selamat datang, {user?.name}</p>
            <h3 className="fw-semibold mb-0">Ringkasan Gudang</h3>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm p-3 h-100">
              <p className="text-muted small mb-1">TOTAL JENIS BUAH</p>
              <h3 className="fw-bold mb-0">{summary?.total_fruit_types}</h3>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm p-3 h-100">
              <p className="text-muted small mb-1">TOTAL STOK</p>
              <h3 className="fw-bold mb-0">{summary?.total_stock}</h3>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm p-3 h-100">
              <p className="text-muted small mb-1">TRANSAKSI HARI INI</p>
              <h3 className="fw-bold mb-0">{summary?.today_transactions}</h3>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm p-3 h-100 bg-danger-subtle">
              <p className="text-danger small mb-1">STOK RENDAH</p>
              <h3 className="fw-bold mb-0 text-danger">{summary?.low_stock_count}</h3>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <span className="fw-semibold">Daftar Buah</span>
            <a href="/fruits" className="small text-success text-decoration-none">LIHAT SEMUA →</a>
          </div>
          <table className="table mb-0 align-middle">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase">
                <th>Buah</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fruits.map((fruit) => (
                <tr key={fruit.id}>
                  <td>{fruit.name}</td>
                  <td className="text-muted">{fruit.category?.name}</td>
                  <td>{fruit.current_stock} {fruit.unit}</td>
                  <td>
                    {fruit.is_low_stock ? (
                      <span className="badge bg-danger-subtle text-danger-emphasis">RENDAH</span>
                    ) : (
                      <span className="badge bg-success-subtle text-success-emphasis">AMAN</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}