export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.4)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || 'Konfirmasi'}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Batal
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}