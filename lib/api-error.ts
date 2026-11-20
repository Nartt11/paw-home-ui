import { HttpError } from "@/lib/http";

/** Vietnamese text for the business errors people meet in the rescue and adoption flows. */
const ERROR_TEXT: Record<string, string> = {
  RESCUE_CASE_ALREADY_HELD: "Ca này đã có tổ chức khác nhận.",
  RESCUE_CASE_TAKEN: "Ca này vừa được tổ chức khác nhận.",
  RESCUE_CASE_CLOSED: "Ca đã đóng.",
  RESCUE_CASE_NOT_OPEN: "Ca không còn mở để nhận.",
  RESCUE_CASE_NOT_CLAIMED: "Trung tâm cần nhận ca này trước khi tiếp nhận bé.",
  RESCUE_CASE_NOT_RESCUED: "Chỉ tiếp nhận được khi ca đã được xác nhận là đã cứu.",
  RESCUE_CASE_HAS_PET: "Ca này đã có hồ sơ thú.",
  RESCUE_CASE_NOT_KEPT: "Chỉ người cứu đã chọn tự nuôi bé mới thêm được vào thú của mình.",
  RESCUE_CLAIM_LIMIT: "Bạn đang giúp tối đa 2 ca. Hãy hoàn tất hoặc trả bớt một ca trước.",
  RESCUE_CLAIM_NOT_EXPIRING: "Ca của tổ chức không có hạn nên không cần gia hạn.",
  RESCUE_CLAIM_NOT_FOUND: "Bạn không còn nhận ca này.",
  RESCUE_SAFETY_NOT_ACKNOWLEDGED: "Hãy đọc và đánh dấu đã đọc lưu ý an toàn.",
  RESCUE_CLOSE_REASON_REQUIRED: "Hãy cho biết lý do đóng ca.",
  RESCUE_COMPLETION_EXISTS: "Ca này đã có báo cáo hoàn tất đang chờ xác nhận.",
  RESCUE_COMPLETION_PENDING: "Ca này đã có báo cáo hoàn tất đang chờ xác nhận.",
  RESCUE_COMPLETION_NOT_PENDING: "Báo cáo này đã được xử lý.",
  RESCUE_COMPLETED: "Ca đã hoàn tất.",
  RESCUE_TIME_INVALID: "Thời gian cứu không thể ở tương lai.",
  ADOPTION_SPAM_LIMIT: "Bạn đang có 2 đơn chờ duyệt. Hãy chờ kết quả trước khi nộp thêm.",
  PET_NOT_AVAILABLE: "Bé không còn sẵn sàng nhận nuôi.",
};

const STATUS_TEXT: Record<number, string> = {
  401: "Bạn cần đăng nhập để làm việc này.",
  403: "Bạn không có quyền làm việc này.",
  404: "Không tìm thấy dữ liệu, có thể đã bị xoá.",
};

/** A message fit to show the user, in Vietnamese where the error is known. */
export function apiErrorMessage(error: unknown, fallback = "Có lỗi xảy ra, vui lòng thử lại.") {
  if (error instanceof HttpError) {
    if (error.errorCode && ERROR_TEXT[error.errorCode]) return ERROR_TEXT[error.errorCode];
    if (error.status && STATUS_TEXT[error.status]) return STATUS_TEXT[error.status];
    return error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
