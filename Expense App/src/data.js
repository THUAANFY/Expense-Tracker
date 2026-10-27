import { isValidReview } from './reviews.js'
import { isValidBag } from './bags.js'

export const CATEGORIES = [
  {
    id: 'food',
    name: 'Ăn uống',
    color: '#f2997e',
    textColor: '#89412b',
    background: '#fff0e9',
    budget: 3000000,
    description: 'Một bữa ngon, một ngày vui',
  },
  {
    id: 'shopping',
    name: 'Mua sắm',
    color: '#a998e3',
    textColor: '#604383',
    background: '#f0eafa',
    budget: 2500000,
    description: 'Những điều nhỏ mình yêu',
  },
  {
    id: 'transport',
    name: 'Di chuyển',
    color: '#70b8ad',
    textColor: '#2d6357',
    background: '#e9f6f1',
    budget: 1200000,
    description: 'Đi đâu cũng là trải nghiệm',
  },
  {
    id: 'home',
    name: 'Nhà cửa',
    color: '#7e9dcf',
    textColor: '#385983',
    background: '#eaf0fa',
    budget: 4500000,
    description: 'Chăm chút tổ ấm của mình',
  },
  {
    id: 'fun',
    name: 'Giải trí',
    color: '#e2b75b',
    textColor: '#75591c',
    background: '#fff7df',
    budget: 1000000,
    description: 'Dành chỗ cho niềm vui',
  },
  {
    id: 'health',
    name: 'Sức khỏe',
    color: '#d88fa5',
    textColor: '#873e58',
    background: '#fcecf2',
    budget: 800000,
    description: 'Đầu tư cho chính mình',
  },
  {
    id: 'study',
    name: 'Học tập',
    color: '#81adc2',
    textColor: '#305e75',
    background: '#eaf4fa',
    budget: 1000000,
    description: 'Tốt hơn một chút mỗi ngày',
  },
  {
    id: 'other',
    name: 'Khác',
    color: '#a2a8b8',
    textColor: '#51566a',
    background: '#eff1f5',
    budget: 1000000,
    description: 'Những khoản chi nho nhỏ',
  },
]

export const getCategory = (id) =>
  CATEGORIES.find((item) => item.id === id) || CATEGORIES[CATEGORIES.length - 1]
export const money = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
export const compactMoney = (value) =>
  Math.abs(value) >= 1000000
    ? `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(value / 1000000)} tr`
    : money(value)
