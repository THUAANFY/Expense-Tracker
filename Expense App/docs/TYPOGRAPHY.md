# Quy ước chữ của mây.

Nguồn cấu hình: [`src/shared/styles/typography.css`](../src/shared/styles/typography.css).
File được nạp từ `index.css`, áp dụng cho cả theme sáng và tối, kể cả popup render ngoài app.

Font chung là **Plus Jakarta Sans**, dùng bản variable hỗ trợ các mức đậm 200–800 và tiếng Việt.
Đổi họ font tại `--font-family-ui`; các giá trị cỡ chữ và độ đậm vẫn theo các token bên dưới.
Riêng ký hiệu `₫` dùng alias `May Currency` từ cùng font, thu về 82% để giữ nét gạch gọn.

## Các vai trò

| Vai trò                       | Token kích thước       | Desktop                 | Mobile ≤760px   | Độ đậm |
| ----------------------------- | ---------------------- | ----------------------- | --------------- | ------ |
| Tiêu đề trang `h1`            | `--font-page-title`    | 27px                    | 23px            | 500    |
| Tiêu đề popup                 | `--font-dialog-title`  | 20px                    | 18px            | 500    |
| Tiêu đề khu vực               | `--font-section`       | 15px                    | 14px            | 500    |
| Tiêu đề thẻ, tên nổi bật      | `--font-card-title`    | 14px                    | 14px            | 500    |
| Nội dung thông thường         | `--font-body`          | 13px                    | 13px            | 300    |
| Nội dung dài, ghi chú cần đọc | `--font-content`       | 14px                    | 14px            | 300    |
| Chữ phụ, ngày, chú thích      | `--font-caption`       | 12px                    | 12px            | 300    |
| Label của ô nhập              | `--font-control-label` | 12px                    | 12px            | 400    |
| Nút thao tác                  | `--font-control`       | 13px                    | 13px            | 400    |
| Giá trị ô nhập/select         | `--font-control`       | 13px                    | 13px            | 300    |
| Tab lọc                       | `--font-tab`           | 12px                    | 12px khi ≤560px | 400    |
| Badge số lượng                | `--font-badge`         | 12px                    | 12px            | 400    |
| Số tiền trong danh sách       | `--font-value`         | 14px                    | 13px            | 500    |
| Số tiền tổng nổi bật          | `--font-value-large`   | 22–26px theo chiều rộng | 22px            | 500    |

`h1` giảm theo viewport: 27px từ 1024px; 25px từ 761–1023px; 23px từ 375–760px;
21px ở màn hình ≤374px. Các breakpoint chỉ khai báo trong `typography.css`.

## Độ đậm và chiều cao dòng

- `--font-weight-regular: 300`: đoạn văn, mô tả, giá trị nhập.
- `--font-weight-medium: 400`: label, nút, tab, badge và đoạn cần nhấn nhẹ.
- `--font-weight-semibold: 500`: tiêu đề, số liệu và số tiền.
- `--font-weight-brand: 500`: chỉ dành cho chữ thương hiệu/logo.
- Heading dùng `--line-height-heading` (1.35), tiêu đề mục dùng `--line-height-section` (1.45).
- Nội dung dùng `--line-height-body` (1.6); chữ phụ dùng `--line-height-caption` (1.5).
- Nút/ô nhập dùng `--line-height-control` (20px) để căn icon và chữ.

## Cách áp dụng

Chọn token theo vai trò. Không thêm `font-size`/`font-weight` số cứng mới trong component.
Khi cần điều chỉnh cả app, sửa token trong `typography.css`, không tạo bản riêng cho dark mode.

```css
.card-title {
  font-size: var(--font-card-title);
  font-weight: var(--font-weight-heading);
  line-height: var(--line-height-section);
}

.field-label {
  font-size: var(--font-control-label);
  font-weight: var(--font-weight-label);
}

.amount {
  font-size: var(--font-value);
  font-weight: var(--font-weight-value);
  font-variant-numeric: tabular-nums;
}
```

Giữ nguyên trạng thái active/hover bằng màu, nền và viền; không tăng cỡ chữ hoặc độ đậm làm lệch bố cục.
Tên dài cho phép xuống dòng hoặc ellipsis theo loại nội dung. Không thu nhỏ chữ thường để ép vừa ô.
Số tiền rất dài được dùng `--font-value-long` (22px desktop, 18px mobile), xuống dòng hoặc dạng rút gọn
theo chức năng sẵn có; luôn giữ chính xác dữ liệu gốc.

Logo, chữ trong SVG và các con số trang trí có tỷ lệ riêng. `--font-meta` (11px) chỉ dùng cho
thông tin phụ rất ngắn như số thứ tự/nhãn biểu đồ; không dùng cho nội dung hay nút thao tác chính.
Một số hình minh họa hoặc bố cục số liệu cũ vẫn dùng `clamp()` riêng; các token chung là mặc định
cho thành phần mới và các thành phần dùng chung đã được chuẩn hóa.

`--font-small` là alias tương thích của `--font-caption`. Các alias `--settings-font-*` lấy từ
bộ token chung; nội dung Cài đặt dùng cỡ đọc dài 14px.
