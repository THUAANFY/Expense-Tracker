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

- Màn hình mở đầu có logo hiện dần, tên mây và slogan “Gọn chi tiêu, nhẹ cuộc sống.” xuất hiện lần lượt; nền mờ dần khi app đã sẵn sàng. Hiệu ứng mở đầu khoảng 1,6 giây khi tải nhanh, giữ màn hình khi ứng dụng còn đang tải, không chạy lại khi chuyển mục. Tùy chọn giảm chuyển động bỏ hiệu ứng và thời gian chờ thêm. Nếu logo tải lỗi vẫn mở được app; lỗi tải mã hoặc lỗi hiển thị có nút tải lại, giữ nguyên dữ liệu đã lưu.
- Logo riêng của mây là SVG mây ghi sổ thu chi: bìa sổ, các lớp giấy, đường gấp, dấu ₫, dòng thu/chi, biểu đồ nhỏ và bút chì được vẽ liền mạch. Bản gốc ở `public/logo-may.svg`; favicon thu gọn ở `public/favicon.svg`. Biểu tượng 64px trên sidebar đi cùng tên mây và dòng “QUẢN LÝ CHI TIÊU”, giữ khoảng cách rõ với menu trên mobile.
- Tổng quan thu nhập, chi tiêu, chênh lệch thu − chi theo tháng với thẻ pastel, SVG thỏ ôm hũ tiết kiệm, mây cầu vồng và sticker hoa. Thanh Nguồn tiền hiển thị tổng tiền đang theo dõi đến hôm nay, độc lập với tháng thống kê. Biểu đồ chi mỗi ngày và phân bổ theo danh mục tính từ giao dịch thực tế; ngân sách có hũ tích lũy và thanh tiến độ riêng.
- Khi Giao dịch gần đây trống, Tổng quan hiển thị SVG biên lai ôm bút chì, nội dung theo tháng đang xem và nút thêm giao dịch. Bố cục gọn đặt hình cạnh nội dung trên desktop, xếp lại trên mobile; dùng cỡ chữ/màu chung của app và hiệu ứng bút chì nhẹ khi tương tác.
- **Nguồn tiền**: tạo nguồn tiền mặt, tài khoản ngân hàng hoặc ví điện tử với tên riêng, màu pastel và ba minh họa SVG chi tiết. Khai báo số dư đầu ngày và ngày bắt đầu; xem số dư, thu/chi và nhật ký từng nguồn. Ghi chuyển giữa hai nguồn không tạo khoản thu/chi. Nhật ký theo kiểu sổ thu chi với SVG sổ tay, tem ngày và nhãn nguồn riêng; nhóm bản ghi theo ngày, căn cột số tiền và hiển thị rõ nguồn đi/đến của khoản chuyển. Tìm kiếm không dấu, lọc nguồn kết hợp Thu/Chi/Chuyển và phân trang; mobile rút gọn nhãn lọc, ưu tiên tên và số tiền. Giao dịch cũ chưa gán nguồn có lối vào riêng để gán dần.
- Card nguồn tiền nằm trên một dải trượt ngang: desktop tối đa 3 nguồn, tablet 2, mobile 1 nguồn trong khung nhìn. Chỉ hiện nút chuyển và bộ đếm khi còn nguồn ở ngoài khung; hỗ trợ vuốt, mũi tên bàn phím, Home và End. Thêm nguồn mới tự đưa nguồn đó vào khung nhìn; xóa nguồn cuối vẫn giữ danh sách hợp lệ. Tổng tiền và nhật ký luôn tính trên toàn bộ nguồn.
- Tổng quan nguồn tiền theo kiểu **Góc bàn của mây**: ví có đường may và charm mây cạnh tổng tiền, hai ví cùng đồng xu cho thao tác chuyển nguồn, xấp hóa đơn kẹp giấy mang số khoản chưa gán. Ba cụm cùng một hàng desktop trên nét mặt bàn nhẹ, không chia ô đóng khung. Mobile đặt số dư bên trái, ví minh họa bên phải, thông tin ngày và số nguồn bên dưới; hai thao tác nằm cạnh nhau trên mảnh giấy tím/vàng với SVG và mũi tên rõ ràng. Khi không còn khoản chưa gán, thao tác chuyển nguồn dùng trọn hàng. Chữ dùng chung token của app. Đồng xu và charm chuyển động khi tương tác, tôn trọng thiết lập giảm chuyển động. Nút gán nguồn mở đúng nhật ký chưa gán; mục chờ ẩn khi hết bản ghi.
- Badge nhận diện nguồn dùng SVG riêng: ngân hàng xanh lam với tòa nhà và đồng xu, tiền mặt xanh lá với ví khâu chỉ, ví điện tử tím với điện thoại và ví nhỏ, chưa gán nguồn vàng kem với thẻ chờ nét đứt. Màu badge cố định theo loại, độc lập với màu card; tên nguồn tự đặt được giữ trên badge trong nhật ký, lịch sử và dropdown. Badge dùng chung cỡ chữ và có bản nhỏ cho các dòng giao dịch.
- Thêm, sửa, xóa khoản thu/chi; lưu ngày, danh mục, nguồn tiền, cách thanh toán và ghi chú riêng. Popup có số dư dự kiến sau khi lưu; thêm nguồn ngay trong popup giữ nguyên giao dịch đang nhập. Khi đã có nguồn, giao dịch mới cần chọn nguồn (tự chọn nếu chỉ có một nguồn); các bản ghi cũ chưa gán vẫn có thể sửa và lưu.
- Sau khi lưu hoặc sửa giao dịch thành công, thông báo có nút **Xem giao dịch vừa lưu**. Các bộ lọc tìm kiếm, loại và danh mục đang dùng được giữ cho đến khi bấm nút; lúc đó app mở Lịch sử giao dịch, gỡ bộ lọc, tìm đúng tháng/trang, cuộn tới và đánh dấu bản ghi. Thông báo có thao tác hiển thị 10 giây, tạm dừng tự đóng khi hover hoặc có focus bàn phím. Lưu thất bại giữ popup và nội dung nhập; giao dịch đã bị xóa ở tab khác được báo rõ khi bấm xem.
- Lịch sử theo phong cách nhật ký pastel với thỏ ôm sổ, ví tiền và túi mua sắm bằng SVG; tổng kết thu/chi và thẻ giao dịch dạng sticker, nhóm theo ngày. Tìm kiếm không dấu, lọc loại/danh mục/tháng, sắp xếp và phân trang; dropdown có SVG, hỗ trợ bàn phím và cảm ứng. Khi sắp xếp số tiền, thứ tự được giữ theo giá trị; CSV xuất các kết quả đang lọc.
- Danh mục trong lịch sử dành cho khoản chi: chọn danh mục chuyển sang Khoản chi, chọn Khoản thu trả danh mục về Mọi danh mục. Khoản thu được tìm kiếm và xuất CSV với nhãn Thu nhập; mã danh mục còn lưu trong bản ghi cũ không khiến khoản thu lọt vào bộ lọc chi tiêu. Không sửa dữ liệu đã lưu khi lọc.
- Nhật ký trống dùng SVG thỏ và sổ, với kính lúp khi không có kết quả lọc hoặc bút chì khi tháng chưa có giao dịch. Bố cục gọn không có khung nền lớn; ưu tiên xóa bộ lọc khi đang tìm kiếm, còn tháng trống có nút thêm giao dịch. Hai thao tác lọc dùng chung một hàm đặt lại điều kiện trong tháng đang xem.
- Chuyển mục từ sidebar, nút chuyển nhanh hoặc mở chi tiết túi sẽ bắt đầu ở đầu trang; chọn lại mục hiện tại cũng về đầu. Phân trang và lưu giao dịch trong cùng mục giữ vị trí đang xem. Liên kết xem giao dịch vừa lưu vẫn cuộn tới đúng bản ghi và đánh dấu giao dịch.
- Các select danh mục, sắp xếp, nguồn tiền, thanh toán và túi dùng chung khoảng đệm hai bên, khoảng cách icon và padding của lựa chọn. Menu select và lịch giữ khoảng cách tối thiểu 16px với mép màn hình. Tên dài hiển thị dấu ba chấm để giữ chỗ cho mũi tên và dấu chọn; tên đầy đủ vẫn có trong nhãn truy cập và tooltip.
- Tám danh mục dạng phong bì với minh họa SVG riêng, tổng quan vòng tiến độ, lọc nhóm gần/vượt hạn mức và sắp xếp mức chi. Hạn mức tự chia theo ngân sách của tháng đang chọn; nhãn Tự động/Đặt riêng giúp nhận biết cách phân bổ. Có thể đặt riêng từng mục, trở về mức tự động hoặc dùng lại toàn bộ tỷ lệ gợi ý. Popup có mức chọn nhanh và xem trước số tiền còn lại; chi tiết tổng hạn mức có thể thu gọn trên mobile.
- Bộ lọc Gần hạn mức và Đã vượt có trạng thái trống riêng: SVG phong bì vàng kèm đồng hồ hoặc phong bì xanh kèm khiên. Nội dung giải thích đúng phạm vi bộ lọc, không suy diễn tình trạng ngân sách tổng. Bố cục gọn, đồng bộ chữ và có nút xem lại toàn bộ danh mục; thao tác lọc không sửa dữ liệu.
- **Góc mây ghi chép** nằm dưới lời nhắn ở cột phải Tổng quan trên desktop: SVG mây viết sổ bên chậu cây, bút chì và đồng xu; biên lai nhỏ hiển thị khoản chi lớn nhất của tháng đang xem, nhấn để mở đúng giao dịch. Không tính khoản thu; các khoản bằng tiền nhau ưu tiên ngày mới hơn rồi đến thời điểm tạo. Tháng chưa có chi tiêu có lời nhắn riêng và nút ghi khoản chi khi tháng còn mở. Mây chớp mắt, tay viết và lá cây chuyển động nhẹ; dừng ngoài vùng nhìn, khi tab ẩn hoặc khi bật giảm chuyển động. Góc này ẩn ở màn hình từ 1050px trở xuống để giữ bố cục mobile/tablet gọn.
- **Túi chi tiêu theo dịp**: tạo túi cho chuyến đi, quà tặng, góc nhà hoặc công nghệ với bốn minh họa SVG riêng: vali có bánh xe, túi quà thắt nơ, giỏ đan và túi công nghệ có laptop; mỗi mẫu có bốn màu. Đặt ngân sách tùy chọn, gom giao dịch đã có xuyên tháng hoặc thêm khoản chi mới vào túi; tổng chi, số tiền còn lại/vượt mức và phân bổ danh mục cập nhật từ dữ liệu thực tế. Tìm kiếm không dấu, lọc đang mở/hoàn tất; hoàn tất, mở lại, sửa hoặc xóa túi. Chọn giao dịch có tìm kiếm, phân trang và giữ lựa chọn giữa các trang. Tổng quan có lối vào nhanh, sidebar đếm túi đang mở.
- Ghi chú và cảm nhận cũ được giữ nguyên ở **Túi chi tiêu → Ghi chú đã lưu / Cảm nhận đã lưu**. Các thao tác tìm kiếm, lọc, thêm/sửa/xóa ghi chú và đánh giá chi tiêu vẫn hoạt động.
- Cài đặt dạng bảng gọn, chia nhóm cá nhân hóa và dữ liệu bằng đường ngăn nhẹ; ô nhập nhỏ, mức chọn nhanh ngân sách và SVG lưu trữ thu nhỏ. Có bộ chọn tháng để lưu ngân sách tổng riêng từng tháng. Nhập mức vượt số dư các nguồn đến hôm nay sẽ hiện thông báo và khóa lưu; dữ liệu được kiểm tra lại trong lượt ghi để tránh số dư thay đổi ở tab khác. Số giao dịch/ghi chú nằm trên một dòng; xuất bản sao lưu JSON và xem trước tên sổ, ngân sách của tháng đang chọn, số bản ghi trước khi xác nhận khôi phục.
- Chuông thông báo trong app với cảnh báo ngân sách tổng/danh mục ở mốc 80%, dùng hết 100% và vượt hạn mức; tổng kết tháng trước và lời nhắc sau 3 ngày chưa ghi giao dịch. Có lọc chưa đọc, đọc tất cả, bật/tắt lời nhắc và điều hướng đúng tháng/danh mục. Thông báo đã đọc không lặp lại trong cùng mốc ngân sách.
- Bố cục rộng linh hoạt, sidebar pastel với icon Lucide dạng sticker và SVG mây đeo kính đọc sổ. Mây nhấp nhô, chớp mắt, vẫy tay khi hover/focus; cây đung đưa, hơi trà bay và sao lấp lánh nhẹ. Animation dừng khi menu mobile đóng, hình bị ẩn hoặc thiết bị bật chế độ giảm chuyển động. Menu và hộp thoại hỗ trợ bàn phím, focus và Escape.

