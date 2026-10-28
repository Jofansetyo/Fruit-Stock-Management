import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

export default function Suppliers() {
  const { user } = useAuth()
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [error, setError] = useState('')

  const isAdmin = user?.role === 'admin'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/suppliers')
      setSuppliers(res.data.data)
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
    setEditingSupplier(null)
    setForm({ name: '', phone: '', address: '' })
    setError('')
    setShowModal(true)
  }

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier)
    setForm({ name: supplier.name, phone: supplier.phone || '', address: supplier.address || '' })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, form)
      } else {
        await api.post('/suppliers', form)
      }
      setShowModal(false)
      fetchData()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors)[0][0] : 'Gagal menyimpan data')
    }
  }

  const handleDelete = async (supplier) => {
    if (!window.confirm(`Hapus supplier ${supplier.name}?`)) return

    try {
      await api.delete(`/suppliers/${supplier.id}`)
      fetchData()
    } catch (err) {
      alert('Gagal menghapus, mungkin masih dipakai oleh data transaksi')
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#F4F6F5' }}>
      <Sidebar active="suppliers" />

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-semibold mb-0">Supplier</h3>
          {isAdmin && (
            <button className="btn btn-success fw-semibold" style={{ background: '#E8873A', border: 'none' }} onClick={openAddModal}>
              + Tambah Supplier
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
                  <th>Nama Supplier</th>
                  <th>Telepon</th>
                  <th>Alamat</th>
                  {isAdmin && <th style={{ width: 120 }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup) => (
                  <tr key={sup.id}>
                    <td>{sup.name}</td>
                    <td className="text-muted">{sup.phone || '-'}</td>
                    <td className="text-muted">{sup.address || '-'}</td>
                    {isAdmin && (
                      <td>
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEditModal(sup)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(sup)}>
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
                <h5 className="modal-title">{editingSupplier ? 'Edit Supplier' : 'Tambah Supplier'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Nama Supplier</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Telepon</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Alamat</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    ></textarea>
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