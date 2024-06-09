import { strings } from 'res';
import { CashHandoverIcon, ReportIcon, DeliveryIcon, OutletIcon, CustomerIcon, DashboardIcon, CommandCenterIcon, SettingIcon, SLAIcon, ProductIcon, OrderIcon } from "../assets/svg/icon";

const dashBoardNavTree = [{
  key: "Main",
  path: strings.navigation.path.dashboard,
  title: "Main",
  breadcrumb: false,
  submenu: [
    {
      key: "Dashboard",
      path: strings.navigation.path.dashboard,
      title: "Dashboard",
      icon: DashboardIcon,
      breadcrumb: false,
      submenu: []
    }
  ]
}]


const storageTree = [{
  key: "Storage",
  path: strings.navigation.path.tickets,
  title: "Storage",
  breadcrumb: false,
  submenu: [
    {
      key: "Products",
      path: strings.navigation.path.products,
      title: "Products",
      icon: ProductIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: "Orders",
      path: strings.navigation.path.orders,
      title: "Orders",
      icon: OrderIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: "Customers",
      path: strings.navigation.path.customers,
      title: "Customers",
      icon: CustomerIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: "Suppliers",
      path: strings.navigation.path.suppliers,
      title: "Suppliers",
      icon: DeliveryIcon,
      breadcrumb: false,
      submenu: []
    }, {
      key: "Categories",
      path: strings.navigation.path.categories,
      title: "Categories",
      icon: OutletIcon,
      breadcrumb: false,
      submenu: []
    }
  ]
}]

const UserManagementTree = [{
  key: "Management",
  path: strings.navigation.path.users,
  title: "Management",
  breadcrumb: false,
  submenu: [
    {
      key: "Users",
      path: strings.navigation.path.users,
      title: "Users",
      icon: CommandCenterIcon,
      breadcrumb: false,
      submenu: []
    },
    // {
    //   key: "Settings",
    //   path: strings.navigation.path.settings,
    //   title: "Settings",
    //   icon: SettingIcon,
    //   breadcrumb: false,
    //   submenu: []
    // }
  ]
}]


const ledgerTree = [{
  key: "Ledger",
  path: strings.navigation.path.expenses,
  title: "Ledger",
  breadcrumb: false,
  submenu: [
    {
      key: "Pengeluaran",
      path: strings.navigation.path.expenses,
      title: "Expenses",
      icon: SLAIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: "Purchase",
      path: strings.navigation.path.purchase,
      title: "Purchases",
      icon: CashHandoverIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: "Reports",
      path: strings.navigation.path.reports,
      title: "Summary",
      icon: ReportIcon,
      breadcrumb: false,
      submenu: []
    }
  ]
}]

const navigationConfig = [
  ...dashBoardNavTree,
  ...storageTree,
  ...ledgerTree,
  ...UserManagementTree
]

export default navigationConfig;