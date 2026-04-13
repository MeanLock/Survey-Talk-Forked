# Survey-Talk

## Tổng quan dự án (Project Overview)
Survey-Talk là một nền tảng trung gian kết nối giữa người có nhu cầu tạo khảo sát và những người tham gia làm khảo sát. 
- **Người đăng khảo sát**: Có thể thiết kế, tạo các bài khảo sát trực tiếp trên nền tảng web, sau đó đăng tải để thu thập ý kiến người dùng. Họ sẽ là người trả chi phí cho các lượt tham gia.
- **Người tham gia (Panelist)**: Tham gia trả lời các câu hỏi khảo sát để nhận được thù lao (thù lao này do người tạo khảo sát chi trả).

Hệ thống bao gồm các module/services chính:
- `survey-talk-backend`: Hệ thống máy chủ, xử lý business logic và tương tác cơ sở dữ liệu.
- `survey-talk-console` (Frontend): Giao diện quản trị (Admin/Owner).
- `survey-talk-platform-web` (Frontend): Giao diện ứng dụng người dùng, nơi người tạo và người tham gia tương tác.

## Thông tin dự án (Project Information)
- **Tên dự án**: Survey-Talk
- **Mô tả**: Nền tảng trung gian kết nối giữa người có nhu cầu tạo khảo sát và những người tham gia làm khảo sát.
- **Link**: https://surveytalk.io.vn (Hiện đang tạm dừng host backend)
- **Thời gian**: 2025
- **Team**: 3 thành viên
- **Role của tôi**: Phát triển chính cho phân hệ `survey-talk-platform-web` (Frontend)

---

## 🎯 Survey-Talk Platform Web

Đây là phân hệ Front-end chính hướng đến khách hàng, được xây dựng trên bộ công cụ React (Vite) kết hợp cùng Tailwind, Redux Toolkit và các thư viện hiện đại khác. Tôi là người chịu trách nhiệm phát triển chính cho phân hệ này.

### 🛠 Công nghệ sử dụng (Tech-stack)
- **Core Framework**: React 19, TypeScript, Vite
- **Styling & UI Components**: 
  - Tailwind CSS v4
  - Shadcn UI (xây dựng dựa trên các primitives của Radix UI)
  - MUI (Joy UI / Material UI) dùng làm base cho một số components đa dạng
- **State Management & Routing**: 
  - Redux Toolkit (để quản lý Global Client State)
  - React Router DOM (để xử lý định tuyến/Routing)
- **Data Fetching & Server State**: 
  - TanStack Query (React Query) xử lý fetching, caching, API sync
  - Axios (chuyên biệt cho REST)
- **Form & Data Validation**: React Hook Form kết hợp cùng Zod schemas
- **Utilities khác**: Firebase, Recharts (Hiển thị biểu đồ), Ag-Grid React (Hiển thị Data grid/table), Day.js.

### ⚙️ Các tính năng quan trọng

1. **Tạo Khảo Sát (Create Survey)**: 
   - Quản lý quá trình người đăng tạo nội dung câu hỏi, thiết lập điều kiện và xuất bản. Cung cấp flow tạo form tương tác trực tiếp giúp các tổ chức/cá nhân dễ dàng thiết lập một bài survey tùy chỉnh phức tạp.
2. **Làm Khảo Sát (Do Survey)**:
   - Giao diện thân thiện dành cho người tham gia. Trải nghiệm làm bài đánh giá xuyên suốt, logic luồng (flow) rẽ nhánh được kiểm soát chặt chẽ, tối ưu để nhận về chất lượng câu trả lời cao nhất.

### 📂 Cấu trúc thư mục (Directory Structure)
Dự án được áp dụng các chuẩn cấu trúc thư mục quy chuẩn, dưới đây là tổ chức bên trong thư mục `src`:

