import { useState } from 'react'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'

export default function Reports() {
  const [type, setType] = useState('stock-in')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)
    try {
      const endpoint = type === 'stock-in' ? '/reports/stock-in' : '/reports/stock-out'
      const params = {}
      if (start) params.start = start
      if (end) params.end = end

      const res = await api.get(endpoint, { params })
      setReport(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#F4F6F5' }}>
      <Sidebar active="reports" />

      <main className="flex-grow-1 p-4">
        <h3 className="fw-semibold mb-4">Laporan</h3>

        <div className="card border-0 shadow-sm p-3 mb-4">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Jenis Laporan</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="stock-in">Stok Masuk</option>
                <option value="stock-out">Stok Keluar</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Dari Tanggal</label>
              <input type="date" className="form-control" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Sampai Tanggal</label>
              <input type="date" className="form-control" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-success w-100 fw-semibold" style={{ background: '#2E7D32', border: 'none' }} onClick={handleSearch}>
                Tampilkan
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center p-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        )}

        {!loading && searched && report && (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3">
                  <p className="text-muted small mb-1">TOTAL TRANSAKSI</p>
                  <h4 className="fw-bold mb-0">{report.total_transaksi}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3">
                  <p className="text-muted small mb-1">TOTAL JUMLAH</p>
                  <h4 className="fw-bold mb-0">{report.total_quantity}</h4>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3">
                  <p className="text-muted small mb-1">{type === 'stock-in' ? 'TOTAL PEMBELIAN' : 'TOTAL PENJUALAN'}</p>
                  <h4 className="fw-bold mb-0">
                    Rp{Number(type === 'stock-in' ? report.total_pembelian : report.total_penjualan).toLocaleString('id-ID')}
                  </h4>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <table className="table mb-0 align-middle">
                <thead className="table-light">
                  <tr className="small text-muted text-uppercase">
                    <th>Tanggal</th>
                    <th>Buah</th>
                    <th>Jumlah</th>
                    {type === 'stock-in' ? <th>Supplier</th> : <th>Jenis</th>}
                    <th>Dicatat oleh</th>
                  </tr>
                </thead>
                <tbody>
                  {report.data.map((item) => (
                    <tr key={item.id}>
                      <td className="text-muted">{type === 'stock-in' ? item.date_in : item.date_out}</td>
                      <td>{item.fruit?.name}</td>
                      <td>{item.quantity} {item.fruit?.unit}</td>
                      <td>{type === 'stock-in' ? item.supplier?.name : item.type}</td>
                      <td className="text-muted">{item.user?.name}</td>
                    </tr>
                  ))}
                  {report.data.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">Tidak ada data pada rentang tanggal ini</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}