export const APP_ROUTES = {
  HOME: "/",
  MAP: "/ban-do",
  ADOPTION: "/nhan-nuoi",
  adoptionDetail: (petId: string) => `/nhan-nuoi/${petId}`,
  NEWS: "/tin-tuc",
  DONATION: "/ung-ho",
  ABOUT_US: "/ve-chung-toi",

  LOGIN: "/dang-nhap",
  SIGNUP: "/dang-ki",
  PROFILE: "/trang-ca-nhan",

  // admin
  DASHBOARD: "/dashboard",
  ADOPTION_MANAGEMENT: "/quan-ly-nhan-nuoi",
  PET_MANAGEMENT: "/quan-ly-thu-cung",
  RESCUE_CASE_MANAGEMENT: "/quan-ly-cuu-tro",
  CENTER_MANAGEMENT: "/quan-ly-trung-tam",
  BANNER_MANAGEMENT: "/quan-ly-banner",
  POST_MANAGEMENT: "/quan-ly-bai-dang",
  USER_MANAGEMENT: "/quan-ly-nguoi-dung",
  NEWS_MANAGEMENT: "/quan-ly-tin-tuc",
};
