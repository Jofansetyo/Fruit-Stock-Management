import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ active }) {
  const { user, logout } = useAuth()

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', path: '/', icon: 'bi-grid' },
    { key: 'fruits', label: 'Data Buah', path: '/fruits', icon: 'bi-apple' },
    { key: 'categories', label: 'Kategori', path: '/categories', icon: 'bi-tags' },
    { key: 'suppliers', label: 'Supplier', path: '/suppliers', icon: 'bi-truck' },
    { key: 'stock-ins', label: 'Stok Masuk', path: '/stock-ins', icon: 'bi-box-arrow-in-down' },
    { key: 'stock-outs', label: 'Stok Keluar', path: '/stock-outs', icon: 'bi-box-arrow-up' },
    { key: 'reports', label: 'Laporan', path: '/reports', icon: 'bi-file-earmark-text' },
  ]

  return (
    <aside style={{ width: 230, background: '#1B4332', minHeight: '100vh' }} className="text-white p-3 d-flex flex-column">
      <div className="d-flex align-items-center gap-2 mb-4 px-2">
        <span className="fs-4"></span>
        <span className="fw-bold">Stok Buah</span>
      </div>

      <nav className="flex-grow-1">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`d-flex align-items-center gap-2 px-3 py-2 rounded mb-1 text-decoration-none ${
              active === item.key ? 'bg-white bg-opacity-10 text-white fw-semibold' : 'text-white-50'
            }`}
          >
            <i className={`bi ${item.icon}`}></i>
            <span className="small">{item.label}</span>
          </Link>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="px-3 pt-3 pb-1 text-uppercase text-white-50" style={{ fontSize: 10 }}>Admin</div>
            <Link
              to="/users"
              className={`d-flex align-items-center gap-2 px-3 py-2 rounded mb-1 text-decoration-none ${
                active === 'users' ? 'bg-white bg-opacity-10 text-white fw-semibold' : 'text-white-50'
              }`}
            >
              <i className="bi bi-people"></i>
              <span className="small">Kelola User</span>
            </Link>
          </>
        )}
      </nav>

      <div className="px-2 pt-3 border-top border-white border-opacity-10">
        <p className="small mb-1 text-white">{user?.name}</p>
        <p className="text-white-50 mb-2" style={{ fontSize: 11 }}>{user?.role === 'admin' ? 'Admin' : 'Staff Gudang'}</p>
        <button onClick={logout} className="btn btn-sm btn-outline-light w-100">
          Keluar
        </button>
      </div>
    </aside>
  )
}