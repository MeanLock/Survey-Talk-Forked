// export const _loginNav = (
//   isAdmin: number
// ): {
//   label: string;
//   isDropDown: boolean;
//   paths: [{ title: ""; path: "" }];
// }[] => {
//   const roleNav = [
//     // Customer
//     // CÁC NAV-ITEMS ĐÃ ĐĂNG NHẬP Ở ĐÂY

//   ];

//   return roleNav;
// };

export const _loginNav: {
  label: string;
  isDropDown: boolean;
  paths: { title: string; path: string }[];
}[] = [
  {
    label: "Trang chủ",
    isDropDown: false,
    paths: [{ title: "", path: "/home" }],
  },
  {
    label: "Về chúng tôi",
    isDropDown: false,
    paths: [{ title: "", path: "/about-us" }],
  },
  {
    label: "Khảo sát",
    isDropDown: true,
    paths: [
      { title: "Tạo Khảo Sát", path: "/survey/create" },
      { title: "Danh Sách Khảo Sát", path: "/available-surveys" },
    ],
  },
  {
    label: "Data Markets",
    isDropDown: false,
    paths: [{ title: "", path: "/data-market" }],
  },
  {
    label: "Quản Lý",
    isDropDown: true,
    paths: [
      { title: "Quản Lý Điểm", path: "/manage/points" },
      { title: "Quản Lý Khảo Sát", path: "manage/surveys" },
      { title: "Quản Lý Data Market", path: "manage/data-market" },
    ],
  },
];

export const _nonLoginNav: {
  label: string;
  isDropDown: boolean;
  paths: { title: string; path: string }[];
}[] = [
  {
    label: "Trang chủ",
    isDropDown: false,
    paths: [{ title: "", path: "/home" }],
  },
  {
    label: "Về chúng tôi",
    isDropDown: false,
    paths: [{ title: "", path: "/about-us" }],
  },
];

export const _footerNav: {
  label: string;
  path: string;
}[] = [
  {
    label: "Điều khoản",
    path: "/clause",
  },
  {
    label: "Quyền Riêng Tư",
    path: "/privacy",
  },
  {
    label: "Cookies",
    path: "cookies",
  },
];
