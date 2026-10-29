import { dateKey, uid } from '../../src/shared/storage/data.js'
import {
  createCategoryBudgetPolicy,
  LEGACY_CATEGORY_BUDGETS,
} from '../../src/features/budgets/categoryBudgets.js'

export function createSampleData() {
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
    budgets: { ...LEGACY_CATEGORY_BUDGETS },
    categoryBudgetPolicy: createCategoryBudgetPolicy(),
  }
}

export async function seedSampleBook(page, data = createSampleData()) {
  await page.addInitScript((value) => {
    if (!localStorage.getItem('may-expense-tracker-v1'))
      localStorage.setItem('may-expense-tracker-v1', JSON.stringify(value))
  }, data)
}
