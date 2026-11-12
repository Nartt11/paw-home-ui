# Báo cáo tiến độ – Paw Home Web (Dashboard quản trị + Landing page)

> Ngày lập: 12/11/2026 · Cập nhật: 12/11/2026 (đã chốt phạm vi với nhóm; thêm trang Cộng đồng từ PR #11 `feature/community-feed`)
> Phạm vi: `paw-home-ui` (Next.js) đối chiếu với `pet-rescue-api` (Spring Boot) và tài liệu yêu cầu `docs/Project Documents` (SRS v1.0, Vision & Scope v1.0).
> **Nguồn chuẩn: source code BE** (`pet-rescue-api/src`). Khi tài liệu SRS/Vision lệch với code BE, lấy code BE.

---

## Cập nhật – nhánh `feat/align-ui-with-backend`

Các mục §3–§5 bên dưới là hiện trạng **trước** nhánh này. Nhánh đã làm xong:

**Dashboard admin – tính năng mới (dùng API BE có sẵn)**

| Màn hình | Endpoint |
|---|---|
| `/quan-ly-vai-tro` Vai trò & quyền | `GET/POST /roles`, `DELETE /roles/{id}` |
| `/quan-ly-the` Quản lý thẻ | `GET/POST /tags`, `DELETE /tags/{id}` |
| `/cau-hinh-ai` Cấu hình AI (đổi/đặt lại model, độ chính xác theo prompt) | `/admin/ai/post-analysis/model`, `/metrics` |
| Chuông thông báo trên header admin | `/notifications`, `/unread-count`, `/{id}/read`, `/read-all` |
| Quản lý cứu trợ: từ chối hồ sơ hoàn tất (kèm lý do), bộ lọc "Cần admin xử lý" (khiếu nại / quá hạn), lịch sử nhận ca, kết quả cứu hộ | `/completions/{id}/reject`, `/completions/review-queue`, `/rescue-cases/{id}/claims` |
| Chi tiết bài đăng: phân tích AI (chỉ xem – xác nhận là quyền của tác giả) + xóa bình luận | `GET /posts/{id}/analysis`, `DELETE /comments/{id}` |
| Quản lý trung tâm: tạo tài khoản cho trạm (OWNER/STAFF/MEMBER/VET) | `POST /admin/organizations/{id}/accounts` |
| Chi tiết thú cưng: đặc điểm & tính cách (đầu vào cho ghép đôi) | `GET/PUT /pets/{id}/traits` |
| Duyệt đơn nhận nuôi: độ phù hợp (mức, điểm, lý do, cảnh báo, cần chuẩn bị) | `AdoptionResponseDto.match` |
| Quản lý nhận nuôi: lịch sử đòi lại thú | `GET /adoptions/reclaims` |
| Chi tiết người dùng: điểm uy tín | `GET /users/{id}/reputation` |

**Sửa lỗi lệch với BE**

| Lỗi | Hậu quả trước khi sửa |
|---|---|
| Hết hạn token chỉ xóa token; `auth.refresh` gửi body rỗng | Admin bị đăng xuất giữa chừng → nay tự refresh và thử lại 1 lần |
| Trạng thái đơn `CANCELLED` (BE: `CANCELED`), thiếu `COMPLETED` | Đơn đã hủy / hoàn tất hiện sai, lọt khỏi bộ lọc |
| Trạng thái thú `UNOWNED/PENDING/FOSTERED/UNAVAILABLE` (BE: `FOSTERING/AVAILABLE/ADOPTED/LOST/DECEASED`) | Badge, dropdown trạng thái, KPI "Chờ nhận nuôi" sai với mọi thú |
| Vai trò hệ thống `MEMBERSHIP` (BE trả `MEMBER`) | Nhân viên trạm bị coi như admin ở trang cứu trợ / nhận nuôi / thú cưng (không lọc theo trạm) |
| Mảng query gửi dạng `status[]=X` | Spring bỏ qua → bộ lọc trạng thái thú bị vô hiệu |
| Thiếu trạng thái tổ chức `REJECTED` | Hiện mã thô |

**Khác:** ẩn link "Tin tức"; bỏ 3 mục sidebar trỏ `#`; trang chủ hiện số liệu thật (ca đã cứu, ca nhận nuôi, trạm đang hoạt động) từ API công khai.

**§3.5 (trang Cộng đồng) – đã rõ:** cả 3 điểm C1–C3 đã có ở nhánh BE `feature/case-post-link` (chưa merge vào `master`). FE không cần sửa; **cần merge nhánh BE đó**.

**Còn lại**
- Nhật ký kiểm toán: **chờ BE** bật `app.audit.enabled` và thêm `GET /admin/audit-logs` (§3.4).
- Gán vai trò cho user có sẵn (`POST /admin/organizations/{id}/members`) và tạo thú cho user (`/admin/organizations/{id}/pets`): chưa làm, cần ô tìm người dùng.
- Hàng đợi cứu hộ của trạm (`/organizations/me/rescue-queue`), intake / keep-pet: chưa làm (luồng của trạm, không phải admin).
- Hồ sơ người nhận nuôi trên `/ho-so-cua-toi`, điểm phù hợp trên `/nhan-nuoi/[petId]`: chưa làm (landing).
- 18 lỗi lint có sẵn từ `main` (React Compiler / setState trong effect) chưa xử lý.

---

## 0. Quyết định phạm vi đã chốt

| Câu hỏi | Quyết định | Hệ quả cho Web |
|---|---|---|
| Quyên góp | **Chỉ có UI**, không làm thật | Giữ `/ung-ho` dạng giao diện mẫu, ghi vào mục "Giới hạn" của báo cáo đồ án |
| Tin tức | BE không có nguồn tin tức → **ẩn tạm** | `PostCategory` chỉ có `RESCUE, ADOPTION, LOST, FOUND, GENERAL`, không lọc được "tin tức". Đã comment link "Tin tức" ở header (`NavLinks.tsx`) và footer (`Footer.tsx`). `/quan-ly-bai-viet` không có trong sidebar |
| Chat / kết bạn | **Chỉ trên Mobile** | Web bỏ qua `/chats/*`, `/friends/*`, WebSocket. Riêng **bảng tin cộng đồng đã có trên Web** (`/cong-dong`) |
| API thống kê công khai cho trang chủ | **BE không có** (xem §3.4) | Trang chủ chỉ dùng được các API GET công khai sẵn có |
| Nhật ký kiểm toán | **Có trong phạm vi** | BE mới có phần ghi log, chưa có API đọc (xem §3.4) → cần BE bổ sung |
| Trọng tâm | **Dashboard của ADMIN (toàn quyền)** | Landing page chỉ là phần làm thêm |

---

## 1. Tóm tắt

| Hạng mục | Tình trạng |
|---|---|
| Trang dashboard admin | 11 trang, **10 dùng API thật**; 1 trang trùng (`/quan-ly-bai-viet`) |
| Nhóm API admin trong BE (`/api/v1/admin/**`) đã được Web dùng | Dashboard ✅, tạo tài khoản ✅, khóa/mở khóa ✅; **3 endpoint theo tổ chức + toàn bộ cấu hình AI chưa dùng** |
| Use case SRS (UC-01 → UC-20) trên Web | 15 đầy đủ, 2 một phần (UC-14, 20). UC-18, 19 chuyển sang Mobile |
| Landing page | 9 trang (thêm `/cong-dong`, `/cong-dong/[postId]`), trong đó trang chủ, về chúng tôi, ủng hộ còn dữ liệu tĩnh (ủng hộ: chấp nhận) |
| FE gọi thứ BE **chưa có** | **3 chỗ** trong trang Cộng đồng (xem §3.5) |

BE đã đi trước Web khá xa: claim ca cứu hộ, ghép đôi nhận nuôi, phân tích bài đăng bằng AI, thông báo, đòi lại thú **đã có API nhưng Web chưa dùng**.

---

## 2. Phần ĐÃ LÀM

### 2.1. Dashboard quản trị – `app/(admin)`

| Route | Chức năng | API BE |
|---|---|---|
| `/dashboard` | Tổng quan, xu hướng nhận nuôi, tóm tắt cứu hộ, top tổ chức, việc chờ xử lý | `/admin/dashboard/*` (5/5) |
| `/quan-ly-nguoi-dung` | Danh sách, tạo tài khoản, khóa / mở khóa | `/users`, `/admin/accounts`, `/admin/users/{id}/lock\|unlock` |
| `/quan-ly-trung-tam` | CRUD tổ chức, đổi trạng thái (duyệt) | `/organizations/*` |
| `/organization/members` | Thành viên & vai trò tổ chức | `/organizations/{id}/members` |
| `/quan-ly-thu-cung`, `/[petId]` | CRUD thú cưng, trạng thái, hồ sơ y tế, media, lịch sử sở hữu, chuyển quyền | `/pets/*` |
| `/quan-ly-nhan-nuoi` | Duyệt / từ chối / hủy / hoàn tất đơn | `/adoptions/*` |
| `/quan-ly-cuu-tro` | Ca cứu hộ theo bản đồ, đổi trạng thái, gửi & duyệt hồ sơ hoàn tất | `/rescue-cases/*` (một phần) |
| `/quan-ly-banner` | CRUD, bật/tắt, sắp xếp banner | `/banners/*` |
| `/quan-ly-bai-dang` | CRUD bài đăng, gắn thẻ | `/posts/*` |
| `/trang-ca-nhan` | Xem / cập nhật hồ sơ cá nhân | `/users/me/profile` |

Hạ tầng FE: một Axios instance (`lib/http.ts`), React Query + query keys, RHF + Zod (`lib/schemas`), `RequireAuth` phân quyền theo vai trò hệ thống và vai trò tổ chức, upload ảnh qua `/media/upload/temp`.

### 2.2. Landing page – `app/(public)`, `app/(auth)`

| Route | Chức năng | Dữ liệu |
|---|---|---|
| `/dang-nhap`, `/dang-ki`, `/xac-thuc-email`, `/quen-mat-khau`, `/dat-lai-mat-khau` | Xác thực tài khoản | API thật |
| `/ban-do` | Bản đồ ca cứu hộ + tổ chức, báo cáo ca cứu hộ (thêm tùy chọn "Đăng lên cộng đồng") | API thật |
| `/cong-dong` | **Mới.** Bảng tin phân trang theo con trỏ, tab lọc, khối "ca cứu hộ đang mở" gần tôi, soạn bài (tối đa 10 ảnh, gắn ca cứu hộ qua bộ chọn), thích, bình luận 2 cấp, chia sẻ link | API thật (`/posts/feed`, `/posts`, `/posts/{id}/like`, `/posts/{id}/comments`, `/comments/{id}/replies`, `/rescue-cases`, `/users/me/rescue-claims`) – có lỗi, xem §3.5 |
| `/cong-dong/[postId]` | **Mới.** Chi tiết một bài đăng (link chia sẻ) | API thật |
| `/nhan-nuoi`, `/nhan-nuoi/[petId]` | Duyệt thú cưng, gửi đơn nhận nuôi | API thật |
| `/ho-so-cua-toi` | Hồ sơ, đơn nhận nuôi, tổ chức của tôi | API thật |
| `/` | Hero, thống kê, bản đồ rút gọn, banner | Chỉ banner là API thật |
| `/ve-chung-toi` | Giới thiệu | Tĩnh (chấp nhận) |
| `/ung-ho` | Luồng quyên góp | Chỉ UI (đã chốt) |
| `/tin-tuc` | — | Đã ẩn khỏi menu |

### 2.3. Đối chiếu Use Case SRS

| UC | Tên | Web |
|---|---|---|
| UC-01..05 | Đăng ký, xác thực email, đăng nhập, refresh/đăng xuất, quên mật khẩu | ✅ (refresh token chưa tự động – xem §4) |
| UC-06 | Cập nhật hồ sơ cá nhân | ✅ |
| UC-07..10 | Thú cưng | ✅ |
| UC-11, 12 | Gửi & xử lý đơn nhận nuôi | ✅ |
| UC-13 | Báo cáo ca cứu hộ | ✅ |
| UC-14 | Cập nhật, hoàn tất & duyệt ca cứu hộ | 🟡 thiếu claim / intake / từ chối / khiếu nại / hàng đợi duyệt |
| UC-15, 16 | Tổ chức & thành viên | ✅ |
| UC-17 | Đăng bài, bình luận & thích | ✅ phía người dùng (`/cong-dong`); admin có CRUD bài đăng nhưng chưa kiểm duyệt bình luận |
| UC-18, 19 | Kết bạn, nhắn tin | ➖ chỉ làm trên Mobile |
| UC-20 | Quản trị hệ thống & banner | 🟡 thiếu vai trò (RBAC), thẻ, cấu hình AI, nhật ký kiểm toán |

---

## 3. Phần CHƯA LÀM

### 3.1. Dashboard admin – API BE đã có, Web chưa dùng (ưu tiên)

| Nhóm | Endpoint BE | Màn hình cần làm |
|---|---|---|
| **Quản trị theo tổ chức** | `POST /admin/organizations/{orgId}/accounts`, `/members`, `/pets` | Trong chi tiết tổ chức: tạo tài khoản cho trạm, gán thành viên, tạo thú cho trạm |
| **Vai trò (RBAC)** | `GET/POST /roles`, `GET/DELETE /roles/{id}` | Trang Vai trò & quyền (service `services/role` đã có, chưa có trang) |
| **Thẻ** | `GET/POST /tags`, `DELETE /tags/{id}` | Trang Quản lý thẻ |
| **Cấu hình AI** | `GET /admin/ai/post-analysis/metrics`, `GET/PUT/DELETE /admin/ai/post-analysis/model` | Trang số liệu phân tích AI + chọn model |
| **Phân tích bài đăng AI** | `GET /posts/{id}/analysis`, `PATCH .../confirm`, `POST .../reject`, `.../retry` | Tab "Phân tích AI" trong chi tiết bài đăng |
| **Bình luận** | `DELETE /comments/{id}` | Kiểm duyệt bình luận trong chi tiết bài đăng admin – tái dùng `components/community/CommentSection.tsx`, chỉ thêm nút xóa |
| **Claim ca cứu hộ** | `GET /rescue-cases/{id}/claims`, `POST /{id}/claim`, `/claim/extend`, `/claim/release`, `/{id}/intake`, `/{id}/keep-pet`, `GET /organizations/me/rescue-queue` | Lịch sử claim trên chi tiết ca; hàng đợi cứu hộ của trạm (`/users/me/rescue-claims` đã dùng trong bộ chọn ca của trang Cộng đồng) |
| **Hồ sơ hoàn tất cứu hộ** | `POST /completions/{id}/reject`, `/confirm`, `/dispute`, `GET /completions/review-queue` | Hàng đợi duyệt hồ sơ hoàn tất cho admin |
| **Ghép đôi nhận nuôi** | `GET/PUT /pets/{petId}/traits`, `GET /pets/{petId}/match` | Form đặc điểm thú; điểm tương thích trong màn duyệt đơn |
| **Đòi lại thú** | `GET /adoptions/reclaims`, `GET /adoptions/organization/{orgId}` | Tab "Yêu cầu đòi lại" + lọc đơn theo tổ chức |
| **Thông báo** | `GET /notifications`, `/unread-count`, `PATCH /{id}/read`, `/read-all` | Chuông thông báo ở header admin |
| **Uy tín người dùng** | `GET /users/{id}/reputation` (hook `useUserReputation` có, chưa dùng) | Hiển thị trong chi tiết người dùng |

### 3.2. Landing page (làm thêm)

| Route | Vấn đề |
|---|---|
| `/` | Thống kê, bản đồ rút gọn, "cách hoạt động" lấy từ `data.json`; `FeaturedPetsSection` có nhưng không được render |
| `/ho-so-cua-toi` | Chưa có hồ sơ người nhận nuôi (`/users/me/adopter-profile`), ca tôi đang xử lý (hook `getMyRescueClaims` đã có, chỉ cần hiển thị) |
| `/nhan-nuoi/[petId]` | Chưa hiện điểm tương thích (`/pets/{petId}/match`) |

### 3.3. Ngoài phạm vi Web (đã chốt)
- Quyên góp: chỉ UI, ghi vào "Giới hạn".
- Tin tức: ẩn cho đến khi BE có nguồn dữ liệu.
- Chat, kết bạn, bảng tin cộng đồng: làm trên Mobile.

### 3.4. Kết quả kiểm tra BE

**API thống kê công khai: không có.** `SecurityConfig` chỉ mở công khai: `/auth/*`, `GET /pets/**`, `GET /rescue-cases/**`, `GET /banners/active`, `/organizations/map/**`. Toàn bộ `/admin/dashboard/*` yêu cầu `ROLE_ADMIN`.
→ Trang chủ có thể tự tính số liệu từ API công khai: lấy `totalElements` của `GET /pets?pageSize=1` (lọc theo trạng thái) và `GET /rescue-cases?pageSize=1`, số marker từ `/organizations/map/markers`. Không cần BE sửa.

**Nhật ký kiểm toán: BE chỉ có phần ghi, chưa có API đọc.**
- Có sẵn: bảng `audit_logs` (V1 migration), entity `AuditLog`, `AuditLogDomainService.log(...)`, `AuditLogAspect` tự ghi khi gọi `create* / update* / delete*` của domain service.
- Thiếu:
  1. `AuditLogAspect` **mặc định tắt** (`@ConditionalOnProperty app.audit.enabled=true`, chưa có trong file cấu hình nào) → hiện **không có log nào được ghi**.
  2. `AuditLogRepository` chỉ có `save`, **không có controller/endpoint đọc**.
  3. Aspect truyền `null` cho `old_value` / `new_value` → log không có dữ liệu trước/sau khi thay đổi.
- **Cần BE làm**: bật `app.audit.enabled=true`; thêm `GET /api/v1/admin/audit-logs` (phân trang, lọc theo `entityType`, `entityId`, `actorId`, `action`, khoảng thời gian), trả kèm tên người thực hiện. FE không được tự đoán response (AGENTS.md) nên **phải chờ contract**.

### 3.5. Trang Cộng đồng gọi thứ BE chưa có

Đối chiếu với nhánh `main` của `pet-rescue-api` (commit `7cf97be`). `docs/API_CONTRACT.md` mới mô tả các điểm dưới đây nhưng **source BE chưa hiện thực**:

| # | FE dùng | Thực tế trong BE | Hậu quả |
|---|---|---|---|
| C1 | `GET /posts/feed`, `GET /posts/{id}` được ghi là **public**; link chia sẻ `/cong-dong/{postId}` "mở được cho khách" | `SecurityConfig` không `permitAll` cho `/api/v1/posts/**` hay `/comments/**` → rơi vào `anyRequest().authenticated()` | Khách chưa đăng nhập nhận **401**: bảng tin trống, link chia sẻ không mở được |
| C2 | `GET /users/me/rescue-cases` (bộ chọn ca: "ca tôi đã báo cáo") | `UserController` **không có** endpoint này (chỉ có `/me/rescue-claims`, `/me/pets`) | Tab "ca tôi đã báo cáo" luôn lỗi 404 |
| C3 | `shareAsPost` + lời nhắn khi tạo ca cứu hộ (`RescueCaseCreate.tsx:79`, mặc định bật) | Không DTO nào trong BE có `shareAsPost` → Jackson bỏ qua | Báo cáo ca **không tự đăng lên cộng đồng** dù người dùng tích chọn |

→ Hoặc nhánh BE tương ứng chưa được merge, hoặc FE đã làm trước. **Cần xác nhận với BE.** Nếu BE chưa làm: mở GET `/posts/**` + `/comments/**` trong `SecurityConfig`, thêm `GET /users/me/rescue-cases`, xử lý `shareAsPost` trong `RescueCaseCommandUseCase`. Nếu BE không làm: ẩn tab C2 và ô C3 trên FE.

---

## 4. Vấn đề kỹ thuật tồn đọng trên Web

| # | Vấn đề | Vị trí | Mức độ |
|---|---|---|---|
| T1 | Gặp 401 chỉ xóa token, **không gọi `/auth/refresh` rồi thử lại** → admin bị đá ra khi token hết hạn | `lib/http.ts:127` | Cao |
| T2 | Token lưu `localStorage` (rủi ro XSS) | `lib/http.ts:58-79` | Trung bình – chấp nhận cho đồ án, ghi vào báo cáo |
| T3 | File trùng, sai tên `types/organization.type,.ts` | `types/` | Thấp |
| T4 | Hai lớp service song song: `services/x.ts` và `services/x/x.ts` | `services/` | Thấp |
| T5 | `docs/API_CONTRACT.md` đã bổ sung phần Cộng đồng (PR #11) nhưng: phần Auth vẫn lệch BE, thiếu các nhóm còn lại, và **mô tả 3 điểm BE chưa có** (§3.5) | `docs/` | Trung bình |
| T6 | `/quan-ly-bai-viet` chỉ re-export `/quan-ly-bai-dang`, không được link ở đâu | `app/(admin)/quan-ly-bai-viet` | Thấp – xóa |
| T7 | Sidebar còn mục "Settings / Get Help / Search" trỏ `#` | `components/app-sidebar.tsx:120-131` | Thấp |

---

## 5. Kế hoạch tiếp theo (trọng tâm: Dashboard ADMIN)

### Giai đoạn 1 – Nền tảng (≈ 2 ngày)
- [ ] **Chốt §3.5 với BE** (C1–C3) – ưu tiên cao nhất vì trang Cộng đồng đang lỗi với khách.
- [x] Comment lại link "Tin tức" ở header/footer (theo quyết định đã chốt).
- [ ] T1: interceptor tự refresh token khi 401 (hàng đợi request, thử lại 1 lần, thất bại → logout).
- [ ] T3, T4, T6, T7: dọn file trùng, gộp service, xóa route và mục sidebar thừa.
- [ ] T5: cập nhật `docs/API_CONTRACT.md` theo controller BE.

### Giai đoạn 2 – Quản trị hệ thống (≈ 4 ngày)
- [ ] Trang **Vai trò & quyền** (`/roles`).
- [ ] Trang **Quản lý thẻ** (`/tags`).
- [ ] Chi tiết tổ chức: **tạo tài khoản cho trạm, gán thành viên, tạo thú cho trạm** (`/admin/organizations/{id}/*`).
- [ ] Chi tiết người dùng: điểm uy tín.
- [ ] Chuông **thông báo** ở header admin.

### Giai đoạn 3 – Quy trình cứu hộ đầy đủ (≈ 4 ngày)
- [ ] Chi tiết ca: lịch sử claim, intake / keep-pet.
- [ ] **Hàng đợi duyệt hồ sơ hoàn tất**: duyệt / từ chối / xem khiếu nại.
- [ ] Hàng đợi cứu hộ của trạm (`/organizations/me/rescue-queue`) cho vai trò tổ chức.

### Giai đoạn 4 – Nội dung & AI (≈ 3 ngày)
- [ ] Chi tiết bài đăng admin: tab **Phân tích AI** (xác nhận / từ chối / chạy lại) + **kiểm duyệt bình luận** (tái dùng `CommentSection`, thêm nút xóa).
- [ ] Trang **Cấu hình AI**: số liệu + chọn model.

### Giai đoạn 5 – Nhận nuôi nâng cao (≈ 3 ngày)
- [ ] Form **đặc điểm thú (traits)** trong `/quan-ly-thu-cung/[petId]`.
- [ ] **Điểm tương thích + lý do** trong màn duyệt đơn.
- [ ] Tab **Yêu cầu đòi lại** + lọc đơn theo tổ chức.

### Giai đoạn 6 – Nhật ký kiểm toán (≈ 2 ngày, **chờ BE**)
- [ ] BE: bật aspect + thêm `GET /admin/audit-logs` (xem §3.4).
- [ ] FE: trang **Nhật ký hệ thống** (bảng phân trang, lọc theo đối tượng / người thực hiện / hành động / thời gian).

### Giai đoạn 7 – Landing page (làm thêm, ≈ 2 ngày)
- [ ] Trang chủ: số liệu tính từ API công khai, bật `FeaturedPetsSection`, bản đồ rút gọn dùng marker thật.
- [ ] `/ho-so-cua-toi`: hồ sơ người nhận nuôi, ca tôi đang xử lý.
- [ ] `/nhan-nuoi/[petId]`: điểm tương thích.

**Tổng ước lượng: ≈ 20 ngày công.** Việc phụ thuộc BE: API đọc nhật ký kiểm toán (Giai đoạn 6) và 3 điểm của trang Cộng đồng (§3.5) → nên gửi yêu cầu cho BE ngay để làm song song.
