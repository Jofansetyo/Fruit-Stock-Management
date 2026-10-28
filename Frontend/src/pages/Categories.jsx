import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

export default function Categories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const isAdmin = user?.role === 'admin'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/categories')
      setCategories(res.data.data)
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
    setEditingCategory(null)
    setName('')
    setError('')
    setShowModal(true)
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setName(category.name)
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, { name })
      } else {
        await api.post('/categories', { name })
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors)[0][0] : 'Gagal menyimpan data')
    }
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`Hapus kategori ${category.name}?`)) return

    try {
      await api.delete(`/categories/${category.id}`)
      fetchData()
    } catch (err) {
      alert('Gagal menghapus, mungkin masih dipakai oleh data buah')
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#F4F6F5' }}>
      <Sidebar active="categories" />

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-semibold mb-0">Kategori</h3>
          {isAdmin && (
            <button className="btn btn-success fw-semibold" style={{ background: '#E8873A', border: 'none' }} onClick={openAddModal}>
              + Tambah Kategori
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
                  <th>Nama Kategori</th>
                  {isAdmin && <th style={{ width: 120 }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.name}</td>
                    {isAdmin && (
                      <td>
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEditModal(cat)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat)}>
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
                <h5 className="modal-title">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}
                  <label className="form-label small fw-semibold">Nama Kategori</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
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