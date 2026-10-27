# mây. — Expense Tracker

Ứng dụng quản lý lịch sử chi tiêu bằng React 19 và Vite, giao diện tiếng Việt với font Be Vietnam Pro, Lucide cho thao tác và SVG tự vẽ cho danh mục. Hiệu ứng chuyển trang và hộp thoại dùng Motion, tôn trọng tùy chọn giảm chuyển động của thiết bị.

## Chạy ứng dụng

Yêu cầu Node.js 22.12+ và npm.

```sh
npm install
npm run dev
```

Vite in địa chỉ local khi khởi động, thường là `http://localhost:5173`.

```sh
npm run build       # Build production vào dist/
npm run preview     # Xem bản production
npm run test:e2e    # Kiểm tra hành vi bằng Playwright
npm run format     # Định dạng mã nguồn
```

## Tính năng

- Tổng quan thu nhập, chi tiêu, số dư theo tháng với thẻ pastel, SVG thỏ ôm hũ tiết kiệm, mây cầu vồng và sticker hoa. Biểu đồ chi mỗi ngày và phân bổ theo danh mục tính từ giao dịch thực tế; ngân sách có hũ tích lũy và thanh tiến độ riêng.
- Thêm, sửa, xóa khoản thu/chi; lưu ngày, danh mục, cách thanh toán và ghi chú riêng.
- Lịch sử theo phong cách nhật ký pastel với thỏ ôm sổ, ví tiền và túi mua sắm bằng SVG; tổng kết thu/chi và thẻ giao dịch dạng sticker, nhóm theo ngày. Tìm kiếm không dấu, lọc loại/danh mục/tháng, sắp xếp và phân trang; dropdown có SVG, hỗ trợ bàn phím và cảm ứng. Khi sắp xếp số tiền, thứ tự được giữ theo giá trị; CSV xuất các kết quả đang lọc.
- Tám danh mục dạng phong bì với minh họa SVG riêng, tổng quan vòng tiến độ, lọc nhóm gần/vượt hạn mức và sắp xếp mức chi. Phân bổ chi tiết có thể thu gọn trên mobile. Popup ngân sách có mức chọn nhanh và xem trước số tiền còn lại; ngân sách tổng và hạn mức từng nhóm được cấu hình riêng.
- Sổ ghi chú với thẻ giấy ba màu, tìm kiếm không dấu, lọc màu/ghim và tab ghi chú từ giao dịch theo tháng. Popup viết có bộ đếm ký tự, chọn màu giấy và thanh lưu cố định trên mobile.
- Cá nhân hóa tên, xuất/khôi phục bản sao lưu JSON có kiểm tra định dạng và xác nhận trước khi thay thế dữ liệu.
- Bố cục rộng linh hoạt, sidebar pastel với icon Lucide dạng sticker và SVG mây bên cuốn sổ. Menu trượt trên điện thoại, thu gọn trang trí khi màn hình thấp; menu và hộp thoại hỗ trợ bàn phím, focus và Escape.

Ứng dụng ban đầu hiển thị dữ liệu mẫu để khám phá. Chọn **Dữ liệu mẫu → Tạo sổ của tôi** hoặc vào **Cài đặt → Tạo sổ của tôi** để xóa các bản ghi mẫu và bắt đầu sổ riêng.

## Lưu trữ

Dữ liệu dùng `localStorage` với khóa `may-expense-tracker-v1`, chỉ lưu trong trình duyệt/thiết bị hiện tại. Chưa có backend, tài khoản hoặc đồng bộ giữa các thiết bị. Dùng **Cài đặt → Xuất bản sao lưu** để lưu hoặc chuyển dữ liệu. Nếu trình duyệt từ chối ghi dữ liệu, ứng dụng hiển thị thông báo và vẫn cho phép xuất bản sao lưu từ trạng thái hiện tại.

Số dư trên dashboard là **thu nhập trừ chi tiêu của tháng đang chọn**. Biểu đồ thể hiện **chi tiêu từng ngày**, không phải số dư hay số liệu tích lũy. Ngân sách tổng và ngân sách từng danh mục được cấu hình riêng.

## Cấu trúc

```text
src/
  App.jsx                      # Điều hướng, dashboard, lịch sử, ghi chú, cài đặt
  App.css                      # Bố cục, giao diện và responsive
  index.css                    # Font cục bộ, token màu và reset
  data.js                      # Mẫu dữ liệu, kiểm tra, định dạng, CSV và sao lưu
  components/
    CategoryArt.jsx            # Chín minh họa SVG (tám nhóm chi + thu nhập)
    SpendingChart.jsx          # Biểu đồ SVG tính từ giao dịch
    CategoriesView.jsx         # Tổng quan ngân sách, thẻ danh mục và lọc hạn mức
    FilterSelect.jsx           # Dropdown danh mục và sắp xếp trong lịch sử
    HistoryOverview.jsx        # Tổng kết tháng và thẻ thu/chi pastel
    HistoryArt.jsx             # SVG thỏ ôm sổ, ví tiền và túi mua sắm
    OverviewArt.jsx            # SVG hũ tiết kiệm, thỏ, mây cầu vồng, hoa và hóa đơn
    OverviewView.css           # Giao diện Tổng quan pastel và responsive
    SidebarArt.jsx             # SVG mây, cuốn sổ, chậu cây và tách trà
    Sidebar.css                # Sidebar pastel, trạng thái chọn và menu mobile
    NotesView.jsx              # Sổ ghi chú, tìm kiếm, bộ lọc và tab giao dịch
    dialogs/                   # Module riêng cho popup giao dịch, ghi chú, ngân sách
tests/expense.spec.js           # Kiểm tra hành vi và responsive
tests/categories.spec.js        # Hạn mức, xem trước, lưu và popup ngân sách trên mobile
tests/notes.spec.js             # Tìm kiếm, ghim, tab giao dịch và popup trên mobile
tests/overview-donut.spec.js    # Tỷ lệ hiển thị lát nhỏ, vòng 100%, tháng trống và lọc từ chú giải
```

Trên Windows, cấu hình Playwright sử dụng Chrome tại đường dẫn mặc định trong `Program Files`. Trên hệ điều hành khác, chạy `npx playwright install chromium` trước lần kiểm tra đầu tiên. Bộ kiểm tra bao gồm thêm/sửa/xóa, lưu qua tải lại, thu nhập, ghi chú, bộ lọc, CSV, ngân sách, focus, lỗi bộ nhớ và độ rộng 320–2560px.