export const dateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
export const monthKey = (date = new Date()) => dateKey(date).slice(0, 7)
export const formatDate = (
  value,
  options = { day: '2-digit', month: '2-digit', year: 'numeric' },
) => new Date(`${value}T12:00:00`).toLocaleDateString('vi-VN', options)
export const uid = () =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`

export function createDemoData() {
  const now = new Date()
  const day = now.getDate()
  const at = (offset) =>
    dateKey(new Date(now.getFullYear(), now.getMonth(), Math.max(1, day - offset)))
  const samples = [
    ['Cà phê sáng', 55000, 'food', 0, 'Một ly latte, một khởi đầu nhẹ nhàng.', 'Tiền mặt'],
    [
      'Đi chợ cuối tuần',
      385000,
      'food',
      0,
      'Rau củ, trái cây và đồ ăn cho cả tuần.',
      'Chuyển khoản',
    ],
    [
      'Áo thun mới',
      299000,
      'shopping',
      1,
      'Tự thưởng một chút. Màu kem rất xinh!',
      'Thẻ ngân hàng',
    ],
    ['Grab đến văn phòng', 48000, 'transport', 1, 'Trời mưa nên đặt xe đi làm.', 'Chuyển khoản'],
    ['Bữa tối cùng bạn bè', 265000, 'food', 2, 'Một buổi tối nhiều chuyện để kể.', 'Thẻ ngân hàng'],
    ['Vé xem phim', 120000, 'fun', 3, 'Suất chiếu tối thứ sáu.', 'Chuyển khoản'],
    ['Sách Thói quen nguyên tử', 158000, 'study', 4, 'Đọc 10 trang mỗi ngày.', 'Chuyển khoản'],
    [
      'Mua đồ dùng trong nhà',
      462000,
      'shopping',
      5,
      'Nến thơm và một chiếc cốc mới.',
      'Thẻ ngân hàng',
    ],
    ['Đổ xăng', 70000, 'transport', 7, '', 'Tiền mặt'],
    ['Bữa trưa văn phòng', 65000, 'food', 8, 'Cơm gà ở quán quen.', 'Tiền mặt'],
    [
      'Tiền thuê nhà',
      4000000,
      'home',
      10,
      'Tiền phòng tháng này, đã bao gồm internet.',
      'Chuyển khoản',
    ],
    ['Khám sức khỏe', 350000, 'health', 12, 'Khám định kỳ.', 'Thẻ ngân hàng'],
    ['Siêu thị', 675000, 'food', 14, 'Mua thực phẩm và đồ dùng thiết yếu.', 'Thẻ ngân hàng'],
    ['Tai nghe mới', 1250000, 'shopping', 17, 'Phục vụ làm việc và nghe nhạc.', 'Thẻ ngân hàng'],
    ['Cà phê làm việc', 75000, 'food', 19, 'Đổi không gian cho một ngày sáng tạo.', 'Tiền mặt'],
    ['Gói nghe nhạc', 59000, 'fun', 21, 'Âm nhạc cho những ngày bận rộn.', 'Thẻ ngân hàng'],
  ]
  const transactions = samples.map(([title, amount, category, offset, note, wallet], index) => ({
    id: uid(),
    title,
    amount,
    category,
    date: at(offset),
    note,
    wallet,
    type: 'expense',
    createdAt: Date.now() - index * 1000,
  }))
  transactions.push(
    {
      id: uid(),
      title: 'Lương tháng này',
      amount: 25000000,
      category: 'other',
      date: at(25),
      note: 'Thành quả của một tháng chăm chỉ.',
      wallet: 'Chuyển khoản',
      type: 'income',
      createdAt: Date.now() - 20000,
    },
    {
      id: uid(),
      title: 'Dự án freelance',
      amount: 3800000,
      category: 'other',
      date: at(6),
      note: 'Thiết kế giao diện cho khách hàng.',
      wallet: 'Chuyển khoản',
      type: 'income',
      createdAt: Date.now() - 21000,
    },
  )
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  transactions.push(
    {
      id: uid(),
      title: 'Lương tháng trước',
      amount: 25000000,
      category: 'other',
      date: dateKey(previous),
      note: '',
      wallet: 'Chuyển khoản',
      type: 'income',
      createdAt: Date.now() - 22000,
    },
    {
      id: uid(),
      title: 'Sinh hoạt tháng trước',
      amount: 9800000,
      category: 'home',
      date: dateKey(new Date(previous.getFullYear(), previous.getMonth(), 18)),
      note: 'Tổng các khoản sinh hoạt.',
      wallet: 'Chuyển khoản',
      type: 'expense',
      createdAt: Date.now() - 23000,
    },
  )
  const bags = [
    {
      id: 'demo-weekend',
      name: 'Một cuối tuần thật vui',
      description: 'Ăn ngon, đi chơi và dành chút thời gian cho mình.',
      budget: 1500000,
      style: 'trip',
      color: 'lilac',
      status: 'active',
      createdAt: Date.now(),
    },
    {
      id: 'demo-corner',
      name: 'Chăm chút góc nhỏ',
      description: 'Những món nhỏ làm ngày thường dễ chịu hơn.',
      budget: 800000,
      style: 'home',
      color: 'mint',
      status: 'active',
      createdAt: Date.now() - 1000,
    },
    {
      id: 'demo-tech',
      name: 'Góc làm việc mới',
      description: 'Một khoản mua sắm đã hoàn tất.',
      budget: 1500000,
      style: 'tech',
      color: 'peach',
      status: 'done',
      createdAt: Date.now() - 2000,
    },
  ]
  for (const transaction of transactions) {
    if (['Bữa tối cùng bạn bè', 'Vé xem phim'].includes(transaction.title))
      transaction.bagId = bags[0].id
    if (transaction.title === 'Mua đồ dùng trong nhà') transaction.bagId = bags[1].id
    if (transaction.title === 'Tai nghe mới') transaction.bagId = bags[2].id
  }
  return {
    transactions,
    bags,
    notes: [
      {
        id: uid(),
        title: 'Một lời nhắc nhỏ',
        content:
          'Mua thứ mình cần, dành dụm cho điều mình muốn. Tháng này thử nấu ăn ở nhà nhiều hơn nhé!',
        color: 'yellow',
        date: dateKey(),
        pinned: true,
      },
      {
        id: uid(),
        title: 'Dành cho chuyến đi Đà Lạt',
        content: 'Mỗi tháng để dành 2 triệu. Một chuyến đi thật chậm vào cuối năm.',
        color: 'purple',
        date: dateKey(),
        pinned: false,
      },
    ],
    profile: { name: 'bạn', budget: 12000000 },
    budgets: Object.fromEntries(CATEGORIES.map((category) => [category.id, category.budget])),
    isDemo: true,
  }
}

export const STORAGE_KEY = 'may-expense-tracker-v1'

export function isValidDate(value) {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value < '1900-01-01' ||
    value > '2100-12-31'
  )
    return false
  const parsed = new Date(`${value}T12:00:00`)
  return !Number.isNaN(parsed.getTime()) && dateKey(parsed) === value
}

export function isValidData(data) {
  return (
    data &&
    Array.isArray(data.transactions) &&
    Array.isArray(data.notes) &&
    (data.bags === undefined ||
      (Array.isArray(data.bags) &&
        data.bags.every(isValidBag) &&
        new Set(data.bags.map((bag) => bag.id)).size === data.bags.length)) &&
    data.profile &&
    typeof data.profile.name === 'string' &&
    data.profile.name.trim().length > 0 &&
    data.profile.name.length <= 40 &&
    typeof data.isDemo === 'boolean' &&
    Number.isSafeInteger(data.profile.budget) &&
    data.profile.budget <= 1e12 &&
    data.profile.budget > 0 &&
    data.budgets &&
    CATEGORIES.every(
      (category) =>
        Number.isSafeInteger(data.budgets[category.id]) &&
        data.budgets[category.id] > 0 &&
        data.budgets[category.id] <= 1e12,
    ) &&
    data.transactions.every(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        item.title.trim() &&
        Number.isSafeInteger(item.amount) &&
        item.amount > 0 &&
        item.amount <= 1e12 &&
        isValidDate(item.date) &&
        Number.isFinite(item.createdAt) &&
        ['income', 'expense'].includes(item.type) &&
        CATEGORIES.some((category) => category.id === item.category) &&
        typeof item.note === 'string' &&
        ['Chuyển khoản', 'Tiền mặt', 'Thẻ ngân hàng'].includes(item.wallet) &&
        item.title.length <= 100 &&
        item.note.length <= 1000 &&
        (item.review === undefined || (item.type === 'expense' && isValidReview(item.review))) &&
        (item.bagId === undefined ||
          (item.type === 'expense' &&
            typeof item.bagId === 'string' &&
            (data.bags || []).some((bag) => bag.id === item.bagId))),
    ) &&
    data.notes.every(
      (note) =>
        note &&
        typeof note.id === 'string' &&
        typeof note.title === 'string' &&
        typeof note.content === 'string' &&
        ['yellow', 'purple', 'green'].includes(note.color) &&
        isValidDate(note.date) &&
        note.title.trim().length > 0 &&
        note.title.length <= 100 &&
        note.content.length <= 3000 &&
        typeof note.pinned === 'boolean',
    ) &&
    new Set(data.transactions.map((item) => item.id)).size === data.transactions.length &&
    new Set(data.notes.map((note) => note.id)).size === data.notes.length
  )
}

export function readData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (isValidData(parsed)) return { data: parsed, error: '' }
      return {
        data: createDemoData(),
        error:
          'Dữ liệu đã lưu không hợp lệ. Bản lưu cũ vẫn được giữ lại; hãy kiểm tra trước khi lưu thay đổi.',
      }
    }
  } catch {
    return {
      data: createDemoData(),
      error: 'Không đọc được bộ nhớ trình duyệt. Dữ liệu hiện tại có thể chưa được lưu.',
    }
  }
  return { data: createDemoData(), error: '' }
}

export function downloadFile(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function exportCSV(transactions) {
  const cell = (value) =>
    `"${String(value)
      .replace(/^[=+@\-\t\r]/, "'$&")
      .replaceAll('"', '""')}"`
  const rows = [
    ['Ngày', 'Giao dịch', 'Loại', 'Danh mục', 'Số tiền (VND)', 'Thanh toán', 'Ghi chú'],
    ...transactions.map((item) => [
      item.date,
      item.title,
      item.type === 'expense' ? 'Chi tiêu' : 'Thu nhập',
      getCategory(item.category).name,
      item.amount,
      item.wallet,
      item.note,
    ]),
  ]
  downloadFile(
    `\uFEFF${rows.map((row) => row.map(cell).join(',')).join('\r\n')}`,
    `may-giao-dich-${dateKey()}.csv`,
    'text/csv;charset=utf-8',
  )
}
