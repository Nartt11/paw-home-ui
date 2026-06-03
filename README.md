# 🐾 Paw Home - Hệ Thống Hỗ Trợ & Quản Lý Cứu Trợ Thú Cưng

Paw Home là một nền tảng Web hiện đại được thiết kế để kết nối cộng đồng, các tình nguyện viên và các trung tâm cứu hộ động vật. Dự án cung cấp giải pháp toàn diện từ báo cáo các ca cứu hộ khẩn cấp, quản lý quy trình cứu trợ trực quan, hỗ trợ nhận nuôi (adoption) chó mèo cho tới việc quản lý hoạt động nội bộ của các trạm cứu hộ động vật.

Mã nguồn này chứa phần **Frontend (Giao diện người dùng)** của dự án, được xây dựng dựa trên Next.js App Router, React 19, TailwindCSS và shadcn/ui.

---

## 🌟 Tính Năng Chính

### 🌐 Phân Hệ Công Cộng (Public Portal)
*   **Bản Đồ Cứu Trợ Trực Quan (Rescue Map):** Định vị và theo dõi trực quan các ca cứu nạn chó mèo cần giúp đỡ theo thời gian thực trên bản đồ.
*   **Nhận Nuôi (Adoption):** Duyệt danh sách thú cưng cần mái ấm mới, xem thông tin chi tiết và gửi yêu cầu nhận nuôi trực tuyến.
*   **Tin Tức & Hoạt Động (News):** Cập nhật tin tức, câu chuyện cứu hộ thành công và kiến thức chăm sóc thú cưng.
*   **Ủng Hộ (Donation):** Quyên góp tài chính hoặc nhu yếu phẩm hỗ trợ các hoạt động cứu trợ.
*   **Hồ Sơ Cá Nhân (My Profile):** Quản lý thông tin tài khoản, theo dõi trạng thái các đơn nhận nuôi hoặc ca cứu hộ đã gửi.

### 💼 Phân Hệ Quản Trị (Admin & Organization Panel)
*   **Dashboard Thống Kê:** Trực quan hóa số liệu cứu hộ, nhận nuôi, và hoạt động hỗ trợ theo thời gian.
*   **Quản Lý Cứu Trợ (Rescue Management):** Phân công, cập nhật trạng thái và lưu trữ hồ sơ cho từng ca cứu hộ từ khi tiếp nhận đến khi hoàn thành.
*   **Quản Lý Thú Cưng:** Theo dõi thông tin chi tiết của từng bé (tên, tuổi, chủng loại, tình trạng sức khỏe, tiêm phòng).
*   **Quản Lý Nhận Nuôi (Adoption Applications):** Duyệt và xử lý hồ sơ xin nhận nuôi thú cưng từ phía người dùng.
*   **Quản Lý Tổ Chức & Trung Tâm (Shelter Management):** Quản lý thông tin, thành viên và tài nguyên của các trạm cứu hộ liên kết.
*   **Hệ Thống CMS:** Quản lý bài viết tin tức, bài đăng tìm chủ và các banner truyền thông.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

*   **Core:** [Next.js v16 (App Router)](https://nextjs.org/) & [React v19](https://react.dev/)
*   **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling & UI Components:** [TailwindCSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
*   **Quản lý Form & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod Schema](https://zod.dev/)
*   **Quản lý State & API:** [TanStack React Query v5](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
*   **Bản Đồ:** [React Leaflet](https://react-leaflet.js.org/) / [Leaflet](https://leafletjs.com/)
*   **Biểu Đồ:** [Recharts](https://recharts.org/)

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

> [!IMPORTANT]
> Dự án sử dụng quản lý gói **PNPM**. Hãy chắc chắn bạn đã cài đặt PNPM trên máy trước khi bắt đầu. Nếu chưa, cài đặt toàn cục qua npm: `npm install -g pnpm`.

### 1. Clone Source Code
```bash
git clone https://github.com/Nartt11/paw-home-ui.git
cd paw-home-ui
```

### 2. Cài Đặt Dependencies
```bash
pnpm install
```

### 3. Cấu Hình Biến Môi Trường (Environment Variables)
Tạo tệp `.env.local` hoặc cấu hình tệp `.env` tại thư mục gốc của dự án với các thông số sau:

```env
# URL API Backend (Java REST API)
NEXT_PUBLIC_API_URL=########

# Cấu hình tải ảnh lên Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=########
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=#######
```

### 4. Chạy Dự Án Ở Môi Trường Phát Triển
```bash
pnpm dev
```
Sau khi chạy lệnh trên, truy cập **[http://localhost:3000](http://localhost:3000)** trên trình duyệt để kiểm tra kết quả.

### 5. Xây Dựng Bản Production (Build & Start)
Để build và chạy sản phẩm tối ưu hóa:
```bash
# Tạo bản build tối ưu
pnpm build

# Khởi chạy server production
pnpm start
```

### 6. Linter & Format Code
Để kiểm tra lỗi cú pháp và định dạng mã nguồn:
```bash
pnpm lint
```

---

## 📂 Quy Chuẩn Cấu Trúc Thư Mục & Luồng Dữ Liệu

### Cấu Trúc Thư Mục Chính
*   `src/app/`: Các tuyến đường (routes) và bố cục (layouts) của App Router.
*   `src/components/`: Thư viện các component dùng chung và component theo từng trang.
*   `src/services/`: Tầng giao tiếp API (sử dụng duy nhất một cấu hình Axios instance).
*   `src/hooks/`: Các custom hook xử lý React Query (query/mutation).
*   `src/lib/`: Các hàm tiện ích, cấu hình dùng chung.
*   `src/types/`: Khai báo kiểu TypeScript.
*   `docs/`: Tài liệu kỹ thuật dự án (API contract, quy tắc validation, state...).

### 🔁 Luồng Dữ Liệu Bắt Buộc (Strict Data Flow)
Để đảm bảo code clean và dễ bảo trì, mọi tính năng cần tuân thủ nghiêm ngặt luồng dữ liệu:
$$\text{UI (shadcn)} \rightarrow \text{React Hook Form} \rightarrow \text{Zod Validation} \rightarrow \text{React Query (Query/Mutation)} \rightarrow \text{Axios (Services)} \rightarrow \text{Backend API}$$

> [!WARNING]
> *   Không gọi trực tiếp `fetch()` hay API Axios bên trong component UI. Mọi API call phải đi qua thư mục `services/`.
> *   Không tự validate dữ liệu thủ công, luôn sử dụng Zod schema đi kèm với `zodResolver`.