Ứng dụng mở vào sổ riêng trống ngay lần đầu: chưa có giao dịch, nguồn tiền, túi hoặc ghi chú. Chọn **Nguồn tiền → Thêm nguồn tiền** để khai báo số dư đầu ngày, hoặc **Thêm giao dịch** để ghi trước và gán nguồn sau. Ngân sách ban đầu là thiết lập mặc định có thể chỉnh trong Cài đặt và Danh mục & ngân sách. Không còn chế độ dùng thử hay nút tạo lại sổ. Những bản ghi đã lưu và bản sao lưu cũ vẫn được giữ, kể cả khi từng có cờ `isDemo`; cờ cũ được bỏ khi đọc/ghi mà không xóa bản ghi.

## Lưu trữ

Dữ liệu dùng `localStorage` với khóa `may-expense-tracker-v1`, chỉ lưu trong trình duyệt/thiết bị hiện tại. Chưa có backend, tài khoản hoặc đồng bộ giữa các thiết bị. Dùng **Cài đặt → Xuất bản sao lưu** để lưu hoặc chuyển dữ liệu. Nếu trình duyệt từ chối ghi dữ liệu, ứng dụng hiển thị thông báo và vẫn cho phép xuất bản sao lưu từ trạng thái hiện tại.

Các tab cùng trình duyệt tự cập nhật khi dữ liệu thay đổi. Mỗi lần lưu được tuần tự hóa bằng transaction IndexedDB trong `may-book-writes-v1`; dữ liệu sổ vẫn giữ định dạng localStorage cũ. Thay đổi độc lập được gộp theo bản ghi và từng trường, còn sửa/xóa xung đột sẽ bị chặn và giữ nội dung trong popup. Khôi phục toàn bộ sổ cũng kiểm tra bản lưu chưa đổi kể từ lúc xác nhận được mở.

