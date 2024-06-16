import { strings } from 'res';
import {
  CashHandoverIcon,
  ReportIcon,
  DeliveryIcon, OutletIcon,
  CustomerIcon,
  DashboardIcon,
  CommandCenterIcon, SettingIcon,
  SLAIcon,
  ProductIcon,
  OrderIcon
} from "../assets/svg/icon";

const dashBoardNavTree = [{
  key: "Main",
  path: strings.navigation.path.dashboard,
  title: "Main",
  breadcrumb: false,
  submenu: [
    {
      key: "dashboard",
      path: strings.navigation.path.dashboard,
      title: "Beranda",
      icon: DashboardIcon,
      breadcrumb: false,
      submenu: []
    }
  ]
}]


const societyTree = [{
  key: "Society",
  path: strings.navigation.path.tickets,
  title: "Masyarakat",
  breadcrumb: false,
  submenu: [
    {
      key: "Citizens",
      path: strings.navigation.path.citizen.list,
      title: "Warga",
      icon: CustomerIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: "Letter",
      path: strings.navigation.path.letter,
      title: "Surat Pengajuan",
      icon: OrderIcon,
      breadcrumb: false,
      submenu: []
    },
    // {
    //   key: "Report",
    //   path: strings.navigation.path.customers,
    //   title: "Laporan Kerusakan",
    //   icon: CustomerIcon,
    //   breadcrumb: false,
    //   submenu: []
    // },
    // {
    //   key: "Information",
    //   path: strings.navigation.path.suppliers,
    //   title: "Penyebaran Informasi",
    //   icon: DeliveryIcon,
    //   breadcrumb: false,
    //   submenu: []
    // }, 
    // {
    //   key: "Categories",
    //   path: strings.navigation.path.categories,
    //   title: "Categories",
    //   icon: OutletIcon,
    //   breadcrumb: false,
    //   submenu: []
    // }
  ]
}]

const userManagementTree = [{
  key: "Users",
  path: strings.navigation.path.users,
  title: "User",
  breadcrumb: false,
  submenu: [
    {
      key: "User",
      path: strings.navigation.path.users,
      title: "User",
      icon: CustomerIcon,
      breadcrumb: false,
      submenu: []
    },
    // {
    //   key: "Information",
    //   path: strings.navigation.path.suppliers,
    //   title: "Penyebaran Informasi",
    //   icon: DeliveryIcon,
    //   breadcrumb: false,
    //   submenu: []
    // }, 
  ]
}]


const newsTree = [{
  key: "Information",
  path: strings.navigation.path.news,
  title: "Informasi",
  breadcrumb: false,
  submenu: [
    {
      key: "News",
      path: strings.navigation.path.news,
      title: "Berita",
      icon: SLAIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: "Finance",
      path: strings.navigation.path.finance,
      title: "Keuangan",
      icon: CashHandoverIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: "Reports",
      path: strings.navigation.path.reports,
      title: "Laporan Kerusakan",
      icon: ReportIcon,
      breadcrumb: false,
      submenu: []
    }
  ]
}]

const navigationConfig = [
  ...dashBoardNavTree,
  ...societyTree,
  ...newsTree,
  ...userManagementTree
]

export default navigationConfig;