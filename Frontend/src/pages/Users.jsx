import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'
import ConfirmModal from '../components/ConfirmModal'

export default function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ name: '', role: 'staff' })
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users')
      setUsers(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openEditModal = (user) => {
    setEditingUser(user)
    setForm({ name: user.name, role: user.role })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.put(`/users/${editingUser.id}`, form)
      setShowModal(false)
      fetchData()
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors)[0][0] : err.response?.data?.message || 'Gagal menyimpan data')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus data')
      setDeleteTarget(null)
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#F4F6F5' }}>
      <Sidebar active="users" />

      <main className="flex-grow-1 p-4">
        <h3 className="fw-semibold mb-4">Kelola User</h3>

        <div className="card border-0 shadow-sm">
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-success" role="status"></div>
            </div>
          ) : (
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr className="small text-muted text-uppercase">
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name} {u.id === currentUser.id && <span className="text-muted small">(kamu)</span>}</td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-success-subtle text-success-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'}`}>
                        {u.role === 'admin' ? 'Admin' : 'Staff Gudang'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEditModal(u)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      {u.id !== currentUser.id && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(u)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </td>
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
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Nama</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff Gudang</option>
                    </select>
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

      <ConfirmModal
        show={!!deleteTarget}
        title="Hapus User"
        message={deleteTarget ? `Yakin mau hapus akun "${deleteTarget.name}"?` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}