Nếu bản lưu không đọc được hoặc không đúng cấu trúc, app khóa ghi và không thay bằng dữ liệu mẫu. Nguyên bản được giữ tại khóa chính và sao chép riêng với tiền tố `may-expense-tracker-v1:recovery:` khi bộ nhớ cho phép. **Cài đặt → Tải bản gốc** xuất đúng nội dung ban đầu, kể cả JSON lỗi. Chỉ xác nhận khôi phục một bản hợp lệ mới được thay khóa chính; nếu không thể giữ bản gốc riêng thì khôi phục cũng bị chặn. Khi lưu thất bại, popup giữ nội dung chưa lưu để thử lại; bản sao lưu thông thường chứa sổ đã lưu thành công.

Trạng thái đã đọc và tùy chọn nhắc ghi chép lưu riêng trong `may-notifications-v1`. Chuông luôn tính theo tháng hiện tại và cập nhật khi mở web, trở lại tab hoặc thay đổi giao dịch/ngân sách. Lời nhắc dựa trên ngày tạo giao dịch, nên ghi một khoản có ngày cũ hôm nay vẫn được tính là vừa ghi chép. Khi cảnh báo không còn phù hợp, mục tương ứng tự biến mất. Đây là thông báo trong app; chưa gửi push khi đóng web. Bản sao lưu JSON chứa dữ liệu chi tiêu, không kèm trạng thái đọc thông báo.