```text
survey-talk-platform-web/src/
├── app/         # Thiết lập app cốt lõi
├── assets/      # Nơi lưu trữ tài nguyên tĩnh (hình ảnh, icon, font)
├── components/  # Chứa các UI Component của ShadCN UI
├── config/      # Định nghĩa biến môi trường, thông số cấu hình hệ thống
├── contexts/    # Các React Contexts dùng để chia sẻ state cục bộ
├── core/        # Chứa những module, logic cốt lõi có thể dùng lại ở nhiều phần
├── hooks/       # Custom React Hooks
├── lib/         # Setup, cấu hình Mutation, Query, Axios, v.v.
├── modules/     # Tổ chức các component, logic theo từng chức năng/domain lớn (phù hợp theo quy tắc của tôi)
├── redux/       # Cấu hình store và các slice để quản lý Global State (Redux Toolkit)
├── router/      # Quản lý cấu hình định tuyến (React Router DOM)
├── services/    # Hàm tương tác trực tiếp API với Backend
├── styles/      # Styling chung toàn dự án (Tailwind, SCSS)
└── views/       # Các thành phần giao diện ở mức Page/View tương ứng với từng đường dẫn (Route)
```

---
## Demo Chức Năng 
### 1. Tạo Khảo Sát (Create Survey)

Demo Videos:
https://github.com/user-attachments/assets/1685c828-e067-45b3-8214-984a366b88bd

[Create Survey Demo](https://drive.google.com/file/d/1VhQq-Zc0hy7rZoKKE9kJqIb3Egf0PkEA/view?usp=sharing)



### 2. Làm Khảo Sát (Take Survey)

Demo Videos:
<img width="2647" height="1571" alt="image" src="https://github.com/user-attachments/assets/cdde6547-7289-4f3c-9d96-68a04a3ec276" />

[Take Survey Demo](https://drive.google.com/file/d/1UqWeAUAIdKeOF3E3z2oB__7Eew90CAsq/view?usp=sharing)

### 3. Luồng Tiền (Money Transaction)

Demo Videos:
<img width="2643" height="1456" alt="image" src="https://github.com/user-attachments/assets/997b8f06-4d6c-4d2d-a5d8-2c773b0edd58" />

[Money Transaction Demo](https://drive.google.com/file/d/1mlBkCB2_cGR6symkBA22dBB0CQ6A87jC/view?usp=sharing)


### 4. Recap Tổng Thể:

[Recap Tổng](https://drive.google.com/file/d/1egEt4B89AuoJHCkXke0ptH7u7RhjpkJD/view?usp=sharing)


---
### 💡 Những bài học thiết kế đáng giá (Lessons Learned)

Trong quá trình xây dựng dự toán này, một số kỹ thuật chuyên sâu và bài học quý báu đã được áp dụng:

1. **Quản lý State thông minh (Smart State Management)**
   - Thay vì lưu mọi thứ vào global state làm giật lag ứng dụng, hệ thống phân tách logic linh hoạt. Trạng thái giao diện và các form dữ liệu được xử lý chặt chẽ theo từng hành vi người dùng, giới hạn được vòng đời re-render và tối ưu tốc độ đáng kể.

2. **Bài học về Optimistic UI và chuyển dịch sang Long Polling Pattern**
   - **Vấn đề**: Ở chức năng nhận thù lao (tiền) sau khi làm khảo sát xong, ban đầu tôi nghĩ tới việc áp dụng **Optimistic UI** (cập nhật số dư ảo lên màn hình trước ngay khi gọi API để tạo cảm giác phản hồi tức thì cho người dùng). 
   - **Thực tế**: Quá trình backend ghi nhận một lượt làm khảo sát, kiểm duyệt, và cộng tiền và đồng bộ trạng thái thanh toán gồm rất nhiều bước. Nếu cập nhật hiển thị lên giao diện sớm trước khi tiến trình DB hoàn tất, trong trường hợp lỗi xảy ra, người dùng sẽ thấy số tiền bị thụt lùi (nhảy về số cũ), gây mất uy tín.
   - **Giải pháp**: Xoay trục thiết kế sang **Long Polling Pattern**. Cho phép Client API liên tục hoặc định kỳ poll thông tin từ hệ thống để xác nhận luồng xử lý từ DB xong hoàn toàn mới bung thông báo & render số dư tới tài khoản người dùng, chấp nhận một chút loading nhưng đảm bảo tính chính xác 100% của Data liên quan tới Tiền.

3. **Thiết kế Component theo hướng Atomic Design**
   - Cây cấu trúc component được thiết kế cực kỳ tỉ mỉ theo cấu trúc nguyên tử (Atoms -> Molecules -> Organisms). Các UI nhỏ (như Text, Button, Input) đều được tách hạt từ sớm, giúp giao diện đồng nhất tuyệt đối và đội ngũ mở rộng form dễ dàng mà không bị trùng lặp Code.
