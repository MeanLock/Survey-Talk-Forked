import React from 'react'

//Admin
const Dashboard = React.lazy(() => import('./views/role-views/admin/dashboard-view/index'))
const Customer_View = React.lazy(() => import('./views/role-views/admin/customer-view/index'))
const Manager_View = React.lazy(() => import('./views/role-views/admin/manager-view/index'))
const Level_View = React.lazy(() => import('./views/role-views/admin/level-view/index'))

//Manager
const Community_Survey_View = React.lazy(() => import('./views/role-views/manager/community-survey-view/index'))
const Community_Survey_Detail_View = React.lazy(() => import('./views/role-views/manager/community-survey-detail-view/index'))
const Data_Market_View = React.lazy(() => import('./views/role-views/manager/data-market-view/index'))
const Data_Market_Detail_View = React.lazy(() => import('./views/role-views/manager/data-market-detail-view/index'))
const Filter_Survey_View = React.lazy(() => import('./views/role-views/manager/filter-survey-view/index'))
const Filter_Survey_Detail_View = React.lazy(() => import('./views/role-views/manager/filter-survey-detail-view/index'))
const Transaction_View = React.lazy(() => import('./views/role-views/manager/transaction-view/index'))


// ==================== Routes ====================

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, role_id: [1] },
  { path: '/managers/table', name: 'Người Quản Lý', element: Manager_View, role_id: [1] },
  { path: '/customers/table', name: 'Người Dùng', element: Customer_View, role_id: [1] },
  { path: '/level-management', name: 'Cấp Độ', element: Level_View, role_id: [1] },
  
  { path: '/community-survey', name: 'Khảo Sát', element: Community_Survey_View, role_id: [2] },
  { path: '/community-survey/detail/:id', name: 'Chi Tiết', element: Community_Survey_Detail_View, role_id: [2], parent: '/community-survey' },
  { path: '/data-market', name: 'Data Market', element: Data_Market_View, role_id: [2] },
  { path: '/data-market/detail/:id', name: 'Chi Tiết', element: Data_Market_Detail_View, role_id: [2], parent: '/data-market' },
  { path: '/filter-survey/table', name: 'Khảo Sát Lọc', element: Filter_Survey_View, role_id: [2] },
  { path: '/filter-survey/detail/:id', name: 'Chi Tiết', element: Filter_Survey_Detail_View, role_id: [2], parent: '/filter-survey/table' },
  { path: '/transactions/table', name: 'Giao Dịch', element: Transaction_View, role_id: [2] },


  // { path: '/theme', name: 'Theme', element: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', element: Colors },
  // { path: '/theme/typography', name: 'Typography', element: Typography },
  // { path: '/base', name: 'Base', element: Cards, exact: true },
  // { path: '/base/accordion', name: 'Accordion', element: Accordion },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', element: Cards },
  // { path: '/base/carousels', name: 'Carousel', element: Carousels },
  // { path: '/base/collapses', name: 'Collapse', element: Collapses },
  // { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  // { path: '/base/navs', name: 'Navs', element: Navs },
  // { path: '/base/paginations', name: 'Paginations', element: Paginations },
  // { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  // { path: '/base/popovers', name: 'Popovers', element: Popovers },
  // { path: '/base/progress', name: 'Progress', element: Progress },
  // { path: '/base/spinners', name: 'Spinners', element: Spinners },
  // { path: '/base/tabs', name: 'Tabs', element: Tabs },
  // { path: '/base/tables', name: 'Tables', element: Tables },
  // { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  // { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  // { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  // { path: '/charts', name: 'Charts', element: Charts },
  // { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  // { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  // { path: '/forms/select', name: 'Select', element: Select },
  // { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  // { path: '/forms/range', name: 'Range', element: Range },
  // { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  // { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  // { path: '/forms/layout', name: 'Layout', element: Layout },
  // { path: '/forms/validation', name: 'Validation', element: Validation },
  // { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', element: Flags },
  // { path: '/icons/brands', name: 'Brands', element: Brands },
  // { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  // { path: '/notifications/badges', name: 'Badges', element: Badges },
  // { path: '/notifications/modals', name: 'Modals', element: Modals },
  // { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  // { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