Thẻ **Chênh lệch thu − chi** trên dashboard tính **thu nhập trừ chi tiêu của tháng đang chọn**. Số dư nguồn tiền được tính riêng đến hôm nay. Biểu đồ thể hiện **chi tiêu từng ngày**, không phải số dư hay số liệu tích lũy. Hạn mức danh mục tự phân bổ từ ngân sách tổng của tháng đó, có thể đặt riêng khi cần.

Ngân sách tổng lưu trong `monthlyBudgets` tùy chọn, ánh xạ `YYYY-MM` sang số nguyên dương tối đa 1.000 tỷ. Tháng chưa đặt riêng dùng `profile.budget` làm mức mặc định tương thích sổ cũ; lưu tháng mới không sửa mức mặc định hay các tháng khác. Tổng quan, ngân sách và thông báo đều đọc đúng tháng. Mức mới không được lớn hơn tổng số dư nguồn đến hôm nay (khoản chưa gán nguồn và khoản thu tương lai chưa tính vào tiền hiện có). Đặt ngân sách không trừ tiền nguồn. Các ngân sách đã lưu và bản sao lưu lịch sử vẫn được giữ khi số dư giảm; đổi tên không bắt buộc sửa lại ngân sách. Bản sao lưu cũ chưa có `monthlyBudgets` vẫn được đọc và khôi phục.

