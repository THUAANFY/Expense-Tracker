import { useId, useRef, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Download,
  FileJson,
  HardDrive,
  UserRound,
  Wallet,
} from 'lucide-react'
import Dialog from './dialogs/Dialog'
import SettingsArt from './SettingsArt'
import CategoryRatiosSettings from './CategoryRatiosSettings'
import { isClosedMonth } from '../closedMonths'
import { dateKey, downloadFile, isValidData, money } from '../data'
import {
  budgetFunds,
  getMonthlyBudget,
  isValidBudgetAmount,
  monthlyBudgetFundingError,
} from '../monthlyBudgets'
import './SettingsView.css'

export default function SettingsView({
  data,
  dataRaw,
  month,
  asOf = dateKey(),
  storageBlocked,
  recovery,
  onSave,
  onRestore,
  onCategories,
  onSources,
  notify,
}) {
  const nameId = useId()
  const budgetId = useId()
  const readOnly = isClosedMonth(month, asOf.slice(0, 7))
  const [nameDraft, setNameDraft] = useState(null)
  const [budgetDrafts, setBudgetDrafts] = useState({})
  const name = nameDraft?.value ?? data.profile.name
  const draft = budgetDrafts[month] || {
    value: getMonthlyBudget(data, month),
    baseValue: getMonthlyBudget(data, month),
    hadValue: Object.hasOwn(data.monthlyBudgets || {}, month),
  }
  const budget = readOnly ? getMonthlyBudget(data, month) : draft.value
  const [formError, setFormError] = useState('')
  const [pendingImport, setPendingImport] = useState(null)
  const [importName, setImportName] = useState('')
  const [importError, setImportError] = useState('')
  const [ratiosRevision, setRatiosRevision] = useState(0)
  const fileInput = useRef(null)
  const importBase = useRef(null)
  const numericBudget = Number(budget)
  const validBudget = isValidBudgetAmount(numericBudget)
  const nameChanged = nameDraft && name.trim() !== nameDraft.baseValue
  const budgetChanged =
    !readOnly &&
    (budgetDrafts[month]
      ? !draft.hadValue || numericBudget !== draft.baseValue
      : !draft.hadValue && !nameChanged)
  const hasChanges = Boolean(nameChanged || budgetChanged)
  const funds = budgetFunds(data, asOf)
  const fundingError =
    budgetChanged && validBudget ? monthlyBudgetFundingError(data, numericBudget, asOf) : ''
  const monthCaption = `tháng ${Number(month.slice(5))}/${month.slice(0, 4)}`
  function changeBudget(value) {
    if (readOnly) return
    setBudgetDrafts((previous) => ({
      ...previous,
      [month]: {
        value,
        baseValue: previous[month]?.baseValue ?? getMonthlyBudget(data, month),
        hadValue: previous[month]?.hadValue ?? Object.hasOwn(data.monthlyBudgets || {}, month),
      },
    }))
    setFormError('')
  }
  async function importData(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      if (file.size > 5000000) throw new Error('Tệp quá lớn. Vui lòng chọn bản sao lưu dưới 5 MB.')
      const parsed = JSON.parse(await file.text())
      if (!isValidData(parsed)) throw new Error('Tệp không đúng định dạng bản sao lưu của mây.')
      setPendingImport(parsed)
      importBase.current = { data, raw: dataRaw }
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
          onSubmit={async (event) => {
            event.preventDefault()
            if (!name.trim()) {
              setFormError('Nhập tên gọi để mây có thể chào bạn nhé.')
              return
            }
            if (!validBudget) {
              setFormError('Ngân sách cần là số nguyên từ 1 đến 1.000.000.000.000 ₫.')
              return
            }
            if (fundingError) {
              return
            }
            setFormError('')
            const base = { ...data, profile: { ...data.profile } }
            if (nameChanged) base.profile.name = nameDraft.baseValue
            if (budgetChanged) {
              base.monthlyBudgets = { ...data.monthlyBudgets }
              if (draft.hadValue) base.monthlyBudgets[month] = draft.baseValue
              else delete base.monthlyBudgets[month]
            }
            const next = {
              ...base,
              profile: { ...base.profile, ...(nameChanged ? { name: name.trim() } : {}) },
            }
            if (budgetChanged)
              next.monthlyBudgets = { ...base.monthlyBudgets, [month]: numericBudget }
            const saved = await onSave(
              next,
              budgetChanged ? `Đã lưu ngân sách ${monthCaption}` : 'Đã lưu thiết lập',
              { base, baseRaw: dataRaw },
            )
            if (!saved) return
            setNameDraft(null)
            setBudgetDrafts((previous) => {
              const remaining = { ...previous }
              delete remaining[month]
              return remaining
            })
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
                    const value = event.target.value
                    setNameDraft((previous) =>
                      value === (previous?.baseValue ?? data.profile.name)
                        ? null
                        : { value, baseValue: previous?.baseValue ?? data.profile.name },
                    )
                    setFormError('')
                  }}
                />
              </div>
              <div className="settings-field">
                <label htmlFor={budgetId}>Ngân sách chi tiêu mỗi tháng (VND)</label>
                <div className={`settings-budget-input ${fundingError ? 'is-invalid' : ''}`}>
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
                    readOnly={readOnly}
                    aria-readonly={readOnly}
                    aria-invalid={Boolean(fundingError)}
                    aria-describedby={`${budgetId}-hint${readOnly ? '' : ` ${budgetId}-funds`}${fundingError ? ` ${budgetId}-error` : ''}`}
                    onChange={(event) => changeBudget(event.target.value)}
                  />
                  <span aria-hidden="true">₫</span>
                </div>
                <p id={budgetId + '-hint'} className="settings-budget-preview">
                  {validBudget ? (
                    <>
                      <strong>{money(numericBudget)}</strong>
                      <span> · {monthCaption}</span>
                    </>
                  ) : (
                    'Nhập ngân sách phù hợp với bạn.'
                  )}
                </p>
                {!readOnly && (
                  <p className="settings-budget-funds" id={`${budgetId}-funds`}>
                    Số dư các nguồn hôm nay: <strong>{money(funds.balance)}</strong>
                    <button type="button" onClick={onSources}>
                      {funds.sourceCount ? 'Xem nguồn tiền' : 'Thêm nguồn tiền'}{' '}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </button>
                  </p>
                )}
                <p className="settings-budget-scope">
                  {readOnly
                    ? 'Ngân sách tháng đã qua chỉ được xem, không thể thay đổi.'
                    : Object.hasOwn(data.monthlyBudgets || {}, month)
                      ? `Chỉ lưu cho ${monthCaption}. Các hạn mức tự động sẽ chia lại theo mức này.`
                      : 'Đang dùng mức mặc định. Lưu cho tháng này và tự chia hạn mức danh mục.'}
                </p>
                {fundingError && (
                  <p
                    className="settings-budget-error"
                    id={`${budgetId}-error`}
                    role={budgetDrafts[month] ? 'alert' : 'note'}
                  >
                    {fundingError}
                  </p>
                )}
                <div
                  className="settings-budget-presets"
                  role="group"
                  aria-label="Chọn nhanh ngân sách tháng"
                >
                  {[5000000, 10000000, 15000000, 20000000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      disabled={readOnly}
                      aria-pressed={numericBudget === amount}
                      onClick={() => changeBudget(amount)}
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
                title="Danh mục tự chia theo ngân sách tháng; mức đặt riêng được giữ nguyên"
                onClick={onCategories}
              >
                Hạn mức danh mục <ArrowUpRight size={12} aria-hidden="true" />
              </button>
              <div>
                {hasChanges && <span className="settings-unsaved">Chưa lưu</span>}
                <button
                  type="submit"
                  className="button primary"
                  disabled={storageBlocked || Boolean(fundingError) || !validBudget || !hasChanges}
                >
                  <Check size={15} /> Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </form>
        <CategoryRatiosSettings
          key={ratiosRevision}
          data={data}
          dataRaw={dataRaw}
          month={month}
          asOf={asOf}
          storageBlocked={storageBlocked}
          onSave={onSave}
        />
        {recovery && (
          <section
            className="settings-recovery settings-section"
            aria-label="Bản lưu gốc được bảo vệ"
          >
            <span className="settings-section-icon">
              <HardDrive size={17} aria-hidden="true" />
            </span>
            <div>
              <h2>{recovery.blocked ? 'Bảo vệ bản lưu gốc' : 'Bản gốc đã được giữ riêng'}</h2>
              <p>
                {recovery.blocked
                  ? 'App đang khóa lưu thay đổi. Tải nguyên bản để kiểm tra, hoặc chọn một bản sao lưu hợp lệ để khôi phục.'
                  : 'Bạn vẫn có thể tải nguyên bản dữ liệu đã được giữ lại trước khi khôi phục.'}
              </p>
              <div>
                <button className="button secondary" onClick={recovery.downloadOriginal}>
                  <Download size={14} /> Tải bản gốc
                </button>
                {recovery.blocked && (
                  <button className="button primary" onClick={() => fileInput.current.click()}>
                    <ArrowDownToLine size={14} /> Chọn bản sao lưu
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
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
              <span>
                JSON · Giao dịch, nguồn tiền, túi, ghi chú & thiết lập · Nhập tối đa 5 MB.
              </span>
            </p>
          </div>
        </section>
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
                · {(pendingImport.bags || []).length} túi ·{' '}
                {(pendingImport.moneySources || []).length} nguồn tiền ·{' '}
                {(pendingImport.sourceTransfers || []).length} bản ghi chuyển nguồn
              </p>
            </div>
            <dl>
              <div>
                <dt>Tên gọi</dt>
                <dd>{pendingImport.profile.name}</dd>
              </div>
              <div>
                <dt>Ngân sách {monthCaption}</dt>
                <dd>{money(getMonthlyBudget(pendingImport, month))}</dd>
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
              onClick={async () => {
                const saved = await onRestore(
                  pendingImport,
                  importBase.current.data,
                  importBase.current.raw,
                )
                if (!saved) return
                setNameDraft(null)
                setBudgetDrafts({})
                setRatiosRevision((value) => value + 1)
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
