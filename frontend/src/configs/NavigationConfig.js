import {strings} from 'res';
import {
    CashHandoverIcon,
    ReportIcon,
    CustomerIcon,
    DashboardIcon,
    SLAIcon,
    OrderIcon
} from "../assets/svg/icon";

const getNavigationConfig = (role, statusAccount) => {
    if (statusAccount === 'VERIFIED') {
        return [];
    }
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
                path: strings.navigation.path.letters.list,
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
                path: strings.navigation.path.users.list,
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
        path: strings.navigation.path.informations,
        title: "Informasi",
        breadcrumb: false,
        submenu: [
            {
                key: "News",
                path: strings.navigation.path.news.list,
                title: "Berita",
                icon: SLAIcon,
                breadcrumb: false,
                submenu: []
            },
            {
                key: "Finance",
                path: strings.navigation.path.finances.list,
                title: "Keuangan",
                icon: CashHandoverIcon,
                breadcrumb: false,
                submenu: []
            },
            {
                key: "Reports",
                path: strings.navigation.path.reports.list,
                title: "Laporan Kerusakan",
                icon: ReportIcon,
                breadcrumb: false,
                submenu: []
            }
        ]
    }]

    let navigationConfig;

    if (role === 'ADMIN') {
        navigationConfig = [
            ...dashBoardNavTree,
            ...societyTree,
            ...newsTree,
            ...userManagementTree
        ];
    } else if (role === 'RW' || role === 'SECRETARY_RW' || role === 'RT' || role === 'SECRETARY_RT') {
        navigationConfig = [
            ...dashBoardNavTree,
            ...societyTree,
            {
                ...newsTree[0],
                submenu: [
                    newsTree[0].submenu.find(item => item.key === 'Reports'),
                    newsTree[0].submenu.find(item => item.key === 'News')
                ]
            }
        ];
    } else if (role === 'CITIZEN') {
        navigationConfig = [
            ...dashBoardNavTree,
            ...societyTree,
            ...newsTree
        ];
    } else {
        navigationConfig = [];
    }

    return navigationConfig;

};

// const navigationConfig = [
//     ...dashBoardNavTree,
//     ...societyTree,
//     ...newsTree,
//     ...userManagementTree
// ]


const role = localStorage.getItem('role');
const statusAccount = localStorage.getItem('status');
const navigationConfig = getNavigationConfig(role, statusAccount);

export default navigationConfig;