Các tháng trước tháng hiện tại theo lịch cục bộ là **chỉ xem**: vẫn xem chi tiết, tìm kiếm, lọc và xuất dữ liệu; không thêm, sửa hoặc xóa giao dịch/chuyển nguồn, kể cả đổi ngày sang tháng mở. Lịch nhập giao dịch không cho chọn tháng đã qua. Tổng quan, lịch sử, danh mục, cảm nhận và Cài đặt hiển thị trạng thái khóa cùng lối về tháng hiện tại. Giao dịch cũ không thể gán lại nguồn, gom/bỏ khỏi túi hoặc sửa cảm nhận; túi chứa giao dịch cũ được khóa xóa. Kiểm tra tại lượt ghi dùng tháng hiện tại lúc lưu để bảo vệ cả bản nháp mở qua giao thừa tháng và các thay đổi từ nhiều tab.

Tỷ lệ khởi tạo của hạn mức danh mục: Ăn uống 25%, Nhà cửa 30%, Di chuyển 10%, Mua sắm 10%, Giải trí 8%, Sức khỏe 7%, Học tập 5%, Khác 5%. **Cài đặt → Tỷ lệ danh mục** cho phép nhập số nguyên 0–100% từng mục, xem trước số tiền và dùng lại tỷ lệ ban đầu. Tổng phải bằng 100% mới lưu được. Tỷ lệ lưu trong `monthlyCategoryWeights[YYYY-MM]`, áp dụng từ tháng chọn đến trước tháng có bộ tỷ lệ riêng tiếp theo; các tháng đã qua chỉ xem. Bản nháp được giữ khi đổi tháng, lưu lỗi hoặc xung đột ở tab khác. Tỷ lệ đi cùng bản sao lưu JSON; bản cũ thiếu trường này vẫn được đọc. Đây là tỷ lệ gợi ý, không suy đoán từ lịch sử chi tiêu.

App làm tròn theo phần dư lớn nhất để tổng các mức tự động bằng ngân sách tháng đến từng đồng. Mức đặt riêng lưu tại `monthlyCategoryBudgets[YYYY-MM][categoryId]` (0–1.000 tỷ); app dành tiền cho các mức này trước rồi chia phần còn lại theo tỷ lệ của các mục tự động. Nếu mọi mục đã đặt riêng hoặc các mục tự động còn lại đều có tỷ lệ 0%, khoản chưa phân bổ được ghi rõ; nếu tổng mức đặt riêng vượt ngân sách, app cảnh báo và cho các mục tự động về 0, giữ các mức đã đặt riêng để người dùng điều chỉnh. Hạn mức 0 chưa có khoản chi không tạo cảnh báo; phát sinh chi sẽ báo vượt mức.

