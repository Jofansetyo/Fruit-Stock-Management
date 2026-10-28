import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

export default function StockIns() {
  const { user } = useAuth()
  const [stockIns, setStockIns] = useState([])
  const [fruits, setFruits] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const isAdmin = user?.role === 'admin'

  const [form, setForm] = useState({
    fruit_id: '',
    supplier_id: '',
    quantity: '',
    purchase_price: '',
    date_in: new Date().toISOString().split('T')[0],
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [stockInsRes, fruitsRes, suppliersRes] = await Promise.all([
        api.get('/stock-ins'),
        api.get('/fruits'),
        api.get('/suppliers'),
      ])
      setStockIns(stockInsRes.data.data)
      setFruits(fruitsRes.data.data)
      setSuppliers(suppliersRes.data.data)
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
      supplier_id: '',
      quantity: '',
      purchase_price: '',
      date_in: new Date().toISOString().split('T')[0],
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.post('/stock-ins', form)
      setShowModal(false)
      fetchData()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors)[0][0] : 'Gagal menyimpan data')
    }
  }

  const handleDelete = async (stockIn) => {
    if (!window.confirm('Hapus data stok masuk ini? Stok buah akan dikurangi kembali.')) return

    try {
      await api.delete(`/stock-ins/${stockIn.id}`)
      fetchData()
    } catch (err) {
      alert('Gagal menghapus data')
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#F4F6F5' }}>
      <Sidebar active="stock-ins" />

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-semibold mb-0">Stok Masuk</h3>
          <button className="btn btn-success fw-semibold" style={{ background: '#2E7D32', border: 'none' }} onClick={openAddModal}>
            + Catat Stok Masuk
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
                  <th>Supplier</th>
                  <th>Jumlah</th>
                  <th>Harga Beli</th>
                  <th>Dicatat oleh</th>
                  {isAdmin && <th style={{ width: 60 }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {stockIns.map((item) => (
                  <tr key={item.id}>
                    <td className="text-muted">{item.date_in}</td>
                    <td>{item.fruit?.name}</td>
                    <td className="text-muted">{item.supplier?.name}</td>
                    <td>{item.quantity} {item.fruit?.unit}</td>
                    <td>Rp{Number(item.purchase_price).toLocaleString('id-ID')}</td>
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
                <h5 className="modal-title">Catat Stok Masuk</h5>
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
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Supplier</label>
                    <select
                      className="form-select"
                      value={form.supplier_id}
                      onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                      required
                    >
                      <option value="">Pilih supplier</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
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
                      <label className="form-label small fw-semibold">Harga Beli</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.purchase_price}
                        onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Tanggal Masuk</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.date_in}
                      onChange={(e) => setForm({ ...form, date_in: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success" style={{ background: '#2E7D32', border: 'none' }}>
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