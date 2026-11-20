export const APP_ROUTES = {
  HOME: "/",
  MAP: "/ban-do",
  COMMUNITY: "/cong-dong",
  communityPost: (postId: string) => `/cong-dong/${postId}`,
  ADOPTION: "/nhan-nuoi",
  adoptionDetail: (petId: string) => `/nhan-nuoi/${petId}`,
  NEWS: "/tin-tuc",
  DONATION: "/ung-ho",
  ABOUT_US: "/ve-chung-toi",
  USER_SETTING: "/ho-so-cua-toi",
  /** Cases I reported and cases I am helping with. */
  /** My adoption requests, inside the profile page. */
  MY_ADOPTIONS: "/ho-so-cua-toi?tab=adoptions",
  MY_CASES: "/ca-cua-toi",
  /** Pets I own: adopted, rescued and kept, or added myself. */
  MY_PETS: "/thu-cua-toi",
  /** The check-in form behind the link emailed after an adoption. */
  FOLLOWUP: "/hoi-tham",
  LOGIN: "/dang-nhap",
  SIGNUP: "/dang-ki",
  PROFILE: "/trang-ca-nhan",

  // admin
  DASHBOARD: "/dashboard",
  ADOPTION_MANAGEMENT: "/quan-ly-nhan-nuoi",
  PET_MANAGEMENT: "/quan-ly-thu-cung",
  ORGANIZATION_MEMBER_MANAGEMENT: "/organization/members",
  RESCUE_CASE_MANAGEMENT: "/quan-ly-cuu-tro",
  CENTER_MANAGEMENT: "/quan-ly-trung-tam",
  BANNER_MANAGEMENT: "/quan-ly-banner",
  POST_MANAGEMENT: "/quan-ly-bai-dang",
  USER_MANAGEMENT: "/quan-ly-nguoi-dung",
  RESCUE_QUEUE: "/hang-cho-cuu-ho",
  FOLLOWUP_ALERTS: "/viec-sau-nhan-nuoi",
  ROLE_MANAGEMENT: "/quan-ly-vai-tro",
  TAG_MANAGEMENT: "/quan-ly-the",
  AI_SETTINGS: "/cau-hinh-ai",
};