`categoryBudgetPolicy` lưu phiên bản, tháng bắt đầu và tỷ lệ khởi tạo để hạn mức tự động của tháng đã qua không đổi khi sang tháng mới hoặc sau khi khôi phục JSON. Sổ cũ được bổ sung trường này bằng lượt ghi tuần tự khi mở; dữ liệu giao dịch và các mức đã lưu giữ nguyên. Những tháng trước khi áp dụng vẫn dùng `budgets` cũ kết hợp mức đặt riêng của đúng tháng; từ tháng áp dụng trở đi dùng phân bổ tự động. Trường `budgets` giữ riêng cho tương thích lịch sử. Chính sách khởi tạo và các bộ tỷ lệ của tháng đã qua được khóa; thay đổi từ Cài đặt tạo bộ tỷ lệ theo tháng mới. Khôi phục bản sao lưu vào sổ đang có dữ liệu cũng phải giữ nguyên lịch sử đã khóa; sổ mới trống hoặc bản lưu hỏng vẫn có thể khôi phục đầy đủ lịch sử để tránh mất dữ liệu.

Nguồn tiền lưu trong `moneySources`; giao dịch liên kết bằng `sourceId`. Số dư là **số dư đầu ngày bắt đầu + các khoản thu − các khoản chi + chuyển vào − chuyển ra**, chỉ tính bản ghi đã gán từ ngày bắt đầu đến hôm nay. Số dư ban đầu không sinh khoản thu. Giao dịch trước ngày bắt đầu vẫn nằm trong báo cáo thu/chi nhưng không được tính lại vào số dư; giao dịch tương lai chỉ có hiệu lực khi đến ngày. Số dư có thể âm và được cảnh báo để kiểm tra khoản thu còn thiếu hoặc số dư ban đầu. Khi tạo nguồn, cần nhập số tiền có vào **đầu ngày**, trước các giao dịch của ngày đó.

Phương thức thanh toán (`wallet`) và nguồn tiền là hai thông tin riêng; app không suy đoán nguồn của giao dịch cũ từ nhãn Tiền mặt/Chuyển khoản. Những bản ghi chưa gán vẫn xuất hiện trong báo cáo nhưng không ảnh hưởng số dư nguồn. Chỉ nguồn chưa có khoản thu/chi và chưa có bản ghi chuyển nguồn mới được xóa sau xác nhận. Nguồn có giao dịch được khóa xóa, hiển thị số bản ghi và lý do ngay cạnh khu vực thao tác; tính cả khoản trước mốc theo dõi và khoản tương lai, kể cả khi số dư bằng 0. Không tự gỡ `sourceId` hay sửa giao dịch khi xóa nguồn. Thay đổi ngày bắt đầu không được bỏ qua các bản ghi chuyển đã lưu.

Chuyển nguồn lưu riêng trong `sourceTransfers` với nguồn đi, nguồn đến, số tiền, ngày và ghi chú. Đây là ghi chép một lần chuyển đã thực hiện bên ngoài; không gọi dịch vụ thanh toán hay kết nối tài khoản. Hai nguồn phải khác nhau và ngày chuyển không được trước ngày bắt đầu của cả hai nguồn. Tổng tiền giữa hai nguồn không đổi; chuyển nguồn không đi vào báo cáo thu nhập/chi tiêu hoặc ngân sách. Sửa/xóa bản ghi chuyển tính lại cả hai số dư. JSON sao lưu/khôi phục cả nguồn và chuyển nguồn, vẫn đọc được bản cũ chưa có hai trường này; CSV có cột Nguồn tiền.

Túi lưu trong trường `bags` tùy chọn, gồm `id`, `name`, `description`, `budget` (0 là chưa đặt), `style`, `color`, `status` và `createdAt`. Mỗi khoản chi có thể có một `bagId`, đồng thời giữ nguyên danh mục. Túi tổng hợp tất cả tháng và có ngân sách riêng. Gom khoản chi không tạo giao dịch mới; bỏ khỏi túi hoặc xóa túi giữ nguyên khoản chi, ghi chú và cảm nhận. Có thể chuyển túi bằng dropdown trong popup sửa giao dịch. Đổi khoản chi thành khoản thu sẽ bỏ liên kết túi. Bản sao lưu JSON chứa cả túi và liên kết; bản cũ chưa có túi vẫn được chấp nhận.

