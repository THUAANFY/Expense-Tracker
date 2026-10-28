import { CircleHelp } from 'lucide-react'
import FilterSelect from './FilterSelect'
import { money } from '../data'
import { sourceSummary } from '../moneySources'

export default function MoneySourceSelect({
  sources,
  transactions = [],
  transfers = [],
  asOf,
  value,
  onChange,
  label = 'Nguồn tiền của giao dịch',
  emptyLabel = 'Chọn nguồn tiền',
}) {
  return (
    <FilterSelect
      label={label}
      caption="NGUỒN TIỀN"
      value={value || ''}
      onChange={onChange}
      options={[
        {
          value: '',
          label: emptyLabel,
          icon: CircleHelp,
          sourceType: emptyLabel === 'Chưa gán nguồn' ? 'unassigned' : undefined,
        },
        ...sources.map((source) => ({
          value: source.id,
          label: source.name,
          sourceType: source.type,
          description: `Đang có ${money(sourceSummary(source, transactions, transfers, asOf).balance)}`,
        })),
      ]}
    />
  )
}
