import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

export default function Fruits() {
  const { user } = useAuth()
  const [fruits, setFruits] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFruit, setEditingFruit] = useState(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    category_id: '',
    name: '',
    unit: 'kg',
    price: '',
    current_stock: '',
    minimum_stock: '',
  })

  const isAdmin = user?.role === 'admin'

  const fetchData = async () => {
    setLoading(true)
    try {
      const [fruitsRes, categoriesRes] = await Promise.all([
        api.get('/fruits'),
        api.get('/categories'),
      ])
      setFruits(fruitsRes.data.data)
      setCategories(categoriesRes.data.data)
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
    setEditingFruit(null)
    setForm({ category_id: '', name: '', unit: 'kg', price: '', current_stock: '', minimum_stock: '' })
    setError('')
    setShowModal(true)
  }

  const openEditModal = (fruit) => {
    setEditingFruit(fruit)
    setForm({
      category_id: fruit.category?.id || '',
      name: fruit.name,
      unit: fruit.unit,
      price: fruit.price,
      current_stock: fruit.current_stock,
      minimum_stock: fruit.minimum_stock,
    })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingFruit) {
        await api.put(`/fruits/${editingFruit.id}`, form)
      } else {
        await api.post('/fruits', form)
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors)[0][0] : 'Gagal menyimpan data')
    }
  }

  const handleDelete = async (fruit) => {
    if (!window.confirm(`Hapus data ${fruit.name}?`)) return

    try {
      await api.delete(`/fruits/${fruit.id}`)
      fetchData()
    } catch (err) {
      alert('Gagal menghapus data')
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#F4F6F5' }}>
      <Sidebar active="fruits" />

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-semibold mb-0">Data Buah</h3>
          {isAdmin && (
            <button className="btn btn-success fw-semibold" style={{ background: '#E8873A', border: 'none' }} onClick={openAddModal}>
              + Tambah Buah
            </button>
          )}
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
                  <th>Buah</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Status</th>
                  {isAdmin && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {fruits.map((fruit) => (
                  <tr key={fruit.id}>
                    <td>{fruit.name}</td>
                    <td className="text-muted">{fruit.category?.name}</td>
                    <td>Rp{Number(fruit.price).toLocaleString('id-ID')}</td>
                    <td>{fruit.current_stock} {fruit.unit}</td>
                    <td>
                      {fruit.is_low_stock ? (
                        <span className="badge bg-danger-subtle text-danger-emphasis">RENDAH</span>
                      ) : (
                        <span className="badge bg-success-subtle text-success-emphasis">AMAN</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td>
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEditModal(fruit)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(fruit)}>
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
                <h5 className="modal-title">{editingFruit ? 'Edit Buah' : 'Tambah Buah'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Kategori</label>
                    <select
                      className="form-select"
                      value={form.category_id}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      required
                    >
                      <option value="">Pilih kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Nama Buah</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-semibold">Satuan</label>
                      <select
                        className="form-select"
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                      >
                        <option value="kg">kg</option>
                        <option value="pcs">pcs</option>
                      </select>
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-semibold">Harga Jual</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    {!editingFruit && (
                      <div className="col-6 mb-3">
                        <label className="form-label small fw-semibold">Stok Awal</label>
                        <input
                          type="number"
                          className="form-control"
                          value={form.current_stock}
                          onChange={(e) => setForm({ ...form, current_stock: e.target.value })}
                        />
                      </div>
                    )}
                    <div className="col-6 mb-3">
                      <label className="form-label small fw-semibold">Stok Minimum</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.minimum_stock}
                        onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })}
                      />
                    </div>
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