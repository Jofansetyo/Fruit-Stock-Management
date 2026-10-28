import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

export default function StockOuts() {
  const { user } = useAuth()
  const [stockOuts, setStockOuts] = useState([])
  const [fruits, setFruits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const isAdmin = user?.role === 'admin'

  const [form, setForm] = useState({
    fruit_id: '',
    quantity: '',
    type: 'sold',
    selling_price: '',
    date_out: new Date().toISOString().split('T')[0],
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [stockOutsRes, fruitsRes] = await Promise.all([
        api.get('/stock-outs'),
        api.get('/fruits'),
      ])
      setStockOuts(stockOutsRes.data.data)
      setFruits(fruitsRes.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openAddModal = () => {
    setForm({
      fruit_id: '',
      quantity: '',
      type: 'sold',
      selling_price: '',
      date_out: new Date().toISOString().split('T')[0],
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.post('/stock-outs', form)
      setShowModal(false)
      fetchData()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors)[0][0] : 'Gagal menyimpan data')
    }
  }

  const handleDelete = async (stockOut) => {
    if (!window.confirm('Hapus data stok keluar ini? Stok buah akan dikembalikan.')) return

    try {
      await api.delete(`/stock-outs/${stockOut.id}`)
      fetchData()
    } catch (err) {
      alert('Gagal menghapus data')
    }
  }

  const selectedFruit = fruits.find((f) => f.id === Number(form.fruit_id))

  const typeLabel = {
    sold: 'Terjual',
    damaged: 'Rusak',
    expired: 'Kadaluarsa',
  }

  const typeBadge = {
    sold: 'success',
    damaged: 'warning',
    expired: 'secondary',
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#F4F6F5' }}>
      <Sidebar active="stock-outs" />

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-semibold mb-0">Stok Keluar</h3>
          <button className="btn btn-success fw-semibold" style={{ background: '#C1443C', border: 'none' }} onClick={openAddModal}>
            + Catat Stok Keluar
          </button>
        </div>

        <div className="card border-0 shadow-sm">
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-success" role="status"></div>
            </div>
          ) : (
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr className="small text-muted text-uppercase">
                  <th>Tanggal</th>
                  <th>Buah</th>
                  <th>Jumlah</th>
                  <th>Jenis</th>
                  <th>Harga Jual</th>
                  <th>Dicatat oleh</th>
                  {isAdmin && <th style={{ width: 60 }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {stockOuts.map((item) => (
                  <tr key={item.id}>
                    <td className="text-muted">{item.date_out}</td>
                    <td>{item.fruit?.name}</td>
                    <td>{item.quantity} {item.fruit?.unit}</td>
                    <td>
                      <span className={`badge bg-${typeBadge[item.type]}-subtle text-${typeBadge[item.type]}-emphasis`}>
                        {typeLabel[item.type]}
                      </span>
                    </td>
                    <td>{item.selling_price ? `Rp${Number(item.selling_price).toLocaleString('id-ID')}` : '-'}</td>
                    <td className="text-muted">{item.user?.name}</td>
                    {isAdmin && (
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showModal && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.4)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Catat Stok Keluar</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Pilih Buah</label>
                    <select
                      className="form-select"
                      value={form.fruit_id}
                      onChange={(e) => setForm({ ...form, fruit_id: e.target.value })}
                      required
                    >
                      <option value="">Pilih buah</option>
                      {fruits.map((f) => (
                        <option key={f.id} value={f.id}>{f.name} (stok: {f.current_stock} {f.unit})</option>
                      ))}
                    </select>
                    {selectedFruit && (
                      <div className="form-text">Stok tersedia: {selectedFruit.current_stock} {selectedFruit.unit}</div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-semibold">Jumlah</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-semibold">Jenis</label>
                      <select
                        className="form-select"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                      >
                        <option value="sold">Terjual</option>
                        <option value="damaged">Rusak</option>
                        <option value="expired">Kadaluarsa</option>
                      </select>
                    </div>
                  </div>

                  {form.type === 'sold' && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Harga Jual</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.selling_price}
                        onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Tanggal Keluar</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.date_out}
                      onChange={(e) => setForm({ ...form, date_out: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-danger" style={{ background: '#C1443C', border: 'none' }}>
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}