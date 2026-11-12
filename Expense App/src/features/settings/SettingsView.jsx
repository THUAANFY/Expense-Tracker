import { useId, useRef, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChartNoAxesColumnIncreasing,
  Database,
  Download,
  FileJson,
  HardDrive,
  Info,
  SlidersHorizontal,
  Upload,
  UserRound,
  Wallet,
} from 'lucide-react'
import Dialog from '../../shared/components/Dialog'
import ActionButton from '../../shared/components/ActionButton'
import SettingsBackupArt from './SettingsBackupArt'
import CategoryRatiosSettings from './CategoryRatiosSettings'
import AppearanceSettings from './AppearanceSettings'
import { isClosedMonth } from '../../shared/lib/closedMonths'
import { dateKey, downloadFile, isValidData, money } from '../../shared/storage/data'
import {
  budgetFunds,
  getMonthlyBudget,
  isValidBudgetAmount,
  monthlyBudgetFundingError,
} from '../budgets/monthlyBudgets'
import './SettingsView.css'
import './SettingsFintech.css'

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
      <AppearanceSettings />
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
            </div>
          </div>
          <div className="settings-section-content">
            <div className="settings-form-fields">
              <div className="settings-field">
                <label htmlFor={nameId}>
                  <UserRound size={15} aria-hidden="true" />
                  Mây có thể gọi bạn là
                </label>
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
                <label htmlFor={budgetId}>
                  <Wallet size={15} aria-hidden="true" />
                  Ngân sách chi tiêu mỗi tháng (VND)
                </label>
                <div className={`settings-budget-input ${fundingError ? 'is-invalid' : ''}`}>
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
                  <ChartNoAxesColumnIncreasing size={14} aria-hidden="true" />
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
                    <Database size={14} aria-hidden="true" />
                    Số dư nguồn tiền: <strong>{money(funds.balance)}</strong>
                    <button type="button" onClick={onSources}>
                      {funds.sourceCount ? 'Xem nguồn tiền' : 'Thêm nguồn tiền'}{' '}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </button>
                  </p>
                )}
                <p className="settings-budget-scope">
                  <Info size={14} aria-hidden="true" />
                  {readOnly
                    ? 'Tháng đã qua chỉ được xem.'
                    : Object.hasOwn(data.monthlyBudgets || {}, month)
                      ? 'Áp dụng riêng cho tháng này.'
                      : 'Lưu ngân sách riêng cho tháng này.'}
                </p>
                {fundingError && (
                  <p
                    className="settings-budget-error"
                    id={`${budgetId}-error`}
                    role={budgetDrafts[month] ? 'alert' : 'note'}
                  >
                    {fundingError
                      .split(/(\d[\d.]*\s₫)/u)
                      .map((part, index) =>
                        index % 2 ? <strong key={index}>{part}</strong> : part,
                      )}
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
                <SlidersHorizontal size={14} aria-hidden="true" /> Hạn mức danh mục{' '}
                <ArrowUpRight size={12} aria-hidden="true" />
              </button>
              <div>
                {hasChanges && <span className="settings-unsaved">Chưa lưu</span>}
                <ActionButton
                  type="submit"
                  disabled={storageBlocked || Boolean(fundingError) || !validBudget || !hasChanges}
                >
                  <Check size={15} /> Lưu thay đổi
                </ActionButton>
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
            </div>
          </div>
          <div className="settings-section-content">
            <div className="settings-data-tools">
              <div className="settings-record-summary">
                <SettingsBackupArt className="settings-data-mark" />
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
                  <Upload size={16} aria-hidden="true" /> Nhập dữ liệu
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
              <span>Sao lưu toàn bộ sổ · JSON, tối đa 5 MB.</span>
            </p>
          </div>
        </section>
      </div>
      {pendingImport && (
        <Dialog
          title="Khôi phục bản sao lưu?"
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
