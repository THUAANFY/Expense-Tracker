import { useId, useRef, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  FileJson,
  HardDrive,
  Sparkles,
  UserRound,
  Wallet,
} from 'lucide-react'
import Dialog from './dialogs/Dialog'
import SettingsArt from './SettingsArt'
import { dateKey, downloadFile, isValidData, money } from '../data'
import './SettingsView.css'

export default function SettingsView({ data, onSave, onStart, onCategories, notify }) {
  const nameId = useId()
  const budgetId = useId()
  const [name, setName] = useState(data.profile.name)
  const [budget, setBudget] = useState(data.profile.budget)
  const [formError, setFormError] = useState('')
  const [pendingImport, setPendingImport] = useState(null)
  const [importName, setImportName] = useState('')
  const [importError, setImportError] = useState('')
  const fileInput = useRef(null)
  const numericBudget = Number(budget)
  const validBudget =
    Number.isSafeInteger(numericBudget) && numericBudget > 0 && numericBudget <= 1e12
  const hasChanges = name.trim() !== data.profile.name || numericBudget !== data.profile.budget
  async function importData(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      if (file.size > 5000000) throw new Error('Tệp quá lớn. Vui lòng chọn bản sao lưu dưới 5 MB.')
      const parsed = JSON.parse(await file.text())
      if (!isValidData(parsed)) throw new Error('Tệp không đúng định dạng bản sao lưu của mây.')
      setPendingImport(parsed)
      setImportName(file.name)
      setImportError('')
    } catch (error) {
      setImportError(error.message)
    }
    event.target.value = ''
  }
  return (
    <div className="settings-workspace">
      <div className="settings-sheet">
        <form
          className="settings-profile-form settings-section"
          aria-label="Thiết lập cá nhân"
          onSubmit={(event) => {
            event.preventDefault()
            if (!name.trim()) {
              setFormError('Nhập tên gọi để mây có thể chào bạn nhé.')
              return
            }
            if (!validBudget) {
              setFormError('Ngân sách cần là số nguyên từ 1 đến 1.000.000.000.000 ₫.')
              return
            }
            setFormError('')
            setName(name.trim())
            onSave({ ...data, profile: { name: name.trim(), budget: numericBudget } })
          }}
        >
          <div className="settings-section-heading">
            <span className="settings-section-icon">
              <UserRound size={17} aria-hidden="true" />
            </span>
            <div>
              <h2>Cá nhân hóa</h2>
              <p>Tên gọi & ngân sách</p>
            </div>
          </div>
          <div className="settings-section-content">
            <div className="settings-form-fields">
              <div className="settings-field">
                <label htmlFor={nameId}>Mây có thể gọi bạn là</label>
                <input
                  id={nameId}
                  required
                  maxLength="40"
                  value={name}
                  placeholder="Tên gọi của bạn"
                  onChange={(event) => {
                    setName(event.target.value)
                    setFormError('')
                  }}
                />
              </div>
              <div className="settings-field">
                <label htmlFor={budgetId}>Ngân sách chi tiêu mỗi tháng (VND)</label>
                <div className="settings-budget-input">
                  <Wallet size={15} aria-hidden="true" />
                  <input
                    id={budgetId}
                    required
                    type="number"
                    min="1"
                    max="1000000000000"
                    step="1"
                    inputMode="numeric"
                    value={budget}
                    aria-describedby={budgetId + '-hint'}
                    onChange={(event) => {
                      setBudget(event.target.value)
                      setFormError('')
                    }}
                  />
                  <span aria-hidden="true">₫</span>
                </div>
                <p id={budgetId + '-hint'} className="settings-budget-preview">
                  {validBudget ? (
                    <>
                      <strong>{money(numericBudget)}</strong>
                      <span> / tháng</span>
                    </>
                  ) : (
                    'Nhập ngân sách phù hợp với bạn.'
                  )}
                </p>
                <div
                  className="settings-budget-presets"
                  role="group"
                  aria-label="Chọn nhanh ngân sách tháng"
                >
                  {[5000000, 10000000, 15000000, 20000000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      aria-pressed={numericBudget === amount}
                      onClick={() => {
                        setBudget(amount)
                        setFormError('')
                      }}
                    >
                      {amount / 1000000} triệu
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}
            <div className="settings-save-row">
              <button
                className="settings-category-link"
                type="button"
                title="Hạn mức danh mục được điều chỉnh riêng với ngân sách tổng"
                onClick={onCategories}
              >
                Hạn mức danh mục <ArrowUpRight size={12} aria-hidden="true" />
              </button>
              <div>
                {hasChanges && <span className="settings-unsaved">Chưa lưu</span>}
                <button type="submit" className="button primary">
                  <Check size={15} /> Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </form>
        <section
          className="settings-data-section settings-section"
          aria-label="Dữ liệu và bản sao lưu"
        >
          <div className="settings-section-heading">
            <span className="settings-section-icon">
              <HardDrive size={17} aria-hidden="true" />
            </span>
            <div>
              <h2>Dữ liệu</h2>
              <p>Giữ sổ trên thiết bị</p>
            </div>
          </div>
          <div className="settings-section-content">
            <div className="settings-data-tools">
              <div className="settings-record-summary">
                <SettingsArt variant="archive" className="settings-data-mark" />
                <div>
                  <strong>
                    {data.transactions.length.toLocaleString('vi-VN')} giao dịch <span>·</span>{' '}
                    {data.notes.length.toLocaleString('vi-VN')} ghi chú
                  </strong>
                  <p>Lưu trong trình duyệt này.</p>
                </div>
              </div>
              <div className="settings-backup-actions">
                <button
                  className="settings-backup-action is-export"
                  aria-label="Xuất bản sao lưu"
                  onClick={() => {
                    downloadFile(
                      JSON.stringify(data, null, 2),
                      `may-backup-${dateKey()}.json`,
                      'application/json',
                    )
                    notify('Đã xuất bản sao lưu của bạn')
                  }}
                >
                  <Download size={16} aria-hidden="true" /> Xuất dữ liệu
                </button>
                <button
                  className="settings-backup-action is-import"
                  aria-label="Nhập bản sao lưu"
                  onClick={() => fileInput.current.click()}
                >
                  <ArrowDownToLine size={16} aria-hidden="true" /> Nhập dữ liệu
                </button>
                <input
                  ref={fileInput}
                  hidden
                  type="file"
                  accept=".json,application/json"
                  onChange={importData}
                />
              </div>
            </div>
            {importError && (
              <p className="settings-import-error form-error" role="alert">
                {importError}
              </p>
            )}
            <p className="settings-data-hint">
              <FileJson size={12} aria-hidden="true" />
              <span>JSON · Giao dịch, túi, ghi chú & thiết lập · Nhập tối đa 5 MB.</span>
            </p>
          </div>
        </section>
        {data.isDemo && (
          <section className="settings-demo-row" aria-label="Dữ liệu mẫu">
            <span>
              <Sparkles size={14} aria-hidden="true" />
              <strong>Dữ liệu mẫu</strong>
            </span>
            <button type="button" onClick={onStart}>
              Tạo sổ của tôi <ArrowRight size={13} aria-hidden="true" />
            </button>
          </section>
        )}
      </div>
      {pendingImport && (
        <Dialog
          title="Khôi phục bản sao lưu?"
          subtitle="Xem lại bản sao lưu trước khi áp dụng cho sổ của bạn."
          onClose={() => setPendingImport(null)}
          className="settings-restore-dialog"
        >
          <div className="settings-import-preview">
            <span className="settings-import-file-icon">
              <FileJson size={25} />
            </span>
            <div>
              <strong title={importName}>{importName}</strong>
              <p>
                {pendingImport.transactions.length} giao dịch · {pendingImport.notes.length} ghi chú
                · {(pendingImport.bags || []).length} túi
              </p>
            </div>
            <dl>
              <div>
                <dt>Tên gọi</dt>
                <dd>{pendingImport.profile.name}</dd>
              </div>
              <div>
                <dt>Ngân sách tháng</dt>
                <dd>{money(pendingImport.profile.budget)}</dd>
              </div>
            </dl>
          </div>
          <p className="settings-restore-copy">
            Dữ liệu trong bản sao lưu sẽ thay thế sổ hiện tại. Bạn có thể xuất một bản riêng trước
            khi tiếp tục.
          </p>
          <div className="dialog-actions">
            <button className="button secondary" onClick={() => setPendingImport(null)}>
              Hủy
            </button>
            <button
              className="button primary"
              onClick={() => {
                onSave(pendingImport)
                setName(pendingImport.profile.name)
                setBudget(pendingImport.profile.budget)
                setFormError('')
                setPendingImport(null)
              }}
            >
              Khôi phục dữ liệu
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