Cảm nhận là trường tùy chọn `review` trong từng giao dịch chi, gồm `rating` (`happy`, `neutral`, `regret`), `note` (tối đa 500 ký tự) và `updatedAt`. Chọn cảm nhận không thay đổi số tiền, ngày chi hoặc ngày tạo giao dịch. Sửa khoản chi giữ cảm nhận; đổi thành khoản thu sẽ bỏ cảm nhận. Bản sao lưu JSON giữ đầy đủ đánh giá, đồng thời vẫn chấp nhận dữ liệu cũ chưa có trường này.

## Cấu trúc

```text
src/
  App.jsx                      # Điều hướng, dashboard, lịch sử, ghi chú, cài đặt
  App.css                      # Bố cục, giao diện và responsive
  index.css                    # Token chữ, màu và reset
  bootstrap.js                 # Mở màn hình khởi động, tải app và xử lý lỗi entry
  startup.js                   # Đồng bộ loading với React sẵn sàng và mở lại tương tác
  startup.css                  # Font cục bộ, logo/slogan xuất hiện và responsive loading
  data.js                      # Sổ trống, kiểm tra, định dạng, CSV và sao lưu
  monthlyBudgets.js            # Ngân sách theo tháng và kiểm tra mức mới với số dư nguồn
  categoryBudgets.js           # Tỷ lệ gợi ý, chia hạn mức nguyên đồng và giữ chính sách lịch sử
  closedMonths.js              # Khóa giao dịch và ngân sách của tháng đã qua khi ghi dữ liệu
  dates.js                     # Ngày cục bộ, tháng và kiểm tra ngày hợp lệ
  moneySources.js              # Nguồn tiền, chuyển nguồn, số dư và kiểm tra dữ liệu
  bookStorage.js               # Tuần tự hóa ghi, gộp thay đổi và cách ly bản lưu lỗi
  notifications.js             # Quy tắc cảnh báo, tổng kết và đọc cấu hình thông báo
  reviews.js                   # Mức cảm nhận, kiểm tra dữ liệu và tổng hợp khoản chi
  bags.js                      # Kiểu túi, màu, kiểm tra, tổng hợp và liên kết giao dịch
  components/
    StartupBoundary.jsx       # Báo app đã dựng xong, dự phòng lỗi render và tải lại
    useBookData.js             # Trạng thái sổ, đồng bộ các tab và phản hồi lỗi lưu
    Toast.jsx                  # Thông báo thao tác, xem giao dịch vừa lưu và thời gian đóng
    Toast.css                  # Nút xem nhanh, bố cục mobile và đánh dấu dòng giao dịch
    CategoryArt.jsx            # Chín minh họa SVG (tám nhóm chi + thu nhập)
    SpendingChart.jsx          # Biểu đồ SVG tính từ giao dịch
    CategoriesView.jsx         # Tổng quan ngân sách, thẻ danh mục và lọc hạn mức
    BudgetFilterEmpty.jsx      # SVG và thao tác cho nhóm gần/vượt hạn mức đang trống
    FilterSelect.jsx           # Dropdown danh mục và sắp xếp trong lịch sử
    MoneySourcesView.jsx       # Số dư các nguồn, nhật ký và gán giao dịch cũ
    MoneySourceSelect.jsx      # Dropdown nguồn tiền và số dư hiện tại
    SourceArt.jsx              # SVG ví tiền mặt, thẻ ngân hàng và ví điện tử
    SourceLedgerArt.jsx        # SVG sổ ghi chép, bút chì, đồng xu và chi tiết trang trí
    SourceSummaryArt.jsx       # SVG ví charm mây, hai ví chuyển xu và hóa đơn kẹp giấy
    SourceCardsRail.jsx        # Dải nguồn tiền một hàng, vuốt và điều hướng có bộ đếm
    SourceBadge.jsx            # Bốn badge và SVG nhận diện nguồn dùng chung
    HistoryOverview.jsx        # Tổng kết tháng và thẻ thu/chi pastel
    HistoryArt.jsx             # SVG thỏ ôm sổ, ví tiền và túi mua sắm
    OverviewArt.jsx            # SVG hũ tiết kiệm, thỏ, mây cầu vồng, hoa và hóa đơn
    OverviewJournalCorner.jsx  # Khoản chi lớn nhất theo tháng và trạng thái chuyển động trong vùng nhìn
    JournalDeskArt.jsx         # SVG mây viết sổ, bàn gỗ, chậu cây và đồng xu
    OverviewView.css           # Giao diện Tổng quan pastel và responsive
    RecentTransactionsEmpty.jsx # Biên lai SVG và thao tác thêm giao dịch khi tháng trống
    SidebarArt.jsx             # SVG mây đeo kính đọc sổ, chậu cây, đồng xu và tách trà
    SidebarArt.css             # Chớp mắt, vẫy tay, lá cây, hơi trà và reduced motion
    Sidebar.css                # Sidebar pastel, trạng thái chọn và menu mobile
    NotificationCenter.jsx     # Chuông, danh sách và thao tác thông báo trong app
    useNotifications.js        # Cập nhật lời nhắc và lưu trạng thái đã đọc
    SettingsView.jsx           # Cá nhân hóa, ngân sách, xuất và xem trước bản sao lưu
    CategoryRatiosSettings.jsx  # Chỉnh tỷ lệ đủ 100%, xem trước hạn mức, lưu theo tháng
    SettingsArt.jsx            # SVG sổ tay, bút chì và hộp lưu trữ
    WorthView.jsx              # Đáng tiền không? Đánh giá, tổng hợp và lọc khoản chi
    MoodArt.jsx                # Ba biểu cảm SVG cho cảm nhận sau chi tiêu
    BagsView.jsx               # Danh sách túi, chi tiết, ngân sách và phân bổ danh mục
    BagArt.jsx                 # SVG vali, túi quà có nơ, giỏ đan và túi đựng công nghệ
    NotesView.jsx              # Ghi chú đã lưu, tìm kiếm, bộ lọc và tab giao dịch
    dialogs/                   # Module riêng cho popup giao dịch, ghi chú, ngân sách
tests/expense.spec.js           # Kiểm tra hành vi và responsive
tests/categories.spec.js        # Hạn mức, xem trước, lưu và popup ngân sách trên mobile
tests/auto-category-budgets.spec.js # Tự chia, làm tròn, đặt riêng, nhiều tab và bảo toàn lịch sử
tests/category-ratios-settings.spec.js # Tỷ lệ tùy chỉnh, kế thừa, khóa lịch sử và bản nháp
tests/closed-months.spec.js     # Chế độ chỉ xem, khóa tại lượt ghi, chuyển tháng và khôi phục lịch sử
tests/notes.spec.js             # Tìm kiếm, ghim, tab giao dịch và popup trên mobile
tests/overview-donut.spec.js    # Tỷ lệ hiển thị lát nhỏ, vòng 100%, tháng trống và lọc từ chú giải
tests/overview-journal-corner.spec.js # Khoản chi lớn nhất, tháng chỉ xem, chuyển động và responsive
tests/notifications.spec.js     # Ngưỡng ngân sách, đọc/lưu, lời nhắc, điều hướng và popup mobile
tests/reviews.spec.js           # Đánh giá, lý do, lọc, sao lưu, ghi chú cũ và popup mobile
tests/bags.spec.js              # Tạo/sửa túi, gom/chuyển giao dịch, sao lưu và popup mobile
tests/money-sources.spec.js     # Số dư, sửa/xóa, chuyển nguồn, dữ liệu cũ, sao lưu và mobile
```

Trên Windows, cấu hình Playwright sử dụng Chrome tại đường dẫn mặc định trong `Program Files`. Trên hệ điều hành khác, chạy `npx playwright install chromium` trước lần kiểm tra đầu tiên. Bộ kiểm tra bao gồm thêm/sửa/xóa, lưu qua tải lại, thu nhập, ghi chú, bộ lọc, CSV, ngân sách, focus, lỗi bộ nhớ và độ rộng 320–2560px.
