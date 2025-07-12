import React from 'react'



// ==================== CoreUI Components ====================
// const Dashboard = React.lazy(() => import('./views/coreui-views/dashboard/Dashboard'))

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




const Colors = React.lazy(() => import('./views/coreui-views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/coreui-views/theme/typography/Typography'))

// -------- Base --------
const Accordion = React.lazy(() => import('./views/coreui-views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/coreui-views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/coreui-views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/coreui-views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/coreui-views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/coreui-views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/coreui-views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/coreui-views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/coreui-views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/coreui-views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/coreui-views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/coreui-views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/coreui-views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/coreui-views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/coreui-views/base/tooltips/Tooltips'))

// -------- Buttons --------
const Buttons = React.lazy(() => import('./views/coreui-views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/coreui-views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/coreui-views/buttons/dropdowns/Dropdowns'))

// -------- Forms --------
const ChecksRadios = React.lazy(() => import('./views/coreui-views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/coreui-views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/coreui-views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/coreui-views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/coreui-views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/coreui-views/forms/range/Range'))
const Select = React.lazy(() => import('./views/coreui-views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/coreui-views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/coreui-views/charts/Charts'))

// --------- Icons ---------
const CoreUIIcons = React.lazy(() => import('./views/coreui-views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/coreui-views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/coreui-views/icons/brands/Brands'))

// --------- Notifications ---------
const Alerts = React.lazy(() => import('./views/coreui-views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/coreui-views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/coreui-views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/coreui-views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/coreui-views/widgets/Widgets'))


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
  { path: '/filter-survey/table', name: 'Filter Survey', element: Filter_Survey_View, role_id: [2] },
